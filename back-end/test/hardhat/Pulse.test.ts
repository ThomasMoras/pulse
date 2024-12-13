import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { getAddress, parseGwei } from "viem";
import { Pulse, PulseSBT } from "../../typechain-types";
import { beforeEach } from "mocha";
import { assert } from "console";
import { user1Data, user2Data, user3Data } from "./CommonData";

describe("Pulse", function () {
    let pulseContract: Pulse;
    let sbtContract: PulseSBT;
    let pulseSignerImpersonated: any;
    let owner: any;
    let user1: any;
    let user2: any;
    let user3: any;

    async function fixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploy SBT contract
        const SBTFactory = await ethers.getContractFactory("PulseSBT");
        const sbt = await SBTFactory.deploy();
        await sbt.waitForDeployment();

        const sbtAddress = await sbt.getAddress();
        const sbtContract = SBTFactory.attach(sbtAddress) as PulseSBT;

        // Deploy Pulse contract
        const pulseContract = await ethers.deployContract(
            "Pulse",
            [sbtAddress],
            {
                value: ethers.parseEther("10"),
            },
        );
        await pulseContract.waitForDeployment();

        sbtContract.setPulseAddress(pulseContract.getAddress());
        return { pulseContract, sbtContract, owner, user1, user2, user3 };
    }

    describe("Deployment", function () {
        it("Should deploy pulse contract and check if owner is correct", async () => {
            const { pulseContract, sbtContract, owner, user1, user2, user3 } =
                await loadFixture(fixture);
            const contractOwner = await pulseContract.owner(); // Supposant que vous avez une fonction owner() dans votre contrat
            expect(contractOwner).to.equal(owner.address);
        });
    });

    describe("Verify that PulseSBT is correctly define and set to Pulse Contract", function () {
        beforeEach(async () => {
            ({ pulseContract, owner, user1, user2, user3 } =
                await loadFixture(fixture));
        });
    });

    describe("Consumption of PulseSBT functions", function () {
        beforeEach(async () => {
            ({ pulseContract, sbtContract, owner, user1, user2, user3 } =
                await loadFixture(fixture));
            await pulseContract.mintSoulBoundToken(
                user1.address,
                user1Data.firstName,
                user1Data.lastName,
                user1Data.age,
                user1Data.gender,
                user1Data.localisation,
                user1Data.hobbies,
                "",
            );
        });

        it("Should verify that users doest have sbt", async () => {
            assert((await pulseContract.hasSoulBoundToken(user1)) === false);
            assert((await pulseContract.hasSoulBoundToken(user2)) === false);
            assert((await pulseContract.hasSoulBoundToken(user3)) === false);
        });
        it("Should mint for three users and check data", async () => {
            assert(
                (await pulseContract.hasSoulBoundToken(user1.address)) === true,
            );

            await pulseContract.mintSoulBoundToken(
                user2.address,
                user2Data.firstName,
                user2Data.lastName,
                user2Data.age,
                user2Data.gender,
                user2Data.localisation,
                user2Data.hobbies,
                "",
            );
            assert(
                (await pulseContract.hasSoulBoundToken(user2.address)) === true,
            );

            await pulseContract.mintSoulBoundToken(
                user3.address,
                user3Data.firstName,
                user3Data.lastName,
                user3Data.age,
                user3Data.gender,
                user3Data.localisation,
                user3Data.hobbies,
                "",
            );
            assert(
                (await pulseContract.hasSoulBoundToken(user3.address)) === true,
            );
        });

        it("Should revert, only one sbt by user", async () => {
            await expect(
                pulseContract.mintSoulBoundToken(
                    user1.address,
                    user1Data.firstName,
                    user1Data.lastName,
                    user1Data.age,
                    user1Data.gender,
                    user1Data.localisation,
                    user1Data.hobbies,
                    "",
                ),
            ).to.be.revertedWith(
                "Address has already received a SoulBound Token",
            );
        });

        it("Should retrieve token metadata for user1", async () => {
            let metadata = await pulseContract.getTokenMetadataByUser(
                user1.address,
            );
            expect(metadata.firstName).to.equal(user1Data.firstName);
            expect(metadata.lastName).to.equal(user1Data.lastName);
            expect(metadata.age).to.equal(user1Data.age);
            expect(metadata.gender).to.equal(user1Data.gender);
            expect(metadata.localisation).to.equal(user1Data.localisation);
            expect(metadata.hobbies).to.equal(user1Data.hobbies);
        });
    });

    describe("Features design for Pulse standard user", function () {
        it("Should be like an other user", async () => {});

        it("Should be no like an other user", async () => {});

        it("Should be use super like an other user", async () => {});

        it("Should be match when two user like them", async () => {});

        it("Should be start a conversation when two user match", async () => {});

        it("User1 member of the discusion should be able to send and receive message", async () => {});

        it("User2 member of the discusion should be able to send and receive message", async () => {});
    });

    describe("Features design for Admin user", function () {});

    describe("Features design for Pulse partner", function () {});
});
