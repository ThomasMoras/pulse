export type SupportedChains = "ethereum" | "base" | "arbitrum";

export const CHAIN_CONFIG = {
  ethereum: {
    name: "ethereum",
    id: 1,
    testnet: {
      name: "sepolia",
      id: 11155111,
    },
  },
  base: {
    name: "base",
    id: 8453,
    testnet: {
      name: "base-sepolia",
      id: 84532,
    },
  },
  arbitrum: {
    name: "arbitrum",
    id: 42161,
    testnet: {
      name: "arbitrum-sepolia",
      id: 421614,
    },
  },
} as const;
