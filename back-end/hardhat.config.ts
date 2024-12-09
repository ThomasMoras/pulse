import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
// import "@nomicfoundation/hardhat-toolbox-viem";
// import "@nomicfoundation/hardhat-viem";
import "solidity-docgen";
import "dotenv/config";

const { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, PRIVATE_KEY } = process.env;

// console.log(ALCHEMY_API_KEY);

const config: HardhatUserConfig = {
  docgen: { outputDir: "doc" },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // sepolia: {
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   chainId: 11155111,
    //   url: ALCHEMY_API_KEY,
    // },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
