// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {SBTMetaData} from "./utils/structs/SBTMetaData.sol";

/**
 * @title Pulse SoulBond Token Contract
 * @author Thomas Moras
 * @notice This contract allows users to mint their unique SBT corresponding to their profile.
 */
contract PulseSBT is ERC721, Ownable {
    uint256 private _nextTokenId;
    address public pulseContractAddress;

    mapping(uint256 => SBTMetaData) private _tokenMetadata;
    mapping(address => SBTMetaData) private _tokenMetadataByUser;
    mapping(address => uint256) private _tokenIdByUser;
    mapping(address => bool) private _hasSoulBoundToken;

    // Events
    event TokenMinted(address indexed _recipient, uint256 _tokenId);
    event SBTMetaDataUpdated(uint256 indexed _tokenId);
    event TokenBurnt(uint256 indexed _tokenId);

    constructor() ERC721("PulseAccountSBT", "PSBT") Ownable(msg.sender) {}

    modifier onlyPulseContract() {
        require(msg.sender == pulseContractAddress, "Only the Pulse contract can call this function");
        _;
    }

    // Method to set the address of the Pulse contract
    function setPulseAddress(address _pulseContractAddress) external onlyOwner {
        require(_pulseContractAddress != address(0), "Invalid address");
        pulseContractAddress = _pulseContractAddress;
    }

    function getPulseContractAddress() external view returns (address) {
        return pulseContractAddress;
    }

    /**
     * @dev Mint a SoulBound Token to a specific address
     * @param _recipient The address receiving the token
     * @param _data The SBT metadata
     */
    function mintSoulBoundToken(
        address _recipient,
        SBTMetaData memory _data
    ) external onlyPulseContract returns (uint256) {
        require(!_hasSoulBoundToken[_recipient], "Address has already received a SoulBound Token");

        uint256 tokenId = ++_nextTokenId;

        _tokenMetadata[tokenId] = _data;
        _tokenIdByUser[_recipient] = tokenId;
        _tokenMetadataByUser[_recipient] = _data;
        _hasSoulBoundToken[_recipient] = true;

        _safeMint(_recipient, tokenId);

        emit TokenMinted(_recipient, tokenId);
        return tokenId;
    }

    function hasSoulBoundToken(address _recipient) external view returns (bool) {
        return _hasSoulBoundToken[_recipient];
    }

    function getSBTMetaDataByUser(address _recipient) external view onlyPulseContract returns (SBTMetaData memory) {
        return _tokenMetadataByUser[_recipient];
    }

    /**
     * @dev Update the metadata of a SoulBound Token
     * @param _recipient The address of the token owner
     * @param _data The SBT metadata
     */
    function updateTokenMetadata(
        address _recipient,
        SBTMetaData memory _data
    ) external onlyPulseContract returns (uint256) {
        // Ensure the user has a SoulBound Token
        require(_hasSoulBoundToken[_recipient], "User does not have a SoulBound Token");

        // Update token metadata
        _tokenMetadataByUser[_recipient] = _data;

        emit SBTMetaDataUpdated(_tokenIdByUser[_recipient]);

        return _tokenIdByUser[_recipient];
    }

    // Method to reconstruct the image URL
    function getImageUrl(string memory hash) public pure returns (string memory) {
        return string(abi.encodePacked("ipfs://", hash));
        // Or alternative
        // return string(abi.encodePacked("https://ipfs.io/ipfs/", hash));
    }

    function getTokenIdByUser(address user) public view returns (uint256) {
        uint256 tokenId = _tokenIdByUser[user];
        require(tokenId != 0, "No token found for this user");
        return tokenId;
    }

    // ::::::::::::: ERC721 OVERRIDE ::::::::::::: //

    function burn(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Only token owner can burn");
        require(_tokenId != 0, "Token is not valid");
        _burn(_tokenId);
        delete _tokenMetadataByUser[msg.sender];
        _hasSoulBoundToken[msg.sender] = false;
        emit TokenBurnt(_tokenId);
    }

    function transferFrom(address, address, uint256) public virtual override(ERC721) {
        revert("SoulBound Tokens are non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public virtual override(ERC721) {
        revert("SoulBound Tokens are non-transferable");
    }

    function approve(address, uint256) public virtual override(ERC721) {
        revert("SoulBound Tokens can not be approved");
    }
}
