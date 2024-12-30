import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { ethers, network } from 'hardhat';
import { expect, assert } from 'chai';
import { PulseSBT } from '../../typechain-types';
import { beforeEach } from 'mocha';
import { user1Data, user2Data, user3Data } from './CommonData';
import { Gender, SBTMetaData } from './utils/Type';

describe('PulseSBT', function () {
  let sbtContract: PulseSBT;
  let pulseSignerImpersonated: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;

  async function fixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploiement du contrat SBT
    const sbtContract = await ethers.deployContract('PulseSBT', [], {});
    await sbtContract.waitForDeployment();
    const pulseSBTAddress = await sbtContract.getAddress();
    console.log('SBT Contract deployed at:', pulseSBTAddress);

    // Déploiement du contrat Pulse
    const pulseContract = await ethers.deployContract('Pulse', [pulseSBTAddress], {
      value: ethers.parseEther('10'),
    });
    await pulseContract.waitForDeployment();
    const pulseContractAddress = await pulseContract.getAddress();
    await sbtContract.setPulseAddress(pulseContractAddress);

    const pulseContractAddressInsideSBT = await sbtContract.getPulseContractAddress();

    console.log('Pulse Contract address inside SBT Contract : ', pulseContractAddressInsideSBT);
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [pulseContractAddress],
    });

    const pulseSignerImpersonated = await ethers.getSigner(pulseContractAddress);

    return {
      sbtContract,
      pulseSignerImpersonated,
      owner,
      user1,
      user2,
      user3,
    };
  }

  async function fixtureWithMints() {
    const { sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
      await loadFixture(fixture);

    // Création des métadonnées une fois pour chaque utilisateur
    const metadata1 = {
      ...user1Data,
      issuer: pulseSignerImpersonated.address,
    };

    const metadata2 = {
      ...user2Data,
      issuer: pulseSignerImpersonated.address,
    };

    const metadata3 = {
      ...user3Data,
      issuer: pulseSignerImpersonated.address,
    };

    // Mint pour les trois utilisateurs
    const tx1 = await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(user1.address, metadata1);
    await tx1.wait();

    const tx2 = await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(user2.address, metadata2);
    await tx2.wait();

    const tx3 = await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(user3.address, metadata3);
    await tx3.wait();

    return {
      sbtContract,
      pulseSignerImpersonated,
      owner,
      user1,
      user2,
      user3,
    };
  }

  describe('Deployment', function () {
    it('Should deploy sbt contract and check if owner is correct', async () => {
      const { sbtContract, owner } = await loadFixture(fixture);
      const contractOwner = await sbtContract.owner();
      expect(contractOwner).to.equal(owner.address);
    });
  });

  describe('Mint SBT', function () {
    beforeEach(async () => {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixture));
    });

    it('Should revert, only Pulse contract can mint SBT', async () => {
      const metadata = {
        ...user1Data,
        issuer: pulseSignerImpersonated.address,
      };
      await expect(sbtContract.mintSoulBoundToken(user1.address, metadata)).to.be.revertedWith(
        'Only the Pulse contract can call this function'
      );
    });

    it('Should mint and emit event for user 1', async () => {
      const metadata: SBTMetaData = {
        ...user1Data,
        issuer: pulseSignerImpersonated.address,
      };
      const mintTx = await sbtContract
        .connect(pulseSignerImpersonated)
        .mintSoulBoundToken(user1.address, metadata);

      await expect(mintTx).to.emit(sbtContract, 'TokenMinted').withArgs(user1.address, 1); // Le premier token aura l'ID 1
    });

    it('Should revert, a user can only mint one SBT', async () => {
      const metadata: SBTMetaData = {
        ...user2Data,
        issuer: pulseSignerImpersonated.address,
      };
      await sbtContract
        .connect(pulseSignerImpersonated)
        .mintSoulBoundToken(user1.address, metadata);

      await expect(
        sbtContract.connect(pulseSignerImpersonated).mintSoulBoundToken(user1.address, metadata)
      ).to.be.revertedWith('Address has already received a SoulBound Token');
    });
  });

  describe('Mint SBTs and check SBT Data', function () {
    beforeEach(async function () {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });

    it('Should verify SBT ownership', async () => {
      assert((await sbtContract.hasSoulBoundToken(user1.address)) === true);
      assert((await sbtContract.hasSoulBoundToken(user2.address)) === true);
      assert((await sbtContract.hasSoulBoundToken(user3.address)) === true);
    });

    it('Should verify SBT meta data', async () => {
      let metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getSBTMetaDataByUser(user1.address);
      expect(metadata.firstName).to.equal(user1Data.firstName);
      expect(metadata.email).to.equal(user1Data.email);
      expect(metadata.birthday).to.equal(user1Data.birthday);
      expect(metadata.gender).to.equal(user1Data.gender);
      expect(metadata.interestedBy).to.deep.equal(user1Data.interestedBy);
      expect(metadata.localisation).to.equal(user1Data.localisation);
      expect(metadata.hobbies).to.deep.equal(user1Data.hobbies);
      expect(metadata.note).to.equal(0);
      expect(metadata.ipfsHashs).to.deep.equal([]);

      metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getSBTMetaDataByUser(user2.address);
      expect(metadata.firstName).to.equal(user2Data.firstName);
      expect(metadata.email).to.equal(user2Data.email);
      expect(metadata.birthday).to.equal(user2Data.birthday);
      expect(metadata.gender).to.equal(user2Data.gender);
      expect(metadata.interestedBy).to.deep.equal(user2Data.interestedBy);
      expect(metadata.localisation).to.equal(user2Data.localisation);
      expect(metadata.hobbies).to.deep.equal(user2Data.hobbies);
      expect(metadata.note).to.equal(0);
      expect(metadata.ipfsHashs).to.deep.equal([]);
    });

    it('Should update SBT meta data according to user and emit event', async () => {
      const metadataModified1: SBTMetaData = {
        ...user1Data,
        firstName: 'FirstNameChanged1',
        email: 'newfirstname1@gmail.com',
        birthday: 799315200, // 1995-07-01
        gender: Gender.Female,
        interestedBy: [Gender.Male, Gender.NonBinary],
        localisation: 'Marseille',
        hobbies: ['Swimming', 'Photography'],
        note: 3,
        ipfsHashs: ['QmHash1'],
        issuer: pulseSignerImpersonated.address,
      };

      const tokenId = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenIdByUser(user1.address);
      await expect(
        sbtContract
          .connect(pulseSignerImpersonated)
          .updateTokenMetadata(user1.address, metadataModified1)
      )
        .to.emit(sbtContract, 'SBTMetaDataUpdated')
        .withArgs(tokenId);

      const metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getSBTMetaDataByUser(user1.address);

      expect(metadata.firstName).to.equal(metadataModified1.firstName);
      expect(metadata.email).to.equal(metadataModified1.email);
      expect(metadata.birthday).to.equal(metadataModified1.birthday);
      expect(metadata.gender).to.equal(metadataModified1.gender);
      expect(metadata.interestedBy).to.deep.equal(metadataModified1.interestedBy);
      expect(metadata.localisation).to.equal(metadataModified1.localisation);
      expect(metadata.hobbies).to.deep.equal(metadataModified1.hobbies);
      expect(metadata.note).to.equal(metadataModified1.note);
      expect(metadata.ipfsHashs).to.deep.equal(metadataModified1.ipfsHashs);
    });
  });

  describe('SBT Overrides features', function () {
    beforeEach(async function () {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });

    it('Should revert transfer, SBT can not be transfered', async () => {
      await expect(sbtContract.connect(user1).transferFrom(user1, user2, 1)).to.be.revertedWith(
        'SoulBound Tokens are non-transferable'
      );
    });

    it('Should revert approval, SBT can not be approved', async () => {
      await expect(sbtContract.connect(user1).approve(user1, 1)).to.be.revertedWith(
        'SoulBound Tokens can not be approved'
      );
    });

    it('Should burn the SBT and emit an event', async () => {
      assert((await sbtContract.hasSoulBoundToken(user1)) === true);
      const tokenId = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenIdByUser(user1.address);

      await expect(sbtContract.connect(user1).burn(Number(tokenId)))
        .to.emit(sbtContract, 'TokenBurnt')
        .withArgs(tokenId);

      assert((await sbtContract.hasSoulBoundToken(user1)) === false);
    });
  });
});
