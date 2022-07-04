const CRYPTO_ICON_URL = 'https://statics.incognito.org/cmc/symbols/128x128';
const isMainnet = true;

const PRV = {
  id: '0000000000000000000000000000000000000000000000000000000000000004',
  name: 'Privacy',
  displayName: 'Privacy',
  symbol: 'PRV',
  pDecimals: 9,
  hasIcon: true,
  originalSymbol: 'PRV',
  isVerified: true,
};

const NETWORK_NAME = {
  BINANCE: 'Binance',
  ETHEREUM: 'Ethereum',
  TOMO: 'TomoChain',
  BSC: 'Binance Smart Chain',
  PRV: 'Privacy',
  POLYGON: 'Polygon',
  FANTOM: 'Fantom',
};

const PRIVATE_TOKEN_CURRENCY_TYPE = {
  ETH: 1,
  BTC: 2,
  ERC20: 3,
  BNB: 4,
  BNB_BEP2: 5,
  USD: 6,
  BSC_BNB: 7,
  BSC_BEP20: 8,
  TOMO: 9,
  ZIL: 10,
  XMR: 11,
  NEO: 12,
  DASH: 13,
  LTC: 14,
  DOGE: 15,
  ZEC: 16,
  DOT: 17,
  INCOGNITO: 18,
  MATIC: 19,
  POLYGON_ERC20: 20,
  FTM: 21,
  FANTOM_ERC20: 22,
  UNIFIED_TOKEN: 25,
};

const PRIVATE_TOKEN_CURRENCY_NAME = {
  [PRIVATE_TOKEN_CURRENCY_TYPE.ERC20]: 'ERC20 Ethereum',
  [PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20]: 'BEP20 Smart Chain',
  [PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20]: 'ERC20 Polygon',
  [PRIVATE_TOKEN_CURRENCY_TYPE.FANTOM_ERC20]: 'ERC20 Fantom',
};

const DECIMALS = {
  MAIN_CRYPTO_CURRENCY: 9,
  [PRV.symbol]: 9,
};

const BIG_COINS = {
  PRV: PRV.id,
  USDT: isMainnet
    ? '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0'
    : 'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
};

const PRIVATE_TOKEN_TYPE = {
  COIN: 0,
  TOKEN: 1, // including ERC20, BEP1, BEP2,...
};

export {
  BIG_COINS,
  CRYPTO_ICON_URL,
  DECIMALS,
  NETWORK_NAME,
  PRIVATE_TOKEN_CURRENCY_NAME,
  PRIVATE_TOKEN_CURRENCY_TYPE,
  PRIVATE_TOKEN_TYPE,
  PRV,
};