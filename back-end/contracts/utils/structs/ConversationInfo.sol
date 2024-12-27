// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
struct ConversationInfo {
  bytes32 conversationId;
  address interlocutor;
  uint256 lastMessageTimestamp;
  bool isActive;
}
