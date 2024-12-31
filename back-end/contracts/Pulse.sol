// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPulseSBT.sol";
import "./utils/structs/SBTMetaData.sol";
import "./utils/structs/Message.sol";
import "./utils/structs/ConversationInfo.sol";
import "./utils/enum/InteractionStatus.sol";
import "./utils/enum/FilterCriteria.sol";

/**
 * @title Pulse
 * @author Thomas Moras
 * @dev Main contract of onchain social dating application "Pulse"
 */
contract Pulse is Ownable {
  uint256 constant MAX_CONVERSATIONS_PER_PAGE = 10;

  // Day limit like by user with no NFTs advantage
  uint8 public constant LIKE_PER_DAY = 20;
  uint8 public constant SUPER_LIKE_PER_DAY = 5;
  address public pulseSBTAddress;
  IPulseSBT public pulseSBT;
  uint256 public userCount;

  mapping(uint256 => address) public userIndexToAddress;
  mapping(address => bool) isRegistred;
  mapping(address => mapping(address => InteractionStatus)) private hasInteracted;
  mapping(address => uint8) userSuperLike;
  mapping(address => uint8) userLike;

  mapping(bytes32 => Message[]) conversations;
  mapping(address => mapping(uint256 => ConversationInfo[])) private userConversationsByPage;
  mapping(address => uint256) private userConversationsCount;
  mapping(address => mapping(address => bytes32)) private conversationBetweenUsers;

  error InvalidAddress();
  error AlreadyInteracted(address user, address recipient);
  error UserNotRegistered(address user);
  error UserNotActive(address user);
  error SelfInteractionCheck(address user);
  error UnauthorizedAccess(address user);
  error ConversationNotFound();
  error NotAParticipant();
  error EmptyMessage();

  constructor(address _pulseSBTAddress) payable Ownable(msg.sender) {
    pulseSBTAddress = _pulseSBTAddress;
    pulseSBT = IPulseSBT(_pulseSBTAddress);
  }

  // ************************ MODIFIERS *********************//

  // Modifier for specific user, that can create event, sponsorship some activities
  modifier onlyPulsePartners() {
    require(isPartner[msg.sender], UnauthorizedAccess(msg.sender));
    _;
  }

  // Modifier for pulse user, necessary to forbid external call (directly from smart contract)
  modifier onlyRegistredUsers() {
    require(isRegistred[msg.sender], UnauthorizedAccess(msg.sender));
    _;
  }

  modifier onlySender(address _user) {
    if (msg.sender != _user) revert UnauthorizedAccess(msg.sender);
    _;
  }

  modifier onlyParticipants(bytes32 _conversationId) {
    if (!isParticipant(msg.sender, _conversationId)) revert NotAParticipant();
    _;
  }

  modifier checkInteraction(address _recipient) {
    if (msg.sender == _recipient) revert SelfInteractionCheck(msg.sender);
    if (hasInteracted[msg.sender][_recipient] != InteractionStatus.NONE)
      revert AlreadyInteracted(msg.sender, _recipient);
    _;
  }

  // ************************ EVENTS *********************//

  event AccountCreate(address sender);
  event AccountUpdated(address sender);
  event Interacted(address sender, address receiver, InteractionStatus interraction);
  event NewMessage(bytes32 indexed conversationId, address indexed sender, uint256 timestamp);
  event Match(address sender, address receiver, bytes32 conversationId);

  // Not implemented
  mapping(address => bool) isPartner;
  event AccountRemove(address sender);
  event Evaluate(address sender, address receiver);
  event CreateEvent(address sender);
  event JointEvent(address sender);

  // ************************ USER PROFILE ACTION *********************//

  function createAccount(
    address _recipient,
    SBTMetaData memory _data
  ) external returns (uint256 tokenId) {
    uint256 tokenId = pulseSBT.mintSoulBoundToken(_recipient, _data);
    isRegistred[_recipient] = true;
    userLike[_recipient] = LIKE_PER_DAY;
    userSuperLike[_recipient] = SUPER_LIKE_PER_DAY;
    userIndexToAddress[userCount] = _recipient;
    userCount++;
    emit AccountCreate(_recipient);
    return tokenId;
  }

  function updateAccount(
    address _recipient,
    SBTMetaData memory _data
  ) external returns (uint256 tokenId) {
    uint256 tokenId = pulseSBT.updateTokenMetadata(_recipient, _data);
    emit AccountUpdated(_recipient);
    return tokenId;
  }

  function removeAccount() external onlyRegistredUsers returns (bool) {
    return true;
  }

  function getAccount(address _user) external view returns (SBTMetaData memory) {
    return pulseSBT.getSBTMetaDataByUser(_user);
  }

  function isActive(address _user) internal view returns (bool) {
    return pulseSBT.getSBTMetaDataByUser(_user).isActive;
  }

  // ************************ USER COMMONS ACTIONS *********************//

  function like(address _recipient) external onlyRegistredUsers checkInteraction(_recipient) {
    require((userLike[msg.sender]) > 0, "You don't have enought like");
    hasInteracted[msg.sender][_recipient] = InteractionStatus.LIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.LIKED);
    --userLike[msg.sender];

    // Create conversation if user like each others
    if (hasInteracted[_recipient][msg.sender] == InteractionStatus.LIKED) {
      bytes32 conversationId = _createConversation(msg.sender, _recipient);
      emit Match(msg.sender, _recipient, conversationId);
    }
  }

  function dislike(address _recipient) external onlyRegistredUsers checkInteraction(_recipient) {
    hasInteracted[msg.sender][_recipient] = InteractionStatus.DISLIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.DISLIKED);
  }

  function superLike(address _recipient) external onlyRegistredUsers checkInteraction(_recipient) {
    require(userSuperLike[msg.sender] > 0, "You don't have enought super like");
    hasInteracted[msg.sender][_recipient] = InteractionStatus.SUPER_LIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.SUPER_LIKED);
    --userSuperLike[msg.sender];
  }

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

  // not yet implemented
  function joinEvent(address _sender) external onlyRegistredUsers {}

  function createEvent(address _sender) external onlyPulsePartners {}

  // ************************ GETTERS FUNCTIONS *********************//

  // Fonction de récupération des utilisateurs avec filtres
  function getBatchOfUsers(
    uint256 batchSize,
    uint256 startIndex,
    FilterCriteria memory criteria
  ) external view returns (SBTMetaData[] memory batch, uint256 count) {
    require(startIndex < userCount, "Invalid start");

    batch = new SBTMetaData[](batchSize);

    for (uint256 i = startIndex; count < batchSize && i < userCount; i++) {
      address userAddress = userIndexToAddress[i];
      SBTMetaData memory user = pulseSBT.getSBTMetaDataByUser(userAddress);
      if (isValidUserWithCriteria(userAddress, user, criteria)) {
        batch[count] = user;
        unchecked {
          ++count;
        }
      }
    }
  }

  function isValidUserWithCriteria(
    address userAddress,
    SBTMetaData memory user,
    FilterCriteria memory criteria
  ) internal view returns (bool) {
    if (
      !user.isActive ||
      userAddress == msg.sender ||
      hasInteracted[msg.sender][userAddress] != InteractionStatus.NONE
    ) {
      return false;
    }

    uint256 age = (block.timestamp - user.birthday) / 365 days;
    if (age < criteria.minAge || age > criteria.maxAge) {
      return false;
    }

    // Si gender est Undisclosed, on accepte tous les genres
    if (criteria.gender != Gender.Undisclosed && user.gender != criteria.gender) {
      return false;
    }
    return true;
  }

  // add security sender and admin
  function getReminderLike(address _user) external view returns (uint8) {
    return userLike[_user];
  }
  // add security sender and admin
  function getReminderSuperLike(address _user) external view returns (uint8) {
    return userSuperLike[_user];
  }

  // add security sender and admin
  function getLikedProfil() external returns (address[] memory) {}

  function hasSoulBoundToken(address _address) external view returns (bool) {
    return pulseSBT.hasSoulBoundToken(_address);
  }

  // add security admin
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

  function getUserConversationsPage(
    address _user,
    uint256 _page
  ) external view returns (ConversationInfo[] memory conversations, uint256 totalPages) {
    conversations = userConversationsByPage[_user][_page];
    totalPages =
      (userConversationsCount[_user] + MAX_CONVERSATIONS_PER_PAGE - 1) /
      MAX_CONVERSATIONS_PER_PAGE;
  }

  function getConversationBetween(address _user1, address _user2) external view returns (bytes32) {
    bytes32 conversationId = conversationBetweenUsers[_user1][_user2];
    if (conversationId == bytes32(0)) revert ConversationNotFound();
    return conversationId;
  }

  function getUserConversationsCount(address _user) external view returns (uint256) {
    return userConversationsCount[_user];
  }

  function isParticipant(address _user, bytes32 _conversationId) public view returns (bool) {
    ConversationInfo[] memory page = userConversationsByPage[_user][0];
    for (uint i = 0; i < page.length; i++) {
      if (page[i].conversationId == _conversationId) {
        return true;
      }
    }
    return false;
  }

  function getConversationMessages(
    bytes32 _conversationId
  ) external view onlyParticipants(_conversationId) returns (Message[] memory) {
    return conversations[_conversationId];
  }

  // ************************ PRIVATE FUNCTIONS *********************//

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
