import { bns } from 'biggystring'
import type { EdgeTransaction } from 'edge-core-js/src/types/types'

import { snooze, validateObject } from '../common/utils'
import { EthereumEngine } from './ethEngine'
import { currencyInfo } from './ethInfo'
import {
  EtherscanGetAccountBalance,
  EtherscanGetAccountNonce,
  EtherscanGetBlockHeight,
  EtherscanGetTokenTransactions,
  EtherscanGetTransactions
} from './ethSchema'

const BLOCKHEIGHT_POLL_MILLISECONDS = 20000
const NONCE_POLL_MILLISECONDS = 20000
const BAL_POLL_MILLISECONDS = 20000
const TXS_POLL_MILLISECONDS = 20000

const ADDRESS_QUERY_LOOKBACK_BLOCKS = 4 * 60 * 24 * 7 // ~ one week
const NUM_TRANSACTIONS_TO_QUERY = 50
const PRIMARY_CURRENCY = currencyInfo.currencyCode

type EthereumNeeds = {
  blockHeightLastChecked: number,
  nonceLastChecked: number,
  tokenBalLastChecked: { [currencyCode: string]: number },
  tokenTxsLastChecked: { [currencyCode: string]: number }
}

type EdgeTransactionsBlockHeightTuple = {
  blockHeight: number,
  edgeTransactions: Array<EdgeTransaction>
}

type EthereumNetworkUpdate = {
  blockHeight?: number,
  nonce?: number,
  tokenBal?: { [currencyCode: string]: string },
  tokenTxs?: { [currencyCode: string]: EdgeTransactionsBlockHeightTuple }
}

export class EthereumNetwork {
  ethNeeds: EthereumNeeds
  constructor(ethEngine: EthereumEngine) {
    this.ethEngine = ethEngine
    this.ethNeeds = {
      blockHeightLastChecked: 0,
      nonceLastChecked: 0,
      tokenBalLastChecked: {},
      tokenTxsLastChecked: {}
    }

    this.checkBlockHeight = this.checkBlockHeight.bind(this)
    this.checkNonce = this.checkNonce.bind(this)
    this.checkTxs = this.checkTxs.bind(this)
    this.checkTokenBal = this.checkTokenBal.bind(this)
    this.checkAndUpdate = this.checkAndUpdate.bind(this)
    this.needsLoop = this.needsLoop.bind(this)
    this.processEthereumNetworkUpdate = this.processEthereumNetworkUpdate.bind(
      this
    )
  }

  async checkBlockHeight(): Promise<EthereumNetworkUpdate> {
    try {
      const jsonObj = await this.ethEngine.multicastServers('eth_blockNumber')
      const valid = validateObject(jsonObj, EtherscanGetBlockHeight)
      if (valid) {
        const blockHeight = parseInt(jsonObj.result, 16)
        return { blockHeight }
      }
    } catch (err) {
      this.ethEngine.log('Error fetching height: ' + err)
    }
    return {}
  }

  async checkNonce(): Promise<EthereumNetworkUpdate> {
    try {
      const address = this.ethEngine.walletLocalData.publicKey
      const jsonObj = await this.ethEngine.multicastServers(
        'eth_getTransactionCount',
        address
      )
      const valid = validateObject(jsonObj, EtherscanGetAccountNonce)
      if (valid) {
        const nonce = bns.add('0', jsonObj.result)
        return { nonce }
      }
    } catch (err) {
      this.ethEngine.log('Error fetching height: ' + err)
    }
    return {}
  }

  async checkTxs(
    startBlock: number,
    currencyCode: string
  ): Promise<EthereumNetworkUpdate> {
    const address = this.ethEngine.walletLocalData.publicKey
    let page = 1
    let contractAddress = ''
    let schema

    if (currencyCode === PRIMARY_CURRENCY) {
      schema = EtherscanGetTransactions
    } else {
      const tokenInfo = this.ethEngine.getTokenInfo(currencyCode)
      if (tokenInfo && typeof tokenInfo.contractAddress === 'string') {
        contractAddress = tokenInfo.contractAddress
        schema = EtherscanGetTokenTransactions
      } else {
        return {}
      }
    }

    const allTransactions = []
    try {
      while (1) {
        const offset = NUM_TRANSACTIONS_TO_QUERY
        const jsonObj = await this.ethEngine.multicastServers(
          'getTransactions',
          {
            currencyCode,
            address,
            startBlock,
            page,
            offset,
            contractAddress
          }
        )
        const valid = validateObject(jsonObj, schema)
        if (valid) {
          const transactions = jsonObj.result
          for (let i = 0; i < transactions.length; i++) {
            const tx = this.ethEngine.processEtherscanTransaction(
              transactions[i],
              currencyCode
            )
            allTransactions.push(tx)
          }
          if (transactions.length < NUM_TRANSACTIONS_TO_QUERY) {
            break
          }
          page++
        } else {
          break
        }
      }
    } catch (e) {
      this.ethEngine.log(
        `Error checkTransactionsFetch ETH: ${this.ethEngine.walletLocalData.publicKey}`,
        e
      )
    }

    if (allTransactions.length > 0) {
      const edgeTransactionsBlockHeightTuple: EdgeTransactionsBlockHeightTuple = {
        blockHeight: startBlock,
        edgeTransactions: allTransactions
      }
      return {
        tokenTxs: { [currencyCode]: edgeTransactionsBlockHeightTuple }
      }
    }
    return {}
  }

