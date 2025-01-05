import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "Pulse",
  projectId: process.env.WALLET_CONNECT_PROJECT_ID || "",
  chains: [hardhat, sepolia],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(`${process.env.ALCHEMY_API_KEY}`),
  },
});
