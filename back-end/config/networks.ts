// config/networks.ts
export enum NetworkType {
  LOCAL = 'local',
  SEPOLIA = 'sepolia',
  BASE_TESTNET = 'base-sepolia',
  //   ARBITRUM_TESTNET = 'arbitrum-sepolia',
}

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  litChainName: string;
  contractAddresses?: {
    pulse?: string; // Adresses des contrats déployés
    pulseSBT?: string;
  };
}

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  [NetworkType.LOCAL]: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    litChainName: 'sepolia',
  },
  [NetworkType.SEPOLIA]: {
    chainId: 11155111,
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    litChainName: 'sepolia',
  },
  [NetworkType.BASE_TESTNET]: {
    chainId: 84532,
    rpcUrl: 'https://base-sepolia.rpc...',
    litChainName: 'base-sepolia',
  },
  //   [NetworkType.ARBITRUM_TESTNET]: undefined,
};
