import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { CHAIN_CONFIG, SupportedChains } from "./chain";
import { encryptString, decryptToString } from "@lit-protocol/encryption";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { WalletClient } from "viem";

export class LitEncryption {
  private litNodeClient: LitNodeClient;
  private chainConfig: (typeof CHAIN_CONFIG)[SupportedChains];
  private isTestnet: boolean;
  private static signatureCache: Map<string, { signature: any; timestamp: number }> = new Map();
  private static SIGNATURE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(chain: SupportedChains, isTestnet: boolean = true) {
    this.chainConfig = CHAIN_CONFIG[chain];
    this.isTestnet = isTestnet;
    this.litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });
  }

  async connect() {
    await this.litNodeClient.connect();
  }

  private getChainInfo() {
    return this.isTestnet ? this.chainConfig.testnet : this.chainConfig;
  }

  private getAccessControlConditions(recipientAddress: string) {
    const chainInfo = this.getChainInfo();
    return [
      {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "",
        chain: chainInfo.name,
        method: "eth_getBalance",
        parameters: [recipientAddress, "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];
  }

  private generateNonce(length: number = 16): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = "";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      nonce += charset[randomValues[i] % charset.length];
    }
    return nonce;
  }

  private async getAuthSig(walletClient: WalletClient) {
    const address = walletClient.account?.address;
    if (!address) throw new Error("No account connected");

    const now = Date.now();
    const cacheKey = address.toLowerCase();

    const cached = LitEncryption.signatureCache.get(cacheKey);
    if (cached && now - cached.timestamp < LitEncryption.SIGNATURE_TIMEOUT) {
      console.log("Using cached signature");
      return cached.signature;
    }

    const currentTime = new Date();
    const expiration = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
    const chainInfo = this.getChainInfo();

    const siweMessage = new SiweMessage({
      domain: window.location.hostname,
      address: address,
      statement: "Sign this message to access Lit Protocol encrypted messages.",
      uri: window.location.origin,
      version: "1",
      chainId: chainInfo.id,
      nonce: this.generateNonce(),
      issuedAt: currentTime.toISOString(),
      expirationTime: expiration.toISOString(),
      resources: ["lit-protocol://encryption"],
    });

    const messageToSign = siweMessage.prepareMessage();
    const signature = await walletClient.signMessage({
      message: messageToSign,
      account: walletClient.account,
    });

    const authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: messageToSign,
      address: address,
    };

    LitEncryption.signatureCache.set(cacheKey, {
      signature: authSig,
      timestamp: now,
    });

    return authSig;
  }

  async decryptMessages(
    encryptedMessages: { encryptedData: string; recipientAddress: string }[],
    signer: ethers.Signer
  ): Promise<string[]> {
    const authSig = await this.getAuthSig(signer);
    const chainInfo = this.getChainInfo();

    const decryptedMessages = await Promise.all(
      encryptedMessages.map(async ({ encryptedData, recipientAddress }) => {
        try {
          const { ciphertext, dataToEncryptHash } = JSON.parse(encryptedData);
          const accessControlConditions = this.getAccessControlConditions(recipientAddress);

          return await decryptToString(
            {
              accessControlConditions,
              ciphertext,
              dataToEncryptHash,
              chain: chainInfo.name,
              authSig,
            },
            this.litNodeClient
          );
        } catch (error) {
          console.error("Error decrypting message:", error);
          return "";
        }
      })
    );

    return decryptedMessages;
  }

  async decryptMessage(
    encryptedData: string,
    recipientAddress: string,
    signer: ethers.Signer
  ): Promise<string> {
    try {
      const [decryptedMessage] = await this.decryptMessages(
        [{ encryptedData, recipientAddress }],
        signer
      );
      return decryptedMessage;
    } catch (error) {
      console.error("Error in decryptMessage:", error);
      return "";
    }
  }

  async encryptMessage(
    message: string,
    recipientAddress: string,
    signer: ethers.Signer
  ): Promise<string> {
    if (!message) throw new Error("Message cannot be empty");

    try {
      const accessControlConditions = this.getAccessControlConditions(recipientAddress);
      const authSig = await this.getAuthSig(signer);
      const chainInfo = this.getChainInfo();

      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          dataToEncrypt: message,
          chain: chainInfo.name,
          authSig,
        },
        this.litNodeClient
      );

      return JSON.stringify({
        ciphertext,
        dataToEncryptHash,
      });
    } catch (error) {
      console.error("Error encrypting message:", error);
      return "";
    }
  }
}
