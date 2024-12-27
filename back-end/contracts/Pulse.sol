// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPulseSBT.sol";
import "./utils/structs/SBTMetaData.sol";
import "./utils/structs/Message.sol";
import "./utils/enum/InteractionStatus.sol";

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

  mapping(address => bool) isRegistred;
  mapping(address => mapping(address => InteractionStatus)) private hasInteracted;
  mapping(address => uint8) userSuperLike;
  mapping(address => uint8) userLike;

  mapping(bytes32 => Message[]) conversations;
  // mapping(bytes32 => address[2]) conversationParticipants;
  // mapping(address => bytes32[]) public userConversations;
  // mapping(bytes32 => bool) public userConversationsExists;
  // mapping(address => mapping(address => bytes32)) public conversationBetweenUsers;

  error InvalidAddress();
  error AlreadyInteracted(address user, address recipient);
  error UserNotRegistered(address user);
  error UserNotActive(address user);
  error SelfInteractionCheck(address user);
  error UnauthorizedAccess(address user);
  error NoConversationFound();
  error NotAParticipant();

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

  // modifier onlyParticipants(bytes32 _conversationId) {
  //   address[] memory participants = conversationParticipants[_conversationId];
  //   if (participants[0] != msg.sender && participants[1] != msg.sender) revert NotAParticipant();
  //   _;
  // }

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
  event Match(address sender, address receiver);

  // Not implemented
  mapping(address => bool) isPartner;
  event AccountRemove(address sender);
  event Evaluate(address sender, address receiver);
  event CreateEvent(address sender);
  event JointEvent(address sender);

  // ************************ USER PROFILE ACTION *********************//

  function createAccount(address _recipient, SBTMetaData memory _data) external {
    uint256 tokenId = pulseSBT.mintSoulBoundToken(_recipient, _data);
    isRegistred[_recipient] = true;
    userLike[_recipient] = LIKE_PER_DAY;
    userSuperLike[_recipient] = SUPER_LIKE_PER_DAY;
    emit AccountCreate(_recipient);
  }

  function updateAccount(address _recipient, SBTMetaData memory _data) external {
    uint256 tokenId = pulseSBT.updateTokenMetadata(_recipient, _data);
    emit AccountUpdated(_recipient);
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
      //_createConversation(msg.sender, _recipient);
      emit Match(msg.sender, _recipient);
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

  // function sendMessage(
  //   bytes32 _conversationId,
  //   string calldata _encryptedContent
  // ) external onlyParticipants(_conversationId) {
  //   require(bytes(_encryptedContent).length > 0, "Message cannot be empty");
  //   conversations[_conversationId].push(
  //     Message({
  //       sender: msg.sender,
  //       encryptedContent: _encryptedContent,
  //       timestamp: uint32(block.timestamp)
  //     })
  //   );

  //   emit NewMessage(_conversationId, msg.sender, block.timestamp);
  // }

  // not yet implemented
  function joinEvent(address _sender) external onlyRegistredUsers {}

  function createEvent(address _sender) external onlyPulsePartners {}

  // ************************ GETTERS FUNCTIONS *********************//

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

  // function getUserConversations(address _user) external view returns (bytes32[] memory) {
  //   return userConversations[_user];
  // }

  // function getConversationBetween(address _user1, address _user2) external view returns (bytes32) {
  //   bytes32 conversationId = conversationBetweenUsers[_user1][_user2];
  //   if (conversationId == bytes32(0)) revert NoConversationFound();
  //   return conversationId;
  // }

  // old function
  // function getConversationBetween(address _user1, address _user2) external view returns (bytes32) {
  //   bytes32[] memory userConvs = userConversations[_user1];
  //   for (uint i = 0; i < userConvs.length; i++) {
  //     address[] memory participants = conversationParticipants[userConvs[i]];
  //     if (
  //       (participants[0] == _user1 && participants[1] == _user2) ||
  //       (participants[0] == _user2 && participants[1] == _user1)
  //     ) {
  //       return userConvs[i];
  //     }
  //   }
  //   revert("No conversation found between these users");
  // }

  // ************************ PRIVATE FUNCTIONS *********************//

  // function _createConversation(address _user1, address _user2) private returns (bytes32) {
  //   require(_user1 != address(0), "Invalid participant address");
  //   require(_user2 != address(0), "Invalid participant address");

  //   (address orderedAddr1, address orderedAddr2) = _user1 < _user2
  //     ? (_user1, _user2)
  //     : (_user2, _user1);

  //   // create conversationId using timestamp and users address
  //   bytes32 conversationId = keccak256(abi.encodePacked(orderedAddr1, orderedAddr2));

  //   // add participants to conversations
  //   conversationParticipants[conversationId] = [orderedAddr1, orderedAddr2];
  //   conversationBetweenUsers[orderedAddr1][orderedAddr2] = conversationId;
  //   conversationBetweenUsers[orderedAddr2][orderedAddr1] = conversationId;

  //   return conversationId;
  // }
}
