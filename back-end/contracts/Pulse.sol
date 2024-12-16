// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPulseSBT.sol";
import "./SBTMetaData.sol";

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
    mapping(address => bool) isPartner;
    mapping(address => address) hasLiked;

    constructor(address _pulseSBTAddress) payable Ownable(msg.sender) {
        pulseSBTAddress = _pulseSBTAddress;
        pulseSBT = IPulseSBT(_pulseSBTAddress);
    }

    // Modifier for specific user, that can create event, sponsorship some activities
    modifier onlyPulsePartner() {
        require(
            isPartner[msg.sender] == true,
            "Only a pulse partner can call this function"
        );
        _;
    }

    // Modifier for pulse user, necessary to forbid external call (directly from smart contract)
    modifier onlyPulseUser() {
        require(
            isRegistred[msg.sender] == true,
            "Only a registered user can call this function"
        );
        _;
    }

    event AccountCreate(address _adress);
    event AccountRemove(address _adress);
    event ProfilUpdated(address _adress);
    event Like(address _sender, address _receiver);
    event NotLike(address _sender, address _receiver);
    event SuperLike(address _sender, address _receiver);
    event Match(address _addr1, address _addr2);
    event Evaluate(address _sender, address _receiver);
    event CreateEvent(address _recipient);
    event JointEvent(address _recipient);

    function hasSoulBoundToken(address _address) external view returns (bool) {
        return pulseSBT.hasSoulBoundToken(_address);
    }

    function createAccount(
        address _recipient,
        SBTMetaData memory _data
    ) public {
        uint256 tokenId = pulseSBT.mintSoulBoundToken(_recipient, _data);
        isRegistred[_recipient] = true;
        emit AccountCreate(_recipient);
    }

    function updateAccount() external onlyPulseUser returns (bool) {
        return true;
    }

    function removeAccount() external onlyPulseUser returns (bool) {
        return true;
    }

    function getTokenMetadataByUser(
        address user
    ) external view returns (SBTMetaData memory) {
        return pulseSBT.getSBTMetaDataByUser(user);
    }

    function doLike(address _sender) external onlyPulseUser {}

    function doNotLike(address _sender) external onlyPulseUser {}

    function doSuperLike(address _sender) external onlyPulseUser {}

    function joinEvent(address _sender) external onlyPulseUser {}

    function createEvent(address _sender) external onlyPulsePartner {}
}
