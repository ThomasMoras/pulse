import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Pulse } from '../../typechain-types';
import { beforeEach } from 'mocha';
import { assert } from 'console';
import { user1Data, user2Data, user3Data } from './CommonData';
import { Interaction, SBTMetaData } from './Type';

describe('Pulse', function () {
  let pulseContract: Pulse;
  let pulseAddress: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;
  let user4: any;
  let user5: any;
  let user6: any;

  async function fixture() {
    const [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

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

    const pulseAddress = await ethers.getSigner(pulseContractAddress);

    return {
      pulseContract,
      pulseAddress,
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
    };
  }

  async function fixtureWithMints() {
    ({ pulseContract, pulseAddress, owner, user1, user2, user3, user4, user5, user6 } =
      await loadFixture(fixture));

    const metadata1 = {
      ...user1Data,
      issuer: pulseAddress,
    };

    const metadata2 = {
      ...user2Data,
      issuer: pulseAddress,
    };

    const metadata3 = {
      ...user3Data,
      issuer: pulseAddress,
    };

    const tx1 = await pulseContract.createAccount(user1.address, metadata1);
    await tx1.wait();

    const tx2 = await pulseContract.createAccount(user2.address, metadata2);
    await tx2.wait();

    const tx3 = await pulseContract.createAccount(user3.address, metadata3);
    await tx3.wait();

    return {
      pulseContract,
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
    };
  }

  describe('Deployment', function () {
    it('Should deploy pulse contract and check if owner is correct', async () => {
      ({ pulseContract, pulseAddress, owner, user1, user2, user3 } = await loadFixture(fixture));
      const contractOwner = await pulseContract.owner(); // Supposant que vous avez une fonction owner() dans votre contrat
      expect(contractOwner).to.equal(owner.address);
    });

    it('Verify that PulseSBT is correctly define and set to Pulse Contract', async () => {});
  });

  describe('Consumption of PulseSBT functions', function () {
    beforeEach(async () => {
      ({ pulseContract, pulseAddress, owner, user1, user2, user3 } = await loadFixture(fixture));
    });

    it('Should verify that users doest have sbt', async () => {
      assert((await pulseContract.hasSoulBoundToken(user1)) === false);
      assert((await pulseContract.hasSoulBoundToken(user2)) === false);
      assert((await pulseContract.hasSoulBoundToken(user3)) === false);
    });
    it('Should mint for three users and check data', async () => {
      let metadata: SBTMetaData = {
        ...user1Data,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user1)) === true);

      metadata = {
        ...user2Data,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user2.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user2)) === true);

      metadata = {
        ...user3Data,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user3.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user3)) === true);
    });

    it('Should revert, only one sbt by user', async () => {
      const metadata: SBTMetaData = {
        ...user1Data,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1, metadata);
      await expect(pulseContract.createAccount(user1, metadata)).to.be.revertedWith(
        'Address has already received a SoulBound Token'
      );
    });

    it('Should retrieve token metadata for user1', async () => {
      const metadataToCreateProfil: SBTMetaData = {
        ...user1Data,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1, metadataToCreateProfil);

      const metadataGetByAccount = await pulseContract.getAccount(user1.address);
      expect(metadataGetByAccount.firstName).to.equal(user1Data.firstName);
      expect(metadataGetByAccount.birthday).to.equal(user1Data.birthday);
      expect(metadataGetByAccount.gender).to.equal(user1Data.gender);
      expect(metadataGetByAccount.localisation).to.equal(user1Data.localisation);
      expect(metadataGetByAccount.hobbies).to.deep.equal(user1Data.hobbies);
      expect(metadataGetByAccount.interestedBy).to.deep.equal(user1Data.interestedBy);
      expect(metadataGetByAccount.ipfsHashs).to.deep.equal([]);
    });
  });

  describe('Features design for Pulse standard user', function () {
    beforeEach('', async () => {
      ({ pulseContract, owner, user1, user2, user3, user4, user5, user6 } =
        await fixtureWithMints());
    });

    it('Should check if the default interaction is NONE', async () => {
      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        Interaction.NONE.toString()
      );
    });

    it('Should be like and emit event', async () => {
      await expect(pulseContract.connect(user1).like(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, Interaction.LIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        Interaction.LIKED.toString()
      );

      expect(await pulseContract.connect(user1).getReminderLike(user1.address)).to.equal(
        BigInt(19)
      );
    });

    it('Should revert, self interaction', async () => {
      await expect(pulseContract.connect(user1).like(user1.address))
        .revertedWithCustomError(pulseContract, 'SelfInteractionCheck')
        .withArgs(user1.address);
    });

    it('Should revert, already interracted', async () => {
      await pulseContract.connect(user1).like(user2.address);
      await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        Interaction.LIKED.toString();
      await expect(pulseContract.connect(user1).like(user2.address))
        .revertedWithCustomError(pulseContract, 'AlreadyInteracted')
        .withArgs(user1.address, user2.address);
    });

    it('Should be dislike other user and emit event', async () => {
      await expect(pulseContract.connect(user1).dislike(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, Interaction.DISLIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        Interaction.DISLIKED.toString()
      );
    });

    it('Should be use super like on other user and emit event', async () => {
      await expect(pulseContract.connect(user1).superLike(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, Interaction.SUPER_LIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        Interaction.SUPER_LIKED.toString()
      );
    });

    it('Should allow 5 super like by user and revert if exceed this number', async () => {
      const max = 5;
      for (let i = 1; i <= max; i++) {
        const targetUser = (await ethers.getSigners())[i + 5];

        await expect(pulseContract.connect(user1).superLike(targetUser.address))
          .emit(pulseContract, 'Interacted')
          .withArgs(user1.address, targetUser.address, Interaction.SUPER_LIKED);

        expect(await pulseContract.connect(user1).getReminderSuperLike(user1.address)).to.equal(
          BigInt(max - i)
        );
      }
      const targetUser = (await ethers.getSigners())[12];
      await expect(pulseContract.connect(user1).superLike(targetUser.address)).revertedWith(
        "You don't have enought super like"
      );
    });

    it('Should be match when two user like each other', async () => {
      await pulseContract.connect(user1).like(user2.address);

      await expect(pulseContract.connect(user2).like(user1.address))
        .emit(pulseContract, 'Match')
        .withArgs(user2.address, user1.address);
    });

    it('Should be start a conversation when two user match', async () => {});

    it('Participant n°1 should be able to send and receive message', async () => {});

    it('Participant n°2 should be able to send and receive message', async () => {});

    it('Should revert, only the two participants can send message inside their conversation', async () => {});
  });

  describe('Features design for Admin user', function () {});

  describe('Features design for Pulse partner', function () {});
});
