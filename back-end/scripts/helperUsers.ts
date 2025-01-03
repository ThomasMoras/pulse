import { ethers } from 'hardhat';
import { Gender } from '../test/hardhat/utils/Type';
import { usersList } from '../test/hardhat/utils/CommonData';

export async function createAccounts(pulse: any) {
  let signers = await ethers.getSigners();
  signers = signers.slice(16, signers.length);
  console.log(`Nombre de signers: ${signers.length}`);

  await Promise.all(
    signers.map(async (signer, index) => {
      const userData = usersList[index];
      userData.userAddress = signer.address;
      console.log(`Création du compte pour ${userData.firstName}`);

      try {
        let tx = await pulse.createAccount(signer.address, userData);
        await tx.wait();
        console.log(`Compte créé avec succès pour ${userData.firstName}`);
      } catch (error) {
        console.error(`Erreur lors de la création du compte pour ${userData.firstName}:`, error);
      }
    })
  );
}
