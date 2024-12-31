// scripts/deploy.ts
import { ethers } from 'hardhat';
import { user1Data, user2Data, user3Data, user4Data } from '../test/hardhat/utils/CommonData';
import { createAccounts } from './helperUsers';

async function main() {
  // Récupérer le signataire (déployeur)
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Déployer PulseSBT
  const PulseSBT = await ethers.getContractFactory('PulseSBT');
  const pulseSBT = await PulseSBT.deploy();
  await pulseSBT.waitForDeployment();
  const pulseSBTAddress = await pulseSBT.getAddress();
  console.log('PulseSBT deployed to:', pulseSBTAddress);

  // Déployer Pulse
  const Pulse = await ethers.getContractFactory('Pulse');
  const pulse = await Pulse.deploy(
    pulseSBTAddress // Passer directement l'adresse du contrat PulseSBT
  );
  await pulse.waitForDeployment();
  const pulseAddress = await pulse.getAddress();
  console.log('Pulse deployed to:', pulseAddress);

  // Définir l'adresse du contrat Pulse dans PulseSBT
  await pulseSBT.setPulseAddress(pulseAddress);
  console.log('Pulse contract address set in PulseSBT contract');

  // Vérifier que toutes les configurations sont correctement définies
  const sbtAddressInPulse = await pulse.pulseSBT();
  const pulseAddressInSBT = await pulseSBT.getPulseContractAddress();

  console.log('Verification:');
  console.log('SBT contract in Pulse:', sbtAddressInPulse);
  console.log('Pulse contract in SBT:', pulseAddressInSBT);

  console.log('Creating a set of accounts for testing :');
  await createAccounts(pulse);

  // Vérification des adresses
  if (sbtAddressInPulse === pulseSBTAddress && pulseAddressInSBT === pulseAddress) {
    console.log('All addresses are correctly set!');
  } else {
    console.error("There's a mismatch in the contract addresses!");
  }

  console.log('Deployment, verification, and initialization complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
