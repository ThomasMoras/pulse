// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPulseSBT} from "./interfaces/IPulseSBT.sol";
import {SBTMetaData} from "./utils/structs/SBTMetaData.sol";
import {Message} from "./utils/structs/Message.sol";
import {ConversationInfo} from "./utils/structs/ConversationInfo.sol";
import {InteractionStatus} from "./utils/enum/InteractionStatus.sol";
import {FilterCriteria} from "./utils/enum/FilterCriteria.sol";
import {Gender} from "./utils/enum/Gender.sol";

/**
 * @title Pulse
 * @author Thomas Moras
 * @notice This contract implements the core functionality of the Pulse dating application
 * @dev Main contract handling user interactions, matches, and conversations
 */
contract Pulse is Ownable, ReentrancyGuard {
  /**
   * @notice Maximum number of conversations that can be displayed per page
   */
  uint256 public constant MAX_CONVERSATIONS_PER_PAGE = 10;

  /**
   * @notice Maximum number of likes per day for users without NFT advantages
   */
  uint8 public constant LIKE_PER_DAY = 20;

  /**
   * @notice Maximum number of super likes per day
   */
  uint8 public constant SUPER_LIKE_PER_DAY = 5;

  /**
   * @notice Address of the PulseSBT contract
   */
  address public pulseSBTAddress;

  /**
   * @notice Interface to interact with the PulseSBT contract
   */
  IPulseSBT public pulseSBT;

  /**
   * @notice Total number of registered users
   */
  uint256 public userCount;

  //**************************** Mappings ******************************//
  mapping(uint256 => address) public userIndexToAddress;
  mapping(address => bool) isRegistred;
  mapping(address => mapping(address => InteractionStatus)) private hasInteracted;
  mapping(address => uint8) userSuperLike;
  mapping(address => uint8) userLike;
  mapping(bytes32 => Message[]) conversations;
  mapping(address => mapping(uint256 => ConversationInfo[])) private userConversationsByPage;
  mapping(address => uint256) private userConversationsCount;
  mapping(address => mapping(address => bytes32)) private conversationBetweenUsers;
  mapping(address => bool) isPartner;

  //**************************** Custom Erros **************************//
  error InvalidAddress();
  error AlreadyInteracted(address user, address recipient);
  error UserNotRegistered(address user);
  error UserNotActive(address user);
  error SelfInteractionCheck(address user);
  error UnauthorizedAccess(address user);
  error ConversationNotFound();
  error NotAParticipant();
  error EmptyMessage();

  //**************************** Events *********************************//
  event AccountCreate(address sender);
  event AccountUpdated(address sender);
  event Interacted(address sender, address receiver, InteractionStatus interraction);
  event NewMessage(bytes32 indexed conversationId, address indexed sender, uint256 timestamp);
  event Match(address sender, address receiver, bytes32 conversationId);
  event AccountRemove(address sender);
  event Evaluate(address sender, address receiver);
  event CreateEvent(address sender);
  event JointEvent(address sender);

  /**
   * @notice Contract constructor
   * @param _pulseSBTAddress Address of the PulseSBT contract
   * @dev Initializes the contract with the PulseSBT contract address
   */
  constructor(address _pulseSBTAddress) payable Ownable(msg.sender) {
    require(_pulseSBTAddress != address(0), "Invalid PulseSBT address");
    pulseSBTAddress = _pulseSBTAddress;
    pulseSBT = IPulseSBT(_pulseSBTAddress);
  }

  //**************************** Modifiers *********************************//

  /**
   * @notice Ensures caller is a Pulse partner
   */
  modifier onlyPulsePartners() {
    require(isPartner[msg.sender], UnauthorizedAccess(msg.sender));
    _;
  }

  /**
   * @notice Ensures caller is a registered user
   */
  modifier onlyRegistredUsers() {
    require(isRegistred[msg.sender], UnauthorizedAccess(msg.sender));
    _;
  }

  /**
   * @notice Ensures caller is the specified user
   * @param _user Address of the user to check against
   */
  modifier onlySender(address _user) {
    if (msg.sender != _user) revert UnauthorizedAccess(msg.sender);
    _;
  }

  /**
   * @notice Ensures caller is a participant in the conversation
   * @param _conversationId ID of the conversation
   */
  modifier onlyParticipants(bytes32 _conversationId) {
    if (!isParticipant(msg.sender, _conversationId)) revert NotAParticipant();
    _;
  }

  /**
   * @notice Validates if an address is not zero
   * @param _address Address to validate
   */
  modifier validateAddress(address _address) {
    require(_address != address(0), "Invalid address");
    _;
  }
  /**
   * @notice Ensures interaction is valid and hasn't occurred before
   * @param _recipient Address of the interaction recipient
   */
  modifier checkInteraction(address _recipient) {
    if (msg.sender == _recipient) revert SelfInteractionCheck(msg.sender);
    if (hasInteracted[msg.sender][_recipient] != InteractionStatus.NONE)
      revert AlreadyInteracted(msg.sender, _recipient);
    _;
  }

  /**
   * @notice Creates a new user account
   * @param _recipient Address of the new user
   * @param _data Metadata for the user's profile
   * @return tokenId The ID of the minted SBT
   * @dev Mints a new SBT and initializes user data
   */
  function createAccount(
    address _recipient,
    SBTMetaData memory _data
  ) external nonReentrant validateAddress(_recipient) returns (uint256 tokenId) {
    require(!isRegistred[_recipient], "User already registered");

    tokenId = pulseSBT.mintSoulBoundToken(_recipient, _data);
    isRegistred[_recipient] = true;
    userLike[_recipient] = LIKE_PER_DAY;
    userSuperLike[_recipient] = SUPER_LIKE_PER_DAY;
    userIndexToAddress[userCount] = _recipient;
    userCount++;

    emit AccountCreate(_recipient);
    return tokenId;
  }

  /**
   * @notice Updates an existing user account
   */
  function updateAccount(
    address _recipient,
    SBTMetaData memory _data
  ) external nonReentrant validateAddress(_recipient) returns (uint256 tokenId) {
    tokenId = pulseSBT.updateTokenMetadata(_recipient, _data);
    emit AccountUpdated(_recipient);
    return tokenId;
  }

  /**
   * @notice Checks if a user's profile is active
   * @param _user Address of the user to check
   * @return bool True if the user is active
   */
  function isActive(address _user) internal view returns (bool) {
    return pulseSBT.getSBTMetaDataByUser(_user).isActive;
  }

  /**
   * @notice Allows a user to like another user's profile
   */
  function like(
    address _recipient
  ) external nonReentrant onlyRegistredUsers checkInteraction(_recipient) {
    require(userLike[msg.sender] > 0, "You don't have enough likes");
    hasInteracted[msg.sender][_recipient] = InteractionStatus.LIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.LIKED);
    --userLike[msg.sender];

    if (hasInteracted[_recipient][msg.sender] == InteractionStatus.LIKED) {
      bytes32 conversationId = _createConversation(msg.sender, _recipient);
      emit Match(msg.sender, _recipient, conversationId);
    }
  }

  /**
   * @notice Allows a user to dislike another user's profile
   */
  function dislike(address _recipient) external onlyRegistredUsers checkInteraction(_recipient) {
    hasInteracted[msg.sender][_recipient] = InteractionStatus.DISLIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.DISLIKED);
  }

  /**
   * @notice Allows a user to super like another user's profile
   */
  function superLike(
    address _recipient
  ) external nonReentrant onlyRegistredUsers checkInteraction(_recipient) {
    require(userSuperLike[msg.sender] > 0, "You don't have enough super likes");
    hasInteracted[msg.sender][_recipient] = InteractionStatus.SUPER_LIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.SUPER_LIKED);
    --userSuperLike[msg.sender];
  }

  /**
   * @notice Sends a message in a conversation
   * @param _conversationId ID of the conversation
   * @param _encryptedContent Encrypted content of the message
   */
  function sendMessage(
    bytes32 _conversationId,
    string calldata _encryptedContent
  ) external onlyParticipants(_conversationId) {
    if (bytes(_encryptedContent).length == 0) revert EmptyMessage();

    conversations[_conversationId].push(
      Message({
        sender: msg.sender,
        encryptedContent: _encryptedContent,
        timestamp: uint32(block.timestamp)
      })
    );

    emit NewMessage(_conversationId, msg.sender, uint32(block.timestamp));
  }

  /**
   * @notice Returns a batch of users matching specific criteria
   * @param batchSize Number of users to return
   * @param startIndex Starting index for the batch
   * @param criteria Filter criteria for user selection
   * @param caller Address of the calling user
   * @return batch Array of user metadata
   * @return count Number of users in the batch
   */
  function getBatchOfUsers(
    uint256 batchSize,
    uint256 startIndex,
    FilterCriteria memory criteria,
    address caller
  ) external view returns (SBTMetaData[] memory batch, uint256 count) {
    require(startIndex < userCount, "Invalid start index");

    uint256 validUsersCount = 0;
    for (uint256 i = startIndex; i < userCount && validUsersCount < batchSize; i++) {
      address userAddress = userIndexToAddress[i];
      SBTMetaData memory user = pulseSBT.getSBTMetaDataByUser(userAddress);
      if (isValidUserWithCriteria(userAddress, user, criteria, caller)) {
        validUsersCount++;
      }
    }

    batch = new SBTMetaData[](validUsersCount);
    count = 0;

    for (uint256 i = startIndex; count < validUsersCount && i < userCount; i++) {
      address userAddress = userIndexToAddress[i];
      SBTMetaData memory user = pulseSBT.getSBTMetaDataByUser(userAddress);
      if (isValidUserWithCriteria(userAddress, user, criteria, caller)) {
        batch[count] = user;
        unchecked {
          ++count;
        }
      }
    }

    return (batch, count);
  }

  //**************************** Getters *********************************//

  /**
   * @notice Get all data from a user account
   * @param _user Address of the user
   * @return SBTMetaData Token SBT metadata of user
   */
  function getAccount(address _user) external view returns (SBTMetaData memory) {
    return pulseSBT.getSBTMetaDataByUser(_user);
  }

  /**
   * @notice Gets remaining likes for a user
   * @param _user Address of the user
   * @return uint8 Number of remaining likes
   */
  function getReminderLike(address _user) external view returns (uint8) {
    return userLike[_user];
  }

  /**
   * @notice Gets remaining super likes for a user
   * @param _user Address of the user
   * @return uint8 Number of remaining super likes
   */
  function getReminderSuperLike(address _user) external view returns (uint8) {
    return userSuperLike[_user];
  }

  /**
   * @notice Checks if an address has a SoulBound Token
   * @param _address Address to check
   * @return bool True if the address has an SBT
   */
  function hasSoulBoundToken(address _address) external view returns (bool) {
    return pulseSBT.hasSoulBoundToken(_address);
  }

  /**
   * @notice Gets the interaction status between two users
   * @param _user Address of the first user
   * @param _recipient Address of the second user
   * @return InteractionStatus The status of their interaction
   */
  function getInteractionStatus(
    address _user,
    address _recipient
  ) external view onlySender(_user) returns (InteractionStatus) {
    if (_user == address(0) || _recipient == address(0)) revert InvalidAddress();
    if (_user == _recipient) revert SelfInteractionCheck(_user);
    if (!isRegistred[_user]) revert UserNotRegistered(_user);
    if (!isRegistred[_recipient]) revert UserNotRegistered(_recipient);
    if (!isActive(_user)) revert UserNotActive(_user);
    if (!isActive(_recipient)) revert UserNotActive(_recipient);
    return hasInteracted[_user][_recipient];
  }

  /**
   * @notice Gets a page of conversations for a user
   * @param _user Address of the user
   * @param _page Page number to retrieve
   * @return conversations Array of conversation info
   * @return totalPages Total number of pages
   */
  function getUserConversationsPage(
    address _user,
    uint256 _page
  ) external view returns (ConversationInfo[] memory conversations, uint256 totalPages) {
    conversations = userConversationsByPage[_user][_page];
    totalPages =
      (userConversationsCount[_user] + MAX_CONVERSATIONS_PER_PAGE - 1) /
      MAX_CONVERSATIONS_PER_PAGE;
  }

  /**
   * @notice Gets the conversation ID between two users
   * @param _user1 Address of the first user
   * @param _user2 Address of the second user
   * @return bytes32 The conversation ID
   */
  function getConversationBetween(address _user1, address _user2) external view returns (bytes32) {
    bytes32 conversationId = conversationBetweenUsers[_user1][_user2];
    if (conversationId == bytes32(0)) revert ConversationNotFound();
    return conversationId;
  }

  /**
   * @notice Gets the total number of conversations for a user
   * @param _user Address of the user
   * @return uint256 Number of conversations
   */
  function getUserConversationsCount(address _user) external view returns (uint256) {
    return userConversationsCount[_user];
  }

  /**
   * @notice Checks if a user is participant in a conversation
   * @param _user Address of the user
   * @param _conversationId ID of the conversation
   * @return bool True if the user is a participant
   */
  function isParticipant(address _user, bytes32 _conversationId) public view returns (bool) {
    ConversationInfo[] memory page = userConversationsByPage[_user][0];
    for (uint i = 0; i < page.length; i++) {
      if (page[i].conversationId == _conversationId) {
        return true;
      }
    }
    return false;
  }

  /**
   * @notice Gets all messages in a conversation
   * @param _conversationId ID of the conversation
   * @param caller Address of the user requesting messages
   * @return Message[] Array of messages in the conversation
   */
  function getConversationMessages(
    bytes32 _conversationId,
    address caller
  ) external view returns (Message[] memory) {
    if (!isParticipant(caller, _conversationId)) revert NotAParticipant();
    return conversations[_conversationId];
  }

  //************************ Private Functions *****************************//

  /**
   * @notice Validates if a user matches the given criteria
   * @param userAddress Address of the user to check
   * @param user Metadata of the user
   * @param criteria Filter criteria to match against
   * @param caller Address of the user making the request
   * @return bool True if the user matches all criteria
   */
  function isValidUserWithCriteria(
    address userAddress,
    SBTMetaData memory user,
    FilterCriteria memory criteria,
    address caller
  ) private view returns (bool) {
    if (
      !user.isActive ||
      userAddress == caller ||
      hasInteracted[caller][userAddress] != InteractionStatus.NONE
    ) {
      return false;
    }

    uint256 age = (block.timestamp - user.birthday) / 365 days;
    if (age < criteria.minAge || age > criteria.maxAge) {
      return false;
    }

    if (criteria.gender != Gender.Undisclosed && user.gender != criteria.gender) {
      return false;
    }
    return true;
  }

  /**
   * @notice Creates a new conversation between two users
   * @param _addr1 Address of the first user
   * @param _addr2 Address of the second user
   * @return bytes32 ID of the created conversation
   */
  function _createConversation(address _addr1, address _addr2) private returns (bytes32) {
    bytes32 existingConversation = conversationBetweenUsers[_addr1][_addr2];
    if (existingConversation != bytes32(0)) {
      return existingConversation;
    }

    bytes32 conversationId = keccak256(abi.encodePacked(_addr1, _addr2, block.timestamp));

    conversationBetweenUsers[_addr1][_addr2] = conversationId;
    conversationBetweenUsers[_addr2][_addr1] = conversationId;

    _addConversationToUser(_addr1, _addr2, conversationId);
    _addConversationToUser(_addr2, _addr1, conversationId);

    return conversationId;
  }

  /**
   * @notice Adds a conversation to a user's conversation list
   * @param user Address of the user
   * @param interlocutor Address of the conversation partner
   * @param conversationId ID of the conversation
   */
  function _addConversationToUser(
    address user,
    address interlocutor,
    bytes32 conversationId
  ) private {
    uint256 currentCount = userConversationsCount[user];
    uint256 pageNumber = currentCount / MAX_CONVERSATIONS_PER_PAGE;

    ConversationInfo memory newConversation = ConversationInfo({
      conversationId: conversationId,
      interlocutor: interlocutor,
      lastMessageTimestamp: block.timestamp,
      isActive: true
    });

    userConversationsByPage[user][pageNumber].push(newConversation);
    userConversationsCount[user]++;
  }
}
