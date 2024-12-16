// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./enum/GenderType.sol";

// Struct to store additional token metadata
struct SBTMetaData {
    uint256 id;
    string firstName;
    string email;
    uint8 age;
    Gender gender;
    Gender[] interestedBy;
    string localisation;
    string[] hobbies;
    uint note;
    string[] ipfsHashs;
    uint256 issuedAt;
    address issuer;
}
