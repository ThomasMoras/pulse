// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./enum/GenderType.sol";

// Struct to store additional token metadata
struct TokenMetadata {
    uint256 id;
    string firstName;
    string lastName;
    uint8 age;
    Gender gender;
    string localisation;
    string hobbies;
    uint note;
    string ipfsHash;
    uint256 issuedAt;
    address issuer;
}
