// hardhat.config.ts
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { NETWORK_CONFIGS, NetworkType } from './config/networks';
import '@primitivefi/hardhat-dodoc';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  dodoc: {
    runOnCompile: true,
    debugMode: false,
    outputDir: 'docs',
    include: ['contracts'],
  },
  networks: {
    hardhat: {
      chainId: NETWORK_CONFIGS[NetworkType.LOCAL].chainId,
    },
    // sepolia: {
    //   url: NETWORK_CONFIGS[NetworkType.SEPOLIA].rpcUrl,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // },
    // 'base-sepolia': {
    //   url: NETWORK_CONFIGS[NetworkType.BASE_TESTNET].rpcUrl,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // },
    // 'arbitrum-sepolia': {
    //   url: NETWORK_CONFIGS[NetworkType.ARBITRUM_TESTNET].rpcUrl,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      baseSepolia: process.env.BASESCAN_API_KEY || '',
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || '',
    },
  },
};

export default config;
