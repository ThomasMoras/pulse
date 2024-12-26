// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

// Struct of message data
struct Message {
    address sender;
    string encryptedContent;
    uint256 timestamp;
}