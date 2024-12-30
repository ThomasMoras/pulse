import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { encryptString, decryptToString } from '@lit-protocol/encryption';
import { LIT_NETWORK } from '@lit-protocol/constants';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { CHAIN_CONFIG, SupportedChains } from '../config/chains';

export class LitEncryption {
  private litNodeClient: LitNodeClient;
  private chainConfig: (typeof CHAIN_CONFIG)[SupportedChains];
  private isTestnet: boolean;

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
        conditionType: 'evmBasic',
        contractAddress: '',
        standardContractType: '',
        chain: chainInfo.name,
        method: 'eth_getBalance',
        parameters: [recipientAddress, 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
      },
    ];
  }

  async getAuthSig(signer: ethers.Signer) {
    const address = await signer.getAddress();

    // Récupérer le timestamp actuel en ISO format
    const currentTime = new Date();
    const expiration = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // +24 heures

    const siweMessage = new SiweMessage({
      domain: 'lit-protocol.testnet', // Domaine plus spécifique
      address: address,
      statement: 'Sign this message to access Lit Protocol encrypted messages.',
      uri: 'https://lit-protocol.testnet', // URI complètement qualifiée
      version: '1',
      chainId: 31337,
      nonce: this.generateNonce(),
      issuedAt: currentTime.toISOString(),
      expirationTime: expiration.toISOString(), // Ajout d'une expiration
      resources: ['lit-protocol://decryption'], // Resource plus spécifique
    });

    // Création du message
    const messageToSign = siweMessage.prepareMessage();

    // Signature
    const signature = await signer.signMessage(messageToSign);

    // Vérification que la signature est valide
    const recoveredAddress = ethers.verifyMessage(messageToSign, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Signature verification failed');
    }

    return {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: messageToSign,
      address: address,
    };
  }

  private generateNonce(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';

    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      nonce += charset[randomValues[i] % charset.length];
    }

    return nonce;
  }

  async encryptMessage(
    message: string,
    recipientAddress: string,
    signer: ethers.Signer
  ): Promise<string> {
    if (!message) throw new Error('Message cannot be empty');

    const accessControlConditions = this.getAccessControlConditions(recipientAddress);
    const authSig = await this.getAuthSig(signer);

    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: message,
        chain: 'ethereum',
        authSig,
      },
      this.litNodeClient
    );

    return JSON.stringify({
      ciphertext,
      dataToEncryptHash,
    });
  }

  async decryptMessage(
    encryptedData: string,
    recipientAddress: string,
    signer: ethers.Signer
  ): Promise<string> {
    const { ciphertext, dataToEncryptHash } = JSON.parse(encryptedData);

    const accessControlConditions = this.getAccessControlConditions(recipientAddress);
    const authSig = await this.getAuthSig(signer);

    const decryptedMessage = await decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        chain: 'ethereum',
        authSig,
      },
      this.litNodeClient
    );

    return decryptedMessage;
  }
}
