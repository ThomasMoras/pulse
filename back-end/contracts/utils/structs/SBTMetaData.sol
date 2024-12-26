// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Gender} from "../enum/Gender.sol";

// Struct SBT token metadata
struct SBTMetaData {
  string firstName;
  string description;
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
  bool isActive;
}
