/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,
  KOVAN = 42,

  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  BSC = 56,
  BSC_TESTNET = 97,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.KOVAN]: 'kovan',

  [SupportedChainId.POLYGON]: 'polygon',
  [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',

  [SupportedChainId.OPTIMISM]: 'optimism',
  [SupportedChainId.OPTIMISTIC_KOVAN]: 'optimistic_kovan',

  [SupportedChainId.BSC]: 'bsc',
  [SupportedChainId.BSC_TESTNET]: 'bsc_testnet',
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[];

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.BSC,
];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.KOVAN,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BSC,
  SupportedChainId.BSC_TESTNET,
] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [SupportedChainId.OPTIMISM, SupportedChainId.OPTIMISTIC_KOVAN] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];
