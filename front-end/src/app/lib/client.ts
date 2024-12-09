import { createPublicClient, http } from "viem";
import { hardhat, holesky, mainnet, polygon } from "viem/chains";

export const publicClients = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545/"),
});

// hardhat: createPublicClient({
//   chain: hardhat,
//   transport: http(),
// }),
// holesky: createPublicClient({
//   chain: holesky,
//   transport: http(process.env.HOLESKY_RPC),
// }),
// mainnet: createPublicClient({
//   chain: mainnet,
//   transport: http(process.env.MAINNET_RPC),
// }),
// polygon: createPublicClient({
//   chain: polygon,
//   transport: http(process.env.POLYGON_RPC),
// }),
// };
