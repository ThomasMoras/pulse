import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { ethers, network } from "hardhat";
import { expect, assert } from "chai";
import { PulseAccountSBT } from "../../typechain-types";
import { before, beforeEach } from "mocha";

describe("PulseAccountSBT", function () {
  enum Gender {
    Male,
    Female,
    NonBinary,
    Other,
    Undisclosed,
  }

  const user1Data = {
    firstName: "FirstName1",
    lastName: "LastName1",
    age: 26,
    gender: Gender.Male,
    localisation: "Lyon",
    hobbies: "Tennis",
  };

  const user2Data = {
    firstName: "FirstName2",
    lastName: "LastName2",
    age: 32,
    gender: Gender.Female,
    localisation: "Paris",
    hobbies: "Running",
  };

  const user3Data = {
    firstName: "FirstName3",
    lastName: "LastName3",
    age: 19,
    gender: Gender.Undisclosed,
    localisation: "Toulouse",
    hobbies: "Drawing",
  };

  let sbtContract: PulseAccountSBT;
  let pulseSignerImpersonated: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;

  async function fixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    const pulseContract = await ethers.deployContract("Pulse", [], {
      value: ethers.parseEther("10"),
    });

    await pulseContract.waitForDeployment();
    const pulseContractAddress = await pulseContract.getAddress();

    const pulseSBTContract = await ethers.getContractFactory("PulseAccountSBT");
    const sbtContract = await pulseSBTContract.deploy(pulseContractAddress);
    await sbtContract.waitForDeployment();

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [pulseContractAddress],
    });

    const pulseSignerImpersonated =
      await ethers.getSigner(pulseContractAddress);

    return { sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 };
  }

  async function fixtureWithMints() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    const pulseContract = await ethers.deployContract("Pulse", [], {
      value: ethers.parseEther("10"),
    });

    await pulseContract.waitForDeployment();
    const pulseContractAddress = await pulseContract.getAddress();

    const PulseSBTContract = await ethers.getContractFactory("PulseAccountSBT");
    const sbtContract = await PulseSBTContract.deploy(pulseContractAddress);
    await sbtContract.waitForDeployment();

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [pulseContractAddress],
    });

    const pulseSignerImpersonated =
      await ethers.getSigner(pulseContractAddress);

    await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(
        user1.address,
        user1Data.firstName,
        user1Data.lastName,
        user1Data.age,
        user1Data.gender,
        user1Data.localisation,
        user1Data.hobbies,
      );

    await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(
        user2.address,
        user2Data.firstName,
        user2Data.lastName,
        user2Data.age,
        user2Data.gender,
        user2Data.localisation,
        user2Data.hobbies,
      );

    await sbtContract
      .connect(pulseSignerImpersonated)
      .mintSoulBoundToken(
        user3.address,
        user3Data.firstName,
        user3Data.lastName,
        user3Data.age,
        user3Data.gender,
        user3Data.localisation,
        user3Data.hobbies,
      );

    return { sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 };
  }

  describe("Deployment", function () {
    it("Should deploy the smart sbtContract and the owner is correct", async () => {
      const { sbtContract, owner, user1, user2, user3 } =
        await loadFixture(fixture);
      const contractOwner = await sbtContract.owner(); // Supposant que vous avez une fonction owner() dans votre contrat
      expect(contractOwner).to.equal(owner.address);
    });
  });

  describe("Mint SBT", function () {
    beforeEach(async () => {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixture));
    });

    it("Should revert, only Pulse contract can mint SBT", async () => {
      await expect(
        sbtContract.mintSoulBoundToken(
          user1.address,
          user1Data.firstName,
          user1Data.lastName,
          user1Data.age,
          user1Data.gender,
          user1Data.localisation,
          user1Data.hobbies,
        ),
      ).to.be.revertedWith("Only the Pulse contract can call this function");
    });

    it("Should mint and emit event for user 1", async () => {
      const mintTx = await sbtContract
        .connect(pulseSignerImpersonated)
        .mintSoulBoundToken(
          user1.address,
          user1Data.firstName,
          user1Data.lastName,
          user1Data.age,
          user1Data.gender,
          user1Data.localisation,
          user1Data.hobbies,
        );

      const receipt = await mintTx.wait();
      if (!receipt) throw new Error("Receipt is null");
      const eventLog = receipt.logs[0];
      if (!eventLog) throw new Error("Event log is null");
      const [addressEmitted, tokenId, value] = (eventLog as any).args;

      await expect(mintTx)
        .to.emit(sbtContract, "TokenMinted")
        .withArgs(user1.address, value);
    });

    it("Should revert, a user can only mint one SBT", async () => {
      await sbtContract
        .connect(pulseSignerImpersonated)
        .mintSoulBoundToken(
          user1.address,
          user1Data.firstName,
          user1Data.lastName,
          user1Data.age,
          user1Data.gender,
          user1Data.localisation,
          user1Data.hobbies,
        );

      await expect(
        sbtContract
          .connect(pulseSignerImpersonated)
          .mintSoulBoundToken(
            user1.address,
            user1Data.firstName,
            user1Data.lastName,
            user1Data.age,
            user1Data.gender,
            user1Data.localisation,
            user1Data.hobbies,
          ),
      ).to.be.revertedWith("Address has already received a SoulBound Token");
    });
  });

  describe("Mint SBTs and check SBT Data", function () {
    beforeEach(async function () {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });
    console.log(user1);
    it("Should verify SBT ownership", async () => {
      assert((await sbtContract.hasSoulBoundToken(user1)) === true);
      assert((await sbtContract.hasSoulBoundToken(user2)) === true);
      assert((await sbtContract.hasSoulBoundToken(user3)) === true);
    });

    it("Should verify SBT meta data", async () => {
      let metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user1.address);
      expect(metadata.firstName).to.equal(user1Data.firstName);
      expect(metadata.lastName).to.equal(user1Data.lastName);
      expect(metadata.age).to.equal(user1Data.age);
      expect(metadata.gender).to.equal(user1Data.gender);
      expect(metadata.localisation).to.equal(user1Data.localisation);
      expect(metadata.hobbies).to.equal(user1Data.hobbies);

      metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user2.address);
      expect(metadata.firstName).to.equal(user2Data.firstName);
      expect(metadata.lastName).to.equal(user2Data.lastName);
      expect(metadata.age).to.equal(user2Data.age);
      expect(metadata.gender).to.equal(user2Data.gender);
      expect(metadata.localisation).to.equal(user2Data.localisation);
      expect(metadata.hobbies).to.equal(user2Data.hobbies);

      metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user3.address);
      expect(metadata.firstName).to.equal(user3Data.firstName);
      expect(metadata.lastName).to.equal(user3Data.lastName);
      expect(metadata.age).to.equal(user3Data.age);
      expect(metadata.gender).to.equal(user3Data.gender);
      expect(metadata.localisation).to.equal(user3Data.localisation);
      expect(metadata.hobbies).to.equal(user3Data.hobbies);
    });

    it("Should update SBT meta data according to user and emit event", async () => {
      // **** First User Update *****
      let firstNameUpdated1 = "FirstNameChanged1";
      let lastNameUpdated1 = "LastNameChanged1";
      let ageUpdated1 = 27;
      let genderUpdated1 = Gender.Female;
      let localisationUpdated1 = "Marseille";
      let hobbiesUpdated1 = "Swimming";

      let tokenId = (
        await sbtContract
          .connect(pulseSignerImpersonated)
          .getTokenMetadataByUser(user1)
      ).id;
      await expect(
        sbtContract
          .connect(pulseSignerImpersonated)
          .updateTokenMetadata(
            user1.address,
            firstNameUpdated1,
            lastNameUpdated1,
            ageUpdated1,
            genderUpdated1,
            localisationUpdated1,
            hobbiesUpdated1,
          ),
      )
        .to.emit(sbtContract, "TokenDataUpdated")
        .withArgs(tokenId);

      let metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user1.address);
      expect(metadata.firstName).to.equal(firstNameUpdated1);
      expect(metadata.lastName).to.equal(lastNameUpdated1);
      expect(metadata.age).to.equal(ageUpdated1);
      expect(metadata.gender).to.equal(genderUpdated1);
      expect(metadata.localisation).to.equal(localisationUpdated1);
      expect(metadata.hobbies).to.equal(hobbiesUpdated1);

      // **** Second User Update *****
      let firstNameUpdated2 = "FirstNameChanged2";
      let lastNameUpdated2 = "LastNameChanged2";
      let ageUpdated2 = 33;
      let genderUpdated2 = Gender.Male;
      let localisationUpdated2 = "Nice";
      let hobbiesUpdated2 = "Cycling";
      tokenId = (
        await sbtContract
          .connect(pulseSignerImpersonated)
          .getTokenMetadataByUser(user2.address)
      ).id;

      await expect(
        sbtContract
          .connect(pulseSignerImpersonated)
          .updateTokenMetadata(
            user2.address,
            firstNameUpdated2,
            lastNameUpdated2,
            ageUpdated2,
            genderUpdated2,
            localisationUpdated2,
            hobbiesUpdated2,
          ),
      )
        .to.emit(sbtContract, "TokenDataUpdated")
        .withArgs(tokenId);

      metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user2.address);
      expect(metadata.firstName).to.equal(firstNameUpdated2);
      expect(metadata.lastName).to.equal(lastNameUpdated2);
      expect(metadata.age).to.equal(ageUpdated2);
      expect(metadata.gender).to.equal(genderUpdated2);
      expect(metadata.localisation).to.equal(localisationUpdated2);
      expect(metadata.hobbies).to.equal(hobbiesUpdated2);

      // **** Third User Update *****
      let firstNameUpdated3 = "FirstNameChanged3";
      let lastNameUpdated3 = "LastNameChanged3";
      let ageUpdated3 = 20;
      let genderUpdated3 = Gender.Undisclosed;
      let localisationUpdated3 = "Bordeaux";
      let hobbiesUpdated3 = "Reading";
      tokenId = (
        await sbtContract
          .connect(pulseSignerImpersonated)
          .getTokenMetadataByUser(user3.address)
      ).id;

      await expect(
        sbtContract
          .connect(pulseSignerImpersonated)
          .updateTokenMetadata(
            user3.address,
            firstNameUpdated3,
            lastNameUpdated3,
            ageUpdated3,
            genderUpdated3,
            localisationUpdated3,
            hobbiesUpdated3,
          ),
      )
        .to.emit(sbtContract, "TokenDataUpdated")
        .withArgs(tokenId);

      metadata = await sbtContract
        .connect(pulseSignerImpersonated)
        .getTokenMetadataByUser(user3.address);
      expect(metadata.firstName).to.equal(firstNameUpdated3);
      expect(metadata.lastName).to.equal(lastNameUpdated3);
      expect(metadata.age).to.equal(ageUpdated3);
      expect(metadata.gender).to.equal(genderUpdated3);
      expect(metadata.localisation).to.equal(localisationUpdated3);
      expect(metadata.hobbies).to.equal(hobbiesUpdated3);
    });
  });

  describe("SBT Overrides features", function () {
    beforeEach(async function () {
      ({ sbtContract, pulseSignerImpersonated, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });

    it("Should revert transfer, SBT can not be trasnfered", async () => {
      await expect(
        sbtContract.connect(user1).transferFrom(user1, user2, 1),
      ).to.be.revertedWith("SoulBound Tokens are non-transferable");
    });

    it("Should revert transfer, SBT can not be trasnfered", async () => {
      await expect(
        sbtContract.connect(user1).approve(user1, 1),
      ).to.be.revertedWith("SoulBound Tokens can not be approved");
    });

    it("Should burn the SBT and emit an event", async () => {
      assert((await sbtContract.hasSoulBoundToken(user1)) === true);
      const tokenId = (
        await sbtContract
          .connect(pulseSignerImpersonated)
          .getTokenMetadataByUser(user1)
      ).id;
      await expect(sbtContract.connect(user1).burn(tokenId))
        .to.emit(sbtContract, "TokenBurnt")
        .withArgs(tokenId);
      assert((await sbtContract.hasSoulBoundToken(user1)) === false);
    });
  });
});
