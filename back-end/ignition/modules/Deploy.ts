// ignition/modules/Deploy.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("PulseDeployment", (m) => {
    // Déployer PulseSBT
    const pulseSBT = m.contract("PulseSBT");

    // Déployer Pulse en passant l'adresse de PulseSBT
    const pulse = m.contract("Pulse", [
        pulseSBT.address, // Passer l'adresse de PulseSBT
    ]);

    // Configurer l'adresse de Pulse dans PulseSBT
    m.call(pulseSBT, "setPulseAddress", [pulse.address]);

    return {
        pulseSBT,
        pulse,
    };
});
