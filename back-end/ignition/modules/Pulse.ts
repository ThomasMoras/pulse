// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const PulseModule = buildModule("PulseModule", (m) => {
  const pulse = m.contract("Pulse", [], {});
  return { pulse };
});

export default PulseModule;
