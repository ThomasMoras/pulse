import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { ethers, network } from "hardhat";
import { getAddress, parseGwei } from "viem";
import { Pulse, PulseSBT } from "../../typechain-types";
import { beforeEach } from "mocha";
import { assert } from "console";
import { user1Data, user2Data, user3Data } from "./CommonData";
import { SBTMetaData } from "./Type";

describe("Pulse", function () {
    let pulseContract: Pulse;
    let pulseAddress: any;
    let pulseSignerImpersonated: any;
    let owner: any;
    let user1: any;
    let user2: any;
    let user3: any;

    async function fixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploiement du contrat SBT
        const sbtContract = await ethers.deployContract("PulseSBT", [], {});
        await sbtContract.waitForDeployment();
        const pulseSBTAddress = await sbtContract.getAddress();
        console.log("SBT Contract deployed at:", pulseSBTAddress);

        // Déploiement du contrat Pulse
        const pulseContract = await ethers.deployContract(
            "Pulse",
            [pulseSBTAddress],
            {
                value: ethers.parseEther("10"),
            },
        );
        await pulseContract.waitForDeployment();
        const pulseContractAddress = await pulseContract.getAddress();
        await sbtContract.setPulseAddress(pulseContractAddress);

        const pulseContractAddressInsideSBT =
            await sbtContract.getPulseContractAddress();

        console.log(
            "Pulse Contract address inside SBT Contract : ",
            pulseContractAddressInsideSBT,
        );
        await network.provider.request({
            method: "hardhat_impersonateAccount",
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
        };
    }

    describe("Deployment", function () {
        it("Should deploy pulse contract and check if owner is correct", async () => {
            const { pulseContract, owner, user1, user2, user3 } =
                await loadFixture(fixture);
            const contractOwner = await pulseContract.owner(); // Supposant que vous avez une fonction owner() dans votre contrat
            expect(contractOwner).to.equal(owner.address);
        });

        it("Verify that PulseSBT is correctly define and set to Pulse Contract", async () => {});
    });

    describe("Consumption of PulseSBT functions", function () {
        beforeEach(async () => {
            ({ pulseContract, pulseAddress, owner, user1, user2, user3 } =
                await loadFixture(fixture));
        });

        it("Should verify that users doest have sbt", async () => {
            assert((await pulseContract.hasSoulBoundToken(user1)) === false);
            assert((await pulseContract.hasSoulBoundToken(user2)) === false);
            assert((await pulseContract.hasSoulBoundToken(user3)) === false);
        });
        it("Should mint for three users and check data", async () => {
            let metadata: SBTMetaData = {
                ...user1Data,
                issuer: pulseAddress,
            };
            await pulseContract.createAccount(user1.address, metadata);
            console.log(
                "hasSBTToken :",
                await pulseContract.hasSoulBoundToken(user1),
            );
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

        it("Should revert, only one sbt by user", async () => {
            const metadata: SBTMetaData = {
                ...user1Data,
                issuer: pulseAddress,
            };
            await pulseContract.createAccount(user1, metadata);
            await expect(
                pulseContract.createAccount(user1, metadata),
            ).to.be.revertedWith(
                "Address has already received a SoulBound Token",
            );
        });

        it("Should retrieve token metadata for user1", async () => {
            const metadataToCreateProfil: SBTMetaData = {
                ...user1Data,
                issuer: pulseAddress,
            };
            await pulseContract.createAccount(user1, metadataToCreateProfil);

            const metadataGetByAccount = await pulseContract.getAccount(
                user1.address,
            );
            expect(metadataGetByAccount.firstName).to.equal(
                user1Data.firstName,
            );
            expect(metadataGetByAccount.birthday).to.equal(user1Data.birthday);
            expect(metadataGetByAccount.gender).to.equal(user1Data.gender);
            expect(metadataGetByAccount.localisation).to.equal(
                user1Data.localisation,
            );
            expect(metadataGetByAccount.hobbies).to.deep.equal(
                user1Data.hobbies,
            );
            expect(metadataGetByAccount.interestedBy).to.deep.equal(
                user1Data.interestedBy,
            );
            expect(metadataGetByAccount.ipfsHashs).to.deep.equal([]);
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
