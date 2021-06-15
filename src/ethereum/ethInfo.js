/* global */
// @flow

import type {
  EdgeCorePluginOptions,
  EdgeCurrencyInfo
} from 'edge-core-js/types'

import { makeEthereumBasedPluginInner } from './ethPlugin'
import type { EthereumSettings } from './ethTypes.js'

const defaultNetworkFees = {
  default: {
    gasLimit: {
      regularTransaction: '21000',
      tokenTransaction: '300000',
      minGasLimit: '21000'
    },
    gasPrice: {
      lowFee: '1000000001',
      standardFeeLow: '40000000001',
      standardFeeHigh: '300000000001',
      standardFeeLowAmount: '100000000000000000',
      standardFeeHighAmount: '10000000000000000000',
      highFee: '40000000001',
      minGasPrice: '1000000000'
    }
  },
  '1983987abc9837fbabc0982347ad828': {
    gasLimit: {
      regularTransaction: '21002',
      tokenTransaction: '37124'
    },
    gasPrice: {
      lowFee: '1000000002',
      standardFeeLow: '40000000002',
      standardFeeHigh: '300000000002',
      standardFeeLowAmount: '200000000000000000',
      standardFeeHighAmount: '20000000000000000000',
      highFee: '40000000002'
    }
  },
  '2983987abc9837fbabc0982347ad828': {
    gasLimit: {
      regularTransaction: '21002',
      tokenTransaction: '37124'
    }
  }
}

const otherSettings: EthereumSettings = {
  rpcServers: [
    'https://eth-mainnet.alchemyapi.io',
    'https://mainnet.infura.io/v3',
    'https://cloudflare-eth.com'
  ],
  etherscanApiServers: [
    'https://api.etherscan.io'
    // 'https://blockscout.com/eth/mainnet' // not reliable enough...
  ],
  blockcypherApiServers: ['https://api.blockcypher.com'],
  blockbookServers: [
    'https://blockbook-ethereum.tronwallet.me',
    'https://eth1.trezor.io/',
    'https://eth2.bcfn.ca/'
  ],
  uriNetworks: ['ethereum', 'ether'],
  ercTokenStandard: 'ERC20',
  chainId: 1,
  hdPathCoinType: 60,
  checkUnconfirmedTransactions: true,
  iosAllowedTokens: {
    REP: true,
    WINGS: true,
    HUR: true,
    IND: true,
    USDT: true,
    AGLD: true
  },
  blockchairApiServers: ['https://api.blockchair.com'],
  alethioApiServers: ['https://api.aleth.io/v1'],
  alethioCurrencies: {
    // object or null
    native: 'ether',
    token: 'token'
  },
  amberdataRpcServers: ['https://rpc.web3api.io'],
  amberdataApiServers: ['https://web3api.io/api/v2'],
  amberDataBlockchainId: '1c9c969065fcd1cf', // ETH mainnet
  pluginMnemonicKeyName: 'ethereumMnemonic',
  pluginRegularKeyName: 'ethereumKey',
  ethGasStationUrl: 'https://www.ethgasstation.info/json/ethgasAPI.json',
  defaultNetworkFees
}

const defaultSettings: any = {
  customFeeSettings: ['gasLimit', 'gasPrice'],
  otherSettings
}