  async checkTokenBal(tk: string): Promise<EthereumNetworkUpdate> {
    const address = this.ethEngine.walletLocalData.publicKey
    let jsonObj = {}
    let valid = false

    try {
      if (tk === PRIMARY_CURRENCY) {
        jsonObj = await this.ethEngine.multicastServers(
          'eth_getBalance',
          address
        )
      } else {
        const tokenInfo = this.ethEngine.getTokenInfo(tk)
        const contractAddress = tokenInfo.contractAddress
        jsonObj = await this.ethEngine.multicastServers(
          'getTokenBalance',
          address,
          contractAddress
        )
      }
      valid = validateObject(jsonObj, EtherscanGetAccountBalance)
      if (valid) {
        const balance = jsonObj.result
        return { tokenBal: { [tk]: balance } }
      }
    } catch (e) {
      this.ethEngine.log(`Error checking token balance: ${tk}`)
    }
    return {}
  }

  async checkAndUpdate(
    lastChecked: number = 0,
    pollMillisec: number,
    preUpdateBlockHeight: number,
    checkFunc: () => EthereumNetworkUpdate
  ) {
    const now = Date.now()
    if (now - lastChecked > pollMillisec) {
      const ethUpdate = await checkFunc()
      this.processEthereumNetworkUpdate(now, ethUpdate, preUpdateBlockHeight)
    }
  }

  getQueryHeightWithLookback(queryHeight: number): number {
    if (queryHeight > ADDRESS_QUERY_LOOKBACK_BLOCKS) {
      // Only query for transactions as far back as ADDRESS_QUERY_LOOKBACK_BLOCKS from the last time we queried transactions
      return queryHeight - ADDRESS_QUERY_LOOKBACK_BLOCKS
    } else {
      return 0
    }
  }

  async needsLoop(): Promise<void> {
    while (this.ethEngine.engineOn) {
      const preUpdateBlockHeight = this.ethEngine.walletLocalData.blockHeight
      await this.checkAndUpdate(
        this.ethNeeds.blockHeightLastChecked,
        BLOCKHEIGHT_POLL_MILLISECONDS,
        preUpdateBlockHeight,
        this.checkBlockHeight
      )

      await this.checkAndUpdate(
        this.ethNeeds.nonceLastChecked,
        NONCE_POLL_MILLISECONDS,
        preUpdateBlockHeight,
        this.checkNonce
      )

      for (const tk of this.ethEngine.walletLocalData.enabledTokens) {
        await this.checkAndUpdate(
          this.ethNeeds.tokenBalLastChecked[tk],
          BAL_POLL_MILLISECONDS,
          preUpdateBlockHeight,
          async () => this.checkTokenBal(tk)
        )

        await this.checkAndUpdate(
          this.ethNeeds.tokenTxsLastChecked[tk],
          TXS_POLL_MILLISECONDS,
          preUpdateBlockHeight,
          async () =>
            this.checkTxs(
              this.getQueryHeightWithLookback(
                this.ethEngine.walletLocalData.lastTransactionQueryHeight[tk]
              ),
              tk
            )
        )
      }

      await snooze(1000)
    }
  }

  processEthereumNetworkUpdate(
    now: number,
    ethereumNetworkUpdate: EthereumNetworkUpdate,
    preUpdateBlockHeight: number
  ) {
    if (!ethereumNetworkUpdate) return
    if (ethereumNetworkUpdate.blockHeight) {
      const blockHeight = ethereumNetworkUpdate.blockHeight
      this.ethEngine.log(`Got block height ${blockHeight}`)
      if (this.ethEngine.walletLocalData.blockHeight !== blockHeight) {
        this.ethNeeds.blockHeightLastChecked = now
        this.ethEngine.checkDroppedTransactionsThrottled()
        this.ethEngine.walletLocalData.blockHeight = blockHeight // Convert to decimal
        this.ethEngine.walletLocalDataDirty = true
        this.ethEngine.currencyEngineCallbacks.onBlockHeightChanged(
          this.ethEngine.walletLocalData.blockHeight
        )
      }
    }

    if (ethereumNetworkUpdate.nonce) {
      this.ethNeeds.nonceLastChecked = now
      this.ethEngine.walletLocalData.otherData.nextNonce =
        ethereumNetworkUpdate.nonce
      this.ethEngine.walletLocalDataDirty = true
    }

    if (ethereumNetworkUpdate.tokenBal) {
      for (const tk of Object.keys(ethereumNetworkUpdate.tokenBal)) {
        this.ethNeeds.tokenBalLastChecked[tk] = now
        this.ethEngine.updateBalance(tk, ethereumNetworkUpdate.tokenBal[tk])
      }
    }

    if (ethereumNetworkUpdate.tokenTxs) {
      for (const tk of Object.keys(ethereumNetworkUpdate.tokenTxs)) {
        this.ethNeeds.tokenTxsLastChecked[tk] = now
        this.ethEngine.tokenCheckTransactionsStatus[tk] = 1
        const tuple: EdgeTransactionsBlockHeightTuple =
          ethereumNetworkUpdate.tokenTxs[tk]
        if (tuple.edgeTransactions) {
          for (const tx: EdgeTransaction of tuple.edgeTransactions) {
            this.ethEngine.addTransaction(tk, tx)
          }
          this.ethEngine.walletLocalData.lastTransactionQueryHeight[
            tk
          ] = preUpdateBlockHeight
        }
      }
      this.ethEngine.updateOnAddressesChecked()
    }

    if (this.ethEngine.transactionsChangedArray.length > 0) {
      this.ethEngine.currencyEngineCallbacks.onTransactionsChanged(
        this.ethEngine.transactionsChangedArray
      )
      this.ethEngine.transactionsChangedArray = []
    }
  }
}
