// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPulseSBT.sol";
import "./utils/structs/SBTMetaData.sol";
import "./utils/structs/Message.sol";
import "./utils/enum/Interaction.sol";

/**
 * @title Pulse
 * @author Thomas Moras
 * @dev Main contract of onchain social dating application "Pulse"
 */
contract Pulse is Ownable {
  // Day limit like by user with no advantage NFT
  uint8 public constant LIKE_PER_DAY = 15;
  uint8 public constant SUPER_LIKE_PER_DAY = 3;
  address public pulseSBTAddress;
  IPulseSBT public pulseSBT;

  mapping(address => bool) isRegistred;
  mapping(address => mapping(address => InteractionStatus)) private hasInteracted;
  mapping(bytes32 => Message[]) conversations;
  mapping(bytes32 => address[2]) conversationParticipants;

  error InvalidAddress();
  error UserNotRegistered(address user);
  error UserNotActive(address user);
  error SelfInteractionCheck();
  error UnauthorizedAccess();

  constructor(address _pulseSBTAddress) payable Ownable(msg.sender) {
    pulseSBTAddress = _pulseSBTAddress;
    pulseSBT = IPulseSBT(_pulseSBTAddress);
  }

  // Modifier for specific user, that can create event, sponsorship some activities
  modifier onlyPulsePartners() {
    require(isPartner[msg.sender], UnauthorizedAccess());
    _;
  }

  // Modifier for pulse user, necessary to forbid external call (directly from smart contract)
  modifier onlyPulseUsers() {
    require(isRegistred[msg.sender], UnauthorizedAccess());
    _;
  }

  //   modifier onlyAdmin() {
  //     if (!isAdmin(msg.sender)) revert UnauthorizedAccess();
  //     _;
  //   }

  modifier onlySender(address _user) {
    if (msg.sender != _user) revert UnauthorizedAccess();
    _;
  }

  modifier onlyParticipants(bytes32 _idConversation) {
    address[2] memory participants = conversationParticipants[_idConversation];
    require(
      participants[0] == msg.sender || participants[1] == msg.sender,
      "You are not a participant of this conversation"
    );
    _;
  }

  event AccountCreate(address sender);
  event AccountUpdated(address sender);
  event Interacted(address sender, address receiver, InteractionStatus interraction);

  event NewMessage(bytes32 indexed conversationId, address indexed sender, uint256 timestamp);

  event NewConversation(address sender, address receiver);

  // Not implemented
  mapping(address => bool) isPartner;
  event AccountRemove(address sender);
  event Evaluate(address sender, address receiver);
  event CreateEvent(address sender);
  event JointEvent(address sender);

  function hasSoulBoundToken(address _address) external view returns (bool) {
    return pulseSBT.hasSoulBoundToken(_address);
  }

  // ************************ USER PROFILE ACTION *********************//

  function createAccount(address _recipient, SBTMetaData memory _data) external {
    uint256 tokenId = pulseSBT.mintSoulBoundToken(_recipient, _data);
    isRegistred[_recipient] = true;
    emit AccountCreate(_recipient);
  }

  function updateAccount(address _recipient, SBTMetaData memory _data) external {
    uint256 tokenId = pulseSBT.updateTokenMetadata(_recipient, _data);
    emit AccountUpdated(_recipient);
  }

  function removeAccount() external onlyPulseUsers returns (bool) {
    return true;
  }

  function getAccount(address _user) external view returns (SBTMetaData memory) {
    return pulseSBT.getSBTMetaDataByUser(_user);
  }

  function isActive(address _user) internal view returns (bool) {
    return pulseSBT.getSBTMetaDataByUser(_user).isActive;
  }

  // ************************ USER COMMON ACTIONS *********************//
  function like(address _recipient) external onlyPulseUsers {
    if (msg.sender == _recipient) revert SelfInteractionCheck();
    require(hasInteracted[msg.sender][_recipient] == InteractionStatus.NONE, "Already interacted");

    hasInteracted[msg.sender][_recipient] = InteractionStatus.LIKED;
    emit Interacted(msg.sender, _recipient, InteractionStatus.LIKED);

    // Create conversation if user like each others
    if (hasInteracted[_recipient][msg.sender] == InteractionStatus.LIKED) {
      _createConversation(msg.sender, _recipient);
      emit NewConversation(msg.sender, _recipient);
    }
  }

  function dislike(address _sender) external onlyPulseUsers {}

  function superLike(address _sender) external onlyPulseUsers {}

  function getLikedProfil() external returns (address[] memory) {}

  function sendMessage(
    bytes32 _conversationId,
    string memory _encryptedContent
  ) external onlyParticipants(_conversationId) {
    require(bytes(_encryptedContent).length > 0, "Message cannot be empty");
    Message memory message = Message({
      sender: msg.sender,
      encryptedContent: _encryptedContent,
      timestamp: block.timestamp
    });
    conversations[_conversationId].push(message);
    emit NewMessage(_conversationId, msg.sender, block.timestamp);
  }

  function joinEvent(address _sender) external onlyPulseUsers {}

  function createEvent(address _sender) external onlyPulsePartners {}

  // ************************ GETTERS FUNCTIONS *********************//

  function getInteractionStatus(
    address _user,
    address _recipient
  ) external view onlySender(_user) returns (InteractionStatus) {
    if (_user == address(0) || _recipient == address(0)) revert InvalidAddress();
    if (_user == _recipient) revert SelfInteractionCheck();
    if (!isRegistred[_user]) revert UserNotRegistered(_user);
    if (!isRegistred[_recipient]) revert UserNotRegistered(_recipient);
    if (!isActive(_user)) revert UserNotActive(_user);
    if (!isActive(_recipient)) revert UserNotActive(_recipient);
    return hasInteracted[_user][_recipient];
  }

  // ************************ PRIVATE FUNCTIONS *********************//

  function _createConversation(address _addr1, address _addr2) private returns (bytes32) {
    require(_addr1 != address(0), "Invalid participant address");
    require(_addr2 != address(0), "Invalid participant address");

    // Create conversationId using timestamp and users address
    bytes32 conversationId = keccak256(abi.encodePacked(block.timestamp, _addr1, _addr2));

    // Add participants to conversations
    conversationParticipants[conversationId] = [_addr1, _addr2];
    return conversationId;
  }
}
