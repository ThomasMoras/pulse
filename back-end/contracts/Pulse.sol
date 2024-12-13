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

    // mapping sur le chat

    // mapping sur les events crée

    constructor(address _pulseSBTAddress) payable Ownable(msg.sender) {
        pulseSBTAddress = _pulseSBTAddress;
        pulseSBT = IPulseSBT(_pulseSBTAddress);
    }

    // Modifier for specific user, that can create event, sponsorship some activities
    modifier onlyPulsePartner() {
        require(true, "Only pulse partner can call this function");
        _;
    }

    // Modifier for pulse user, necessary to forbid external call (directly from smart contract)
    modifier onlyPulseUser() {
        require(true, "Only pulse user can call this function");
        _;
    }

    event AccountCreate();
    event AccountRemove();
    event ProfilUpdated();
    event Like();
    event NotLike();
    event Match();
    event Evaluate();

    function hasSoulBoundToken(address _address) external view returns (bool) {
        return pulseSBT.hasSoulBoundToken(_address);
    }

    function mintSoulBoundToken(
        address _recipient,
        string memory _firstName,
        string memory _lastName,
        uint8 _age,
        Gender _gender,
        string memory _localisation,
        string memory _hobbies,
        string memory _ipfsImageHash
    ) public onlyPulseUser {
        uint256 tokenId = pulseSBT.mintSoulBoundToken(
            _recipient,
            _firstName,
            _lastName,
            _age,
            _gender,
            _localisation,
            _hobbies,
            _ipfsImageHash
        );
    }

    function getTokenMetadataByUser(
        address user
    ) external view returns (TokenMetadata memory) {
        return pulseSBT.getTokenMetadataByUser(user);
    }

    function like() external {}

    function notLike() external {}
}
