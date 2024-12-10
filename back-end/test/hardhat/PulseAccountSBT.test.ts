import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { ethers } from "hardhat";
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

  let contract: PulseAccountSBT;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;

  async function fixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const PulseSBT = await ethers.getContractFactory("PulseAccountSBT");
    const contract = await PulseSBT.deploy();
    return { contract, owner, user1, user2, user3 };
  }

  async function fixtureWithMints() {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const PulseSBT = await ethers.getContractFactory("PulseAccountSBT");
    const contract = await PulseSBT.deploy();

    await contract.mintSoulBoundToken(
      user1.address,
      user1Data.firstName,
      user1Data.lastName,
      user1Data.age,
      user1Data.gender,
      user1Data.localisation,
      user1Data.hobbies,
    );

    await contract.mintSoulBoundToken(
      user2.address,
      user2Data.firstName,
      user2Data.lastName,
      user2Data.age,
      user2Data.gender,
      user2Data.localisation,
      user2Data.hobbies,
    );

    await contract.mintSoulBoundToken(
      user3.address,
      user3Data.firstName,
      user3Data.lastName,
      user3Data.age,
      user3Data.gender,
      user3Data.localisation,
      user3Data.hobbies,
    );

    return { contract, owner, user1, user2, user3 };
  }

  before(async () => {
    const [owner, user1, user2, user3] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should deploy the smart contract and the owner is correct", async () => {
      const { contract, owner, user1, user2, user3 } =
        await loadFixture(fixture);
      const contractOwner = await contract.owner(); // Supposant que vous avez une fonction owner() dans votre contrat
      expect(contractOwner).to.equal(owner.address);
    });
  });

  describe("Mint SBT", function () {
    beforeEach(async () => {
      console.log("toto");
      ({ contract, owner, user1, user2, user3 } = await loadFixture(fixture));
    });

    it("Should mint and emit event for user 1", async () => {
      const mintTx = await contract.mintSoulBoundToken(
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
        .to.emit(contract, "TokenMinted")
        .withArgs(user1.address, value);
    });

    it("Should revert, a user can only mint one SBT", async () => {
      console.log(contract);
      await contract.mintSoulBoundToken(
        user1.address,
        user1Data.firstName,
        user1Data.lastName,
        user1Data.age,
        user1Data.gender,
        user1Data.localisation,
        user1Data.hobbies,
      );

      await expect(
        contract.mintSoulBoundToken(
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
      ({ contract, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });

    it("Should verify SBT ownership", async () => {});

    it("Should verify SBT meta data", async () => {
      let metadata = await contract.getTokenMetadataByUser(user1.address);
      expect(metadata.firstName).to.equal(user1Data.firstName);
      expect(metadata.lastName).to.equal(user1Data.lastName);
      expect(metadata.age).to.equal(user1Data.age);
      expect(metadata.gender).to.equal(user1Data.gender);
      expect(metadata.localisation).to.equal(user1Data.localisation);
      expect(metadata.hobbies).to.equal(user1Data.hobbies);

      metadata = await contract.getTokenMetadataByUser(user2.address);
      expect(metadata.firstName).to.equal(user2Data.firstName);
      expect(metadata.lastName).to.equal(user2Data.lastName);
      expect(metadata.age).to.equal(user2Data.age);
      expect(metadata.gender).to.equal(user2Data.gender);
      expect(metadata.localisation).to.equal(user2Data.localisation);
      expect(metadata.hobbies).to.equal(user2Data.hobbies);

      metadata = await contract.getTokenMetadataByUser(user3.address);
      expect(metadata.firstName).to.equal(user3Data.firstName);
      expect(metadata.lastName).to.equal(user3Data.lastName);
      expect(metadata.age).to.equal(user3Data.age);
      expect(metadata.gender).to.equal(user3Data.gender);
      expect(metadata.localisation).to.equal(user3Data.localisation);
      expect(metadata.hobbies).to.equal(user3Data.hobbies);
    });
  });

  describe("SBT Overrides features", function () {
    beforeEach(async function () {
      ({ contract, owner, user1, user2, user3 } =
        await loadFixture(fixtureWithMints));
    });

    it("Should revert transfer, SBT can not be trasnfered", async () => {
      await expect(
        contract.connect(user1).transferFrom(user1, user2, 1),
      ).to.be.revertedWith("SoulBound Tokens are non-transferable");
    });

    it("Should revert transfer, SBT can not be trasnfered", async () => {
      await expect(
        contract.connect(user1).approve(user1, 1),
      ).to.be.revertedWith("SoulBound Tokens can not be approve");
    });
  });
});
