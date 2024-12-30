import { expect } from 'chai';
import { ethers } from 'hardhat';
import { LitEncryption } from './utils/lit-encryption';

describe('LitEncryption', () => {
  let litEncryption: LitEncryption;
  let sender: any;
  let recipient: any;

  before(async () => {
    [sender, recipient] = await ethers.getSigners();

    litEncryption = new LitEncryption();
    await litEncryption.connect();
  });

  describe('Encryption and Decryption', () => {
    it('should encrypt and decrypt a message successfully', async () => {
      const originalMessage = 'Hello, this is a secret message!';

      // Encrypt
      const encryptedData = await litEncryption.encryptMessage(
        originalMessage,
        sender.address,
        recipient
      );

      // Verify encrypted data structure
      const parsedData = JSON.parse(encryptedData);
      expect(parsedData).to.have.property('ciphertext');
      expect(parsedData).to.have.property('dataToEncryptHash');

      // Decrypt
      const decryptedMessage = await litEncryption.decryptMessage(
        encryptedData,
        recipient.address,
        recipient
      );

      // Verify decryption
      expect(decryptedMessage).to.equal(originalMessage);
    });

    it('should handle empty message', async () => {
      try {
        await litEncryption.encryptMessage('', sender.address, recipient);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.equal('Message cannot be empty');
      }
    });

    it('should handle invalid encrypted data format', async () => {
      try {
        await litEncryption.decryptMessage('invalid-data', recipient, recipient.address);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
