// scripts/deploy.ts
import { ethers } from 'hardhat';
import { NETWORK_CONFIGS, NetworkType } from '../config/networks';
import fs from 'fs';

async function main() {
  const networkName = process.env.HARDHAT_NETWORK || 'hardhat';
  const networkType = networkName as NetworkType;

  const PulseSBT = await ethers.getContractFactory('PulseSBT');
  const pulseSBT = await PulseSBT.deploy();
  await pulseSBT.waitForDeployment();
  const pulseSBTAddress = await pulseSBT.getAddress();

  // Déploiement
  const Pulse = await ethers.getContractFactory('Pulse');
  const pulse = await Pulse.deploy(pulseSBTAddress);
  await pulse.waitForDeployment();
  const pulseAddress = await pulse.getAddress();
  await pulseSBT.setPulseAddress(pulseAddress);

  // Mise à jour des configs
  NETWORK_CONFIGS[networkType].contractAddresses = {
    pulse: pulseAddress,
    // autres contrats...
  };

  // Sauvegarder les adresses
  fs.writeFileSync(
    `config/addresses.${networkName}.json`,
    JSON.stringify(NETWORK_CONFIGS[networkType].contractAddresses, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
