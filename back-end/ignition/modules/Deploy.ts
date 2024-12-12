// Ignition script for deploying multiple contracts on Hardhat
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("MultiContractDeployment", (m) => {
    const pulseSBT = m.contract("PulseSBT", []);

    const pulseMain = m.contract("Pulse", [pulseSBT]);

    // Deploy the third contract without dependencies
    // const contractC = m.contract("ContractC");

    // Link contracts if needed
    // For example, setting ContractA's address in ContractC
    // m.call(contractC, "setContractA", [contractA]);

    return { pulseMain, pulseSBT };
});