export const currencyInfo: EdgeCurrencyInfo = {
  // Basic currency information:
  currencyCode: 'ETH',
  displayName: 'Ethereum',
  pluginId: 'ethereum',
  walletType: 'wallet:ethereum',

  defaultSettings,

  addressExplorer: 'https://etherscan.io/address/%s',
  transactionExplorer: 'https://etherscan.io/tx/%s',

  denominations: [
    // An array of Objects of the possible denominations for this currency
    {
      name: 'ETH',
      multiplier: '1000000000000000000',
      symbol: 'Ξ'
    },
    {
      name: 'mETH',
      multiplier: '1000000000000000',
      symbol: 'mΞ'
    }
  ],
  metaTokens: [
    // Array of objects describing the supported metatokens
    {
      currencyCode: 'REP',
      currencyName: 'Augur',
      denominations: [
        {
          name: 'REP',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862'
    },
    {
      currencyCode: 'REPV2',
      currencyName: 'Augur v2',
      denominations: [
        {
          name: 'REPV2',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x221657776846890989a759BA2973e427DfF5C9bB'
    },
    {
      currencyCode: 'HERC',
      currencyName: 'Hercules',
      denominations: [
        {
          name: 'HERC',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x2e91E3e54C5788e9FdD6A181497FDcEa1De1bcc1'
    },
    {
      currencyCode: 'AGLD',
      currencyName: 'Anthem Gold',
      denominations: [
        {
          name: 'AGLD',
          multiplier: '1000000000'
        }
      ],
      contractAddress: '0xd668dab892f1b702a6b9ee01342508b14d4e62c5'
    },
    {
      currencyCode: 'DAI',
      currencyName: 'Dai Stablecoin',
      denominations: [
        {
          name: 'DAI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    },
    {
      currencyCode: 'SAI',
      currencyName: 'Sai Stablecoin',
      denominations: [
        {
          name: 'SAI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
    },
    {
      currencyCode: 'WINGS',
      currencyName: 'Wings',
      denominations: [
        {
          name: 'WINGS',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF'
    },
    {
      currencyCode: 'USDT',
      currencyName: 'Tether',
      denominations: [
        {
          name: 'USDT',
          multiplier: '1000000'
        }
      ],
      contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    {
      currencyCode: 'IND',
      currencyName: 'Indorse',
      denominations: [
        {
          name: 'IND',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xf8e386EDa857484f5a12e4B5DAa9984E06E73705'
    },
    {
      currencyCode: 'HUR',
      currencyName: 'Hurify',
      denominations: [
        {
          name: 'HUR',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47'
    },
    {
      currencyCode: 'ANTV1',
      currencyName: 'Aragon',
      denominations: [
        {
          name: 'ANTV1',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x960b236A07cf122663c4303350609A66A7B288C0'
    },
    {
      currencyCode: 'ANT',
      currencyName: 'Aragon',
      denominations: [
        {
          name: 'ANT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e'
    },
    {
      currencyCode: 'BAT',
      currencyName: 'Basic Attention Token',
      denominations: [
        {
          name: 'BAT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF'
    },
    {
      currencyCode: 'BNT',
      currencyName: 'Bancor',
      denominations: [
        {
          name: 'BNT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
    },
    {
      currencyCode: 'GNT',
      currencyName: 'Golem (old)',
      denominations: [
        {
          name: 'GNT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d'
    },
    {
      currencyCode: 'KNC',
      currencyName: 'Kyber Network',
      denominations: [
        {
          name: 'KNC',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200'
    },
    {
      currencyCode: 'POLY',
      currencyName: 'Polymath Network',
      denominations: [
        {
          name: 'POLY',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC'
    },
    {
      currencyCode: 'STORJ',
      currencyName: 'Storj',
      denominations: [
        {
          name: 'STORJ',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC'
    },
    {
      currencyCode: 'USDC',
      currencyName: 'USD Coin',
      denominations: [
        {
          name: 'USDC',
          multiplier: '1000000'
        }
      ],
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    {
      currencyCode: 'USDS',
      currencyName: 'StableUSD',
      denominations: [
        {
          name: 'USDS',
          multiplier: '1000000'
        }
      ],
      contractAddress: '0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe'
    },
    {
      currencyCode: 'TUSD',
      currencyName: 'TrueUSD',
      denominations: [
        {
          name: 'TUSD',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376'
    },
    {
      currencyCode: 'ZRX',
      currencyName: '0x',
      denominations: [
        {
          name: 'ZRX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xE41d2489571d322189246DaFA5ebDe1F4699F498'
    },
    {
      currencyCode: 'GNO',
      currencyName: 'Gnosis',
      denominations: [
        {
          name: 'GNO',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x6810e776880C02933D47DB1b9fc05908e5386b96'
    },
    {
      currencyCode: 'OMG',
      currencyName: 'OmiseGO',
      denominations: [
        {
          name: 'OMG',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'
    },
    {
      currencyCode: 'NMR',
      currencyName: 'Numeraire',
      denominations: [
        {
          name: 'NMR',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671'
    },
    {
      currencyCode: 'MKR',
      currencyName: 'Maker',
      denominations: [
        {
          name: 'MKR',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'
    },
    {
      currencyCode: 'GUSD',
      currencyName: 'Gemini Dollar',
      denominations: [
        {
          name: 'GUSD',
          multiplier: '100'
        }
      ],
      contractAddress: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    {
      currencyCode: 'PAX',
      currencyName: 'Paxos',
      denominations: [
        {
          name: 'PAX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x8e870d67f660d95d5be530380d0ec0bd388289e1'
    },
    {
      currencyCode: 'SALT',
      currencyName: 'SALT',
      denominations: [
        {
          name: 'SALT',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x4156D3342D5c385a87D264F90653733592000581'
    },
    {
      currencyCode: 'MANA',
      currencyName: 'Decentraland',
      denominations: [
        {
          name: 'MANA',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'
    },
    {
      currencyCode: 'NEXO',
      currencyName: 'Nexo',
      denominations: [
        {
          name: 'NEXO',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206'
    },
    {
      currencyCode: 'FUN',
      currencyName: 'FunFair',
      denominations: [
        {
          name: 'FUN',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b'
    },
    {
      currencyCode: 'KIN',
      currencyName: 'Kin',
      denominations: [
        {
          name: 'KIN',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5'
    },
    {
      currencyCode: 'LINK',
      currencyName: 'Chainlink',
      denominations: [
        {
          name: 'LINK',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca'
    },
    {
      currencyCode: 'BRZ',
      currencyName: 'BRZ Token',
      denominations: [
        {
          name: 'BRZ',
          multiplier: '10000'
        }
      ],
      contractAddress: '0x420412E765BFa6d85aaaC94b4f7b708C89be2e2B'
    },
    {
      currencyCode: 'CREP',
      currencyName: 'Compound Augur',
      denominations: [
        {
          name: 'CREP',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1'
    },
    {
      currencyCode: 'CUSDC',
      currencyName: 'Compound USDC',
      denominations: [
        {
          name: 'CUSDC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x39aa39c021dfbae8fac545936693ac917d5e7563'
    },
    {
      currencyCode: 'CETH',
      currencyName: 'Compound ETH',
      denominations: [
        {
          name: 'CETH',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'
    },
    {
      currencyCode: 'CBAT',
      currencyName: 'Compound BAT',
      denominations: [
        {
          name: 'CBAT',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e'
    },
    {
      currencyCode: 'CZRX',
      currencyName: 'Compound ZRX',
      denominations: [
        {
          name: 'CZRX',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407'
    },
    {
      currencyCode: 'CWBTC',
      currencyName: 'Compound WBTC',
      denominations: [
        {
          name: 'CWBTC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4'
    },
    {
      currencyCode: 'CSAI',
      currencyName: 'Compound SAI',
      denominations: [
        {
          name: 'CSAI',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0xf5dce57282a584d2746faf1593d3121fcac444dc'
    },
    {
      currencyCode: 'CDAI',
      currencyName: 'Compound DAI',
      denominations: [
        {
          name: 'CDAI',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643'
    },
    {
      currencyCode: 'ETHBNT',
      currencyName: 'BNT Smart Token Relay',
      denominations: [
        {
          name: 'ETHBNT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'
    },
    {
      currencyCode: 'OXT',
      currencyName: 'Orchid',
      denominations: [
        {
          name: 'OXT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb'
    },
    {
      currencyCode: 'COMP',
      currencyName: 'Compound',
      denominations: [
        {
          name: 'COMP',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888'
    },
    {
      currencyCode: 'MET',
      currencyName: 'Metronome',
      denominations: [
        {
          name: 'MET',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xa3d58c4e56fedcae3a7c43a725aee9a71f0ece4e'
    },
    {
      currencyCode: 'SNX',
      currencyName: 'Synthetix Network',
      denominations: [
        {
          name: 'SNX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'
    },
    {
      currencyCode: 'SUSD',
      currencyName: 'Synthetix USD',
      denominations: [
        {
          name: 'SUSD',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51'
    },
    {
      currencyCode: 'SBTC',
      currencyName: 'Synthetix BTC',
      denominations: [
        {
          name: 'SBTC',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6'
    },
    {
      currencyCode: 'AAVE',
      currencyName: 'Aave',
      denominations: [
        {
          name: 'AAVE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
    },
    {
      currencyCode: 'AYFI',
      currencyName: 'Aave Interest Bearing YFI',
      denominations: [
        {
          name: 'AYFI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x5165d24277cd063f5ac44efd447b27025e888f37'
    },
    {
      currencyCode: 'ALINK',
      currencyName: 'Aave Interest Bearing LINK',
      denominations: [
        {
          name: 'ALINK',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xa06bc25b5805d5f8d82847d191cb4af5a3e873e0'
    },
    {
      currencyCode: 'ADAI',
      currencyName: 'Aave Interest Bearing Dai',
      denominations: [
        {
          name: 'ADAI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3'
    },
    {
      currencyCode: 'ABAT',
      currencyName: 'Aave Interest Bearing BAT',
      denominations: [
        {
          name: 'ABAT',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x05ec93c0365baaeabf7aeffb0972ea7ecdd39cf1'
    },
    {
      currencyCode: 'AWETH',
      currencyName: 'Aave Interest Bearing Wrapped ETH',
      denominations: [
        {
          name: 'AWETH',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
    },
    {
      currencyCode: 'AWBTC',
      currencyName: 'Aave Interest Bearing Wrapped BTC',
      denominations: [
        {
          name: 'AWBTC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656'
    },
    {
      currencyCode: 'ASNX',
      currencyName: 'Aave Interest Bearing SNX',
      denominations: [
        {
          name: 'ASNX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x35f6b052c598d933d69a4eec4d04c73a191fe6c2'
    },
    {
      currencyCode: 'AREN',
      currencyName: 'Aave Interest Bearing REN',
      denominations: [
        {
          name: 'AREN',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xcc12abe4ff81c9378d670de1b57f8e0dd228d77a'
    },
    {
      currencyCode: 'AUSDT',
      currencyName: 'Aave Interest Bearing USDT',
      denominations: [
        {
          name: 'AUSDT',
          multiplier: '1000000'
        }
      ],
      contractAddress: '0x3ed3b47dd13ec9a98b44e6204a523e766b225811'
    },
    {
      currencyCode: 'AMKR',
      currencyName: 'Aave Interest Bearing MKR',
      denominations: [
        {
          name: 'AMKR',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xc713e5e149d5d0715dcd1c156a020976e7e56b88'
    },
    {
      currencyCode: 'AMANA',
      currencyName: 'Aave Interest Bearing MANA',
      denominations: [
        {
          name: 'AMANA',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xa685a61171bb30d4072b338c80cb7b2c865c873e'
    },
    {
      currencyCode: 'AZRX',
      currencyName: 'Aave Interest Bearing ZRX',
      denominations: [
        {
          name: 'AZRX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xdf7ff54aacacbff42dfe29dd6144a69b629f8c9e'
    },
    {
      currencyCode: 'AKNC',
      currencyName: 'Aave Interest Bearing KNC',
      denominations: [
        {
          name: 'AKNC',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x39c6b3e42d6a679d7d776778fe880bc9487c2eda'
    },
    {
      currencyCode: 'AUSDC',
      currencyName: 'Aave Interest Bearing USDC',
      denominations: [
        {
          name: 'AUSDC',
          multiplier: '1000000'
        }
      ],
      contractAddress: '0xbcca60bb61934080951369a648fb03df4f96263c'
    },
    {
      currencyCode: 'ASUSD',
      currencyName: 'Aave Interest Bearing SUSD',
      denominations: [
        {
          name: 'ASUSD',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x6c5024cd4f8a59110119c56f8933403a539555eb'
    },
    {
      currencyCode: 'AUNI',
      currencyName: 'Aave Interest Bearing UNI',
      denominations: [
        {
          name: 'AUNI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xb9d7cb55f463405cdfbe4e90a6d2df01c2b92bf1'
    },
    {
      currencyCode: 'WBTC',
      currencyName: 'Wrapped Bitcoin',
      denominations: [
        {
          name: 'WBTC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
    },
    {
      currencyCode: 'YFI',
      currencyName: 'Yearn Finance',
      denominations: [
        {
          name: 'YFI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
    },
    {
      currencyCode: 'CRV',
      currencyName: 'Curve DAO Token',
      denominations: [
        {
          name: 'CRV',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xD533a949740bb3306d119CC777fa900bA034cd52'
    },
    {
      currencyCode: 'BAL',
      currencyName: 'Balancer',
      denominations: [
        {
          name: 'BAL',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xba100000625a3754423978a60c9317c58a424e3d'
    },
    {
      currencyCode: 'SUSHI',
      currencyName: 'Sushi Token',
      denominations: [
        {
          name: 'SUSHI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2'
    },
    {
      currencyCode: 'UMA',
      currencyName: 'UMA',
      denominations: [
        {
          name: 'UMA',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828'
    },
    {
      currencyCode: 'BADGER',
      currencyName: 'Badger',
      denominations: [
        {
          name: 'BADGER',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
    },
    {
      currencyCode: 'IDLE',
      currencyName: 'Idle Finance',
      denominations: [
        {
          name: 'IDLE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e'
    },
    {
      currencyCode: 'NXM',
      currencyName: 'Nexus Mutual',
      denominations: [
        {
          name: 'NXM',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b'
    },
    {
      currencyCode: 'CREAM',
      currencyName: 'Cream',
      denominations: [
        {
          name: 'CREAM',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x2ba592F78dB6436527729929AAf6c908497cB200'
    },
    {
      currencyCode: 'PICKLE',
      currencyName: 'PickleToken',
      denominations: [
        {
          name: 'PICKLE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5'
    },
    {
      currencyCode: 'CVP',
      currencyName: 'Concentrated Voting Power',
      denominations: [
        {
          name: 'CVP',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1'
    },
    {
      currencyCode: 'ROOK',
      currencyName: 'Keeper DAO',
      denominations: [
        {
          name: 'ROOK',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a'
    },
    {
      currencyCode: 'DOUGH',
      currencyName: 'PieDAO',
      denominations: [
        {
          name: 'DOUGH',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xad32a8e6220741182940c5abf610bde99e737b2d'
    },
    {
      currencyCode: 'COMBO',
      currencyName: 'COMBO',
      denominations: [
        {
          name: 'COMBO',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xffffffff2ba8f66d4e51811c5190992176930278'
    },
    {
      currencyCode: 'INDEX',
      currencyName: 'INDEX COOP',
      denominations: [
        {
          name: 'INDEX',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0954906da0Bf32d5479e25f46056d22f08464cab'
    },
    {
      currencyCode: 'WETH',
      currencyName: 'Wrapped ETH',
      denominations: [
        {
          name: 'WETH',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    {
      currencyCode: 'RENBTC',
      currencyName: 'Ren BTC',
      denominations: [
        {
          name: 'RENBTC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d'
    },
    {
      currencyCode: 'RENBCH',
      currencyName: 'Ren BCH',
      denominations: [
        {
          name: 'RENBCH',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x459086f2376525bdceba5bdda135e4e9d3fef5bf'
    },
    {
      currencyCode: 'RENZEC',
      currencyName: 'Ren ZEC',
      denominations: [
        {
          name: 'RENZEC',
          multiplier: '100000000'
        }
      ],
      contractAddress: '0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2'
    },
    {
      currencyCode: 'TBTC',
      currencyName: 'tBTC',
      denominations: [
        {
          name: 'TBTC',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa'
    },
    {
      currencyCode: 'DPI',
      currencyName: 'DefiPulse Index',
      denominations: [
        {
          name: 'DPI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b'
    },
    {
      currencyCode: 'YETI',
      currencyName: 'Yearn Ecosystem Token Index',
      denominations: [
        {
          name: 'YETI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xb4bebd34f6daafd808f73de0d10235a92fbb6c3d'
    },
    {
      currencyCode: 'BAND',
      currencyName: 'BAND',
      denominations: [
        {
          name: 'BAND',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55'
    },
    {
      currencyCode: 'REN',
      currencyName: 'Ren',
      denominations: [
        {
          name: 'REN',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x408e41876cccdc0f92210600ef50372656052a38'
    },
    {
      currencyCode: 'AMPL',
      currencyName: 'Ampleforth',
      denominations: [
        {
          name: 'AMPL',
          multiplier: '1000000000'
        }
      ],
      contractAddress: '0xd46ba6d942050d489dbd938a2c909a5d5039a161'
    },
    {
      currencyCode: 'OCEAN',
      currencyName: 'OCEAN',
      denominations: [
        {
          name: 'OCEAN',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48'
    },
    {
      currencyCode: 'GLM',
      currencyName: 'Golem',
      denominations: [
        {
          name: 'GLM',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429'
    },
    {
      currencyCode: 'UNI',
      currencyName: 'Uniswap',
      denominations: [
        {
          name: 'UNI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    },
    {
      currencyCode: 'ETH2X-FLI',
      currencyName: 'ETH2x-Flexible Leverage Index',
      denominations: [
        {
          name: 'ETH2X-FLI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd'
    },
    {
      currencyCode: 'BTC2X-FLI',
      currencyName: 'BTC2x-Flexible Leverage Index',
      denominations: [
        {
          name: 'BTC2X-FLI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0b498ff89709d3838a063f1dfa463091f9801c2b'
    },
    {
      currencyCode: 'MVI',
      currencyName: 'Metaverse Index',
      denominations: [
        {
          name: 'MVI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x72e364f2abdc788b7e918bc238b21f109cd634d7'
    },
    {
      currencyCode: 'PLAY',
      currencyName: 'Metaverse NFT Index',
      denominations: [
        {
          name: 'PLAY',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4'
    },
    {
      currencyCode: 'DEFI+L',
      currencyName: 'DeFi Large Caps',
      denominations: [
        {
          name: 'DEFI+L',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78'
    },
    {
      currencyCode: 'YPIE',
      currencyName: 'Yearn Ecosystem Pie',
      denominations: [
        {
          name: 'YPIE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x17525e4f4af59fbc29551bc4ece6ab60ed49ce31'
    },
    {
      currencyCode: 'BCP',
      currencyName: 'Balanced Crypto Pie',
      denominations: [
        {
          name: 'BCP',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xe4f726adc8e89c6a6017f01eada77865db22da14'
    },
    {
      currencyCode: 'DEFI++',
      currencyName: 'DeFi Large & Small Caps',
      denominations: [
        {
          name: 'DEFI++',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x8d1ce361eb68e9e05573443c407d4a3bed23b033'
    },
    {
      currencyCode: 'DEFI+S',
      currencyName: 'DeFi Small Caps',
      denominations: [
        {
          name: 'DEFI+S',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c'
    },
    {
      currencyCode: 'ASSY',
      currencyName: 'ASSY Index',
      denominations: [
        {
          name: 'ASSY',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xfa2562da1bba7b954f26c74725df51fb62646313'
    },
    {
      currencyCode: 'TCAP',
      currencyName: 'Total Crypto Market Cap',
      denominations: [
        {
          name: 'TCAP',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x16c52CeeCE2ed57dAd87319D91B5e3637d50aFa4'
    },
    {
      currencyCode: 'STETH',
      currencyName: 'Lido Staked Ether',
      denominations: [
        {
          name: 'STETH',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
    },
    {
      currencyCode: 'RUNE',
      currencyName: 'THORChain ETH.RUNE',
      denominations: [
        {
          name: 'RUNE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x3155ba85d5f96b2d030a4966af206230e46849cb'
    },
    {
      currencyCode: 'RENFIL',
      currencyName: 'Ren Filecoin',
      denominations: [
        {
          name: 'RENFIL',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0xD5147bc8e386d91Cc5DBE72099DAC6C9b99276F5'
    },
    {
      currencyCode: 'RENDOGE',
      currencyName: 'Ren Dogecoin',
      denominations: [
        {
          name: 'RENDOGE',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x3832d2F059E55934220881F831bE501D180671A7'
    },
    {
      currencyCode: 'BDI',
      currencyName: 'BasketDAO DeFi Index',
      denominations: [
        {
          name: 'BDI',
          multiplier: '1000000000000000000'
        }
      ],
      contractAddress: '0x0309c98B1bffA350bcb3F9fB9780970CA32a5060'
    }
  ]
}

export const makeEthereumPlugin = (opts: EdgeCorePluginOptions) => {
  return makeEthereumBasedPluginInner(opts, currencyInfo)
}
