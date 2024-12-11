// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Pulse
 * @author Thomas Moras
 * @dev Main contract of onchain social dating application "Pulse"
 * keys features of dapp
 * - Enabling user uniqueness verification (Sybil resistance)
 * - Allowing the creation of one account per user (Proof of Personhood).
 * - Transparency and supports the use of a Soulbound Token (SBT) to store user profil data
 * - Include Pulse NFTs to provide benefits to user that own it.
 */
contract Pulse is Ownable {
        constructor() payable Ownable(msg.sender)  {}
}
