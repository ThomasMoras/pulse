import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia, baseSepolia } from "wagmi/chains";
import { http } from "wagmi";
import * as dotenv from "dotenv";
dotenv.config();

export const config = getDefaultConfig({
  appName: "Pulse",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [hardhat, baseSepolia, sepolia],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(`${process.env.ETHER_SEPOLIA_RPC}`),
    [baseSepolia.id]: http(
      `${process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC}${process.env.NEXT_PUBLIC_BASE_SEPOLIA_API_KEY}`
    ),
  },
});
