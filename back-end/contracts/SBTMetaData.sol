// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./enum/GenderType.sol";

// Struct SBT token metadata
struct SBTMetaData {
    string firstName;
    string email;
    uint256 birthday;
    Gender gender;
    Gender[] interestedBy;
    string localisation;
    string[] hobbies;
    uint8 note;
    string[] ipfsHashs;
    uint256 issuedAt;
    address issuer;
}
