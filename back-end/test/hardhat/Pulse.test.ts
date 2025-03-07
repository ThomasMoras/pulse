import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { assert, expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Pulse } from '../../typechain-types';
import { beforeEach } from 'mocha';
import { user1Data, user2Data, user3Data, user4Data } from './utils/CommonData';
import { InteractionStatus, SBTMetaData } from './utils/Type';
import { LitEncryption } from './utils/lit-encryption';

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
  let litEncryption: LitEncryption;

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
      userAddress: user1.address,
      issuer: pulseAddress,
    };

    const metadata2 = {
      ...user2Data,
      userAddress: user2.address,
      issuer: pulseAddress,
    };

    const metadata3 = {
      ...user3Data,
      userAddress: user3.address,
      issuer: pulseAddress,
    };

    const metadata4 = {
      ...user4Data,
      userAddress: user4.address,
      issuer: pulseAddress,
    };

    const tx1 = await pulseContract.createAccount(user1.address, metadata1);
    await tx1.wait();

    const tx2 = await pulseContract.createAccount(user2.address, metadata2);
    await tx2.wait();

    const tx3 = await pulseContract.createAccount(user3.address, metadata3);
    await tx3.wait();

    const tx4 = await pulseContract.createAccount(user4.address, metadata4);
    await tx4.wait();

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

  describe('Accounts features using SBT', function () {
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
        userAddress: user1.address,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user1)) === true);

      metadata = {
        ...user2Data,
        userAddress: user2.address,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user2.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user2)) === true);

      metadata = {
        ...user3Data,
        userAddress: user3.address,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user3.address, metadata);
      assert((await pulseContract.hasSoulBoundToken(user3)) === true);
    });

    it('Should revert, only one sbt by user', async () => {
      const metadata: SBTMetaData = {
        ...user1Data,
        userAddress: user1.address,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1, metadata);
      await expect(pulseContract.createAccount(user1, metadata)).to.be.revertedWith(
        'User already registered'
      );
    });

    it('Should retrieve token metadata for user1', async () => {
      const metadataToCreateProfil: SBTMetaData = {
        ...user1Data,
        userAddress: user1.address,
        issuer: pulseAddress,
      };
      await pulseContract.createAccount(user1, metadataToCreateProfil);

      const metadataGetByAccount = await pulseContract.getAccount(user1.address);
      expect(metadataGetByAccount.firstName).to.equal(user1Data.firstName);
      expect(metadataGetByAccount.description).to.equal(user1Data.description);
      expect(metadataGetByAccount.birthday).to.equal(user1Data.birthday);
      expect(metadataGetByAccount.gender).to.equal(user1Data.gender);
      expect(metadataGetByAccount.localisation).to.equal(user1Data.localisation);
      expect(metadataGetByAccount.hobbies).to.deep.equal(user1Data.hobbies);
      expect(metadataGetByAccount.interestedBy).to.deep.equal(user1Data.interestedBy);
      expect(metadataGetByAccount.ipfsHashs).to.deep.equal([
        'bafkreiawpxy2ai6m26v5prk5jdbf3acfhsxrmrutvmv6ku4hpmbuhp6hbq',
      ]);
    });
  });

  describe('Interactions features', function () {
    beforeEach(async () => {
      ({ pulseContract, owner, user1, user2, user3, user4, user5, user6 } =
        await fixtureWithMints());
    });

    it('Should check if the default interaction is NONE', async () => {
      expect(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address)
      ).to.equal(InteractionStatus.NONE);
    });

    it('Should be like and emit event', async () => {
      await expect(pulseContract.connect(user1).like(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, InteractionStatus.LIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        InteractionStatus.LIKED.toString()
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
        InteractionStatus.LIKED.toString();
      await expect(pulseContract.connect(user1).like(user2.address))
        .revertedWithCustomError(pulseContract, 'AlreadyInteracted')
        .withArgs(user1.address, user2.address);
    });

    it('Should be dislike other user and emit event', async () => {
      await expect(pulseContract.connect(user1).dislike(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, InteractionStatus.DISLIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        InteractionStatus.DISLIKED.toString()
      );
    });

    it('Should be use super like on other user and emit event', async () => {
      await expect(pulseContract.connect(user1).superLike(user2.address))
        .emit(pulseContract, 'Interacted')
        .withArgs(user1.address, user2.address, InteractionStatus.SUPER_LIKED);

      assert(
        await pulseContract.connect(user1).getInteractionStatus(user1.address, user2.address),
        InteractionStatus.SUPER_LIKED.toString()
      );
    });

    it('Should allow 5 super like by user and revert if exceed this number', async () => {
      const max = 5;
      for (let i = 1; i <= max; i++) {
        const targetUser = (await ethers.getSigners())[i + 5];

        await expect(pulseContract.connect(user1).superLike(targetUser.address))
          .emit(pulseContract, 'Interacted')
          .withArgs(user1.address, targetUser.address, InteractionStatus.SUPER_LIKED);

        expect(await pulseContract.connect(user1).getReminderSuperLike(user1.address)).to.equal(
          BigInt(max - i)
        );
      }
      const targetUser = (await ethers.getSigners())[12];
      await expect(pulseContract.connect(user1).superLike(targetUser.address)).revertedWith(
        "You don't have enough super likes"
      );
    });

    it('Should be match when two user like each other', async () => {
      await pulseContract.connect(user1).like(user2.address);
      const tx = await pulseContract.connect(user2).like(user1.address);
      const conversationId = await pulseContract.getConversationBetween(
        user1.address,
        user2.address
      );
      await expect(tx)
        .to.emit(pulseContract, 'Match')
        .withArgs(user2.address, user1.address, conversationId);
    });
  });

  describe('Conversations features', function () {
    beforeEach(async () => {
      ({ pulseContract, owner, user1, user2, user3, user4, user5, user6 } =
        await fixtureWithMints());
    });

    it('Should revert, no existing conversation', async () => {
      await expect(
        pulseContract.getConversationBetween(user1.address, user2.address)
      ).revertedWithCustomError(pulseContract, 'ConversationNotFound');
    });

    it('Should be start a conversation when two user match and check participants', async () => {
      await pulseContract.connect(user1).like(user2.address);
      await pulseContract.connect(user2).like(user1.address);
      const conversationId = await pulseContract.getConversationBetween(
        user1.address,
        user2.address
      );
      assert((await pulseContract.isParticipant(user1.address, conversationId)) == true);
      assert((await pulseContract.isParticipant(user2.address, conversationId)) == true);
      assert((await pulseContract.isParticipant(user3.address, conversationId)) == false);
    });

    it('Participants should be able to send and receive message', async () => {
      const ethereumSepoliaEncryption = new LitEncryption('ethereum', true);
      await ethereumSepoliaEncryption.connect();

      await pulseContract.connect(user1).like(user2.address);
      await pulseContract.connect(user2).like(user1.address);

      const conversationId = await pulseContract.getConversationBetween(
        user1.address,
        user2.address
      );
      // commentaire pour expliciter le processus d'encryptage et decryptage

      // Premier message : user1 -> user2
      const message1 = 'Hello! How are you?';
      // user1 chiffre pour user2
      const encryptedMessage1 = await ethereumSepoliaEncryption.encryptMessage(
        message1,
        user2.address, // destinataire
        user1 // expéditeur qui chiffre
      );
      await pulseContract.connect(user1).sendMessage(conversationId, encryptedMessage1);

      // Deuxième message : user2 -> user1
      const message2 = 'I am fine, thank you!';
      // user2 chiffre pour user1
      const encryptedMessage2 = await ethereumSepoliaEncryption.encryptMessage(
        message2,
        user1.address, // destinataire
        user2 // expéditeur qui chiffre
      );
      await pulseContract.connect(user2).sendMessage(conversationId, encryptedMessage2);

      // Récupération des messages
      const messages = await pulseContract
        .connect(user1)
        .getConversationMessages(conversationId, user1.address);
      expect(messages).to.be.an('array');
      expect(messages.length).to.equal(2);

      // user2 déchiffre le message de user1
      const decryptedMessage1 = await ethereumSepoliaEncryption.decryptMessage(
        messages[0].encryptedContent,
        user2.address, // destinataire qui déchiffre
        user2 // signer du destinataire
      );
      expect(decryptedMessage1).to.equal(message1);
      // user1 déchiffre le message de user2
      const decryptedMessage2 = await ethereumSepoliaEncryption.decryptMessage(
        messages[1].encryptedContent,
        user1.address, // destinataire qui déchiffre
        user1 // signer du destinataire
      );

      expect(decryptedMessage2).to.equal(message2);
    });

    // Tests pour différentes chaînes
    describe('Multi-chain encryption', () => {
      before(async () => {
        let baseEncryption: LitEncryption = new LitEncryption('base', true);
        let arbitrumEncryption: LitEncryption = new LitEncryption('arbitrum', true);
        await baseEncryption.connect();
        await arbitrumEncryption.connect();
      });

      it('should encrypt/decrypt on Base', async () => {
        // Tests spécifiques à Base
      });

      it('should encrypt/decrypt on Arbitrum', async () => {
        // Tests spécifiques à Arbitrum
      });
    });

    it('Should revert, only the two participants can send message inside their conversation', async () => {});
  });

  describe('Get users by filters features', function () {
    beforeEach(async () => {
      ({ pulseContract, owner, user1, user2, user3, user4, user5, user6 } =
        await fixtureWithMints());
    });

    it('Should get batch of users with age filter', async () => {
      const criteria = {
        minAge: 20,
        maxAge: 30,
        gender: 4, // Undisclosed
      };

      const [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      const validUsers = users.slice(0, Number(count));
      expect(validUsers.length).to.be.greaterThan(0);

      for (const user of validUsers) {
        const age = Math.floor((Date.now() / 1000 - Number(user.birthday)) / (365 * 24 * 60 * 60));
        expect(age).to.be.greaterThanOrEqual(criteria.minAge);
        expect(age).to.be.lessThanOrEqual(criteria.maxAge);
      }
    });

    it('Should get batch of users with gender filter', async () => {
      const criteria = {
        minAge: 18,
        maxAge: 99,
        gender: 1, // Female
      };

      const [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      const validUsers = users.slice(0, Number(count));
      expect(count).to.be.equal(2);

      for (const user of validUsers) {
        expect(user.gender).to.equal(criteria.gender);
      }
    });

    it('Should get batch of users with gender and age filter', async () => {
      const criteria = {
        minAge: 30,
        maxAge: 40,
        gender: 1, // Female
      };

      const [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      const validUsers = users.slice(0, Number(count));

      for (const user of validUsers) {
        expect(user.gender).to.equal(criteria.gender);
      }
    });

    it('Should return empty array when no users match criteria', async () => {
      const criteria = {
        minAge: 99,
        maxAge: 100,
        gender: 0,
      };

      const [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      expect(count).to.equal(0);
    });

    it('Should handle pagination correctly', async () => {
      const criteria = {
        minAge: 18,
        maxAge: 99,
        gender: 4, // Undisclosed
      };

      const [batch1, count1] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(2, 0, criteria, user1.address);
      const [batch2, count2] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(2, 2, criteria, user1.address);

      const validBatch1 = batch1.slice(0, Number(count1));
      const validBatch2 = batch2.slice(0, Number(count2));

      expect(validBatch1).to.not.deep.equal(validBatch2);
    });

    it('Should revert with invalid start index', async () => {
      const criteria = {
        minAge: 18,
        maxAge: 30,
        gender: 4,
      };

      await expect(
        pulseContract.connect(user1).getBatchOfUsers(10, 999999, criteria, user1.address)
      ).to.be.revertedWith('Invalid start index');
    });

    it('Should batch of user without interacted users', async () => {
      const criteria = {
        minAge: 18,
        maxAge: 99,
        gender: 4,
      };

      let [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      let validUsers = users.slice(0, Number(count));
      expect(validUsers.length).to.equal(3);

      await pulseContract.connect(user1).like(user2.address);
      [users, count] = await pulseContract
        .connect(user1)
        .getBatchOfUsers(10, 0, criteria, user1.address);
      validUsers = users.slice(0, Number(count));
      expect(validUsers.length).to.equal(2);
    });
  });

  describe('Features design for Admin user', function () {});

  describe('Features design for Pulse partner', function () {});
});
