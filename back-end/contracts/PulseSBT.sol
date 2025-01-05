// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {SBTMetaData} from "./utils/structs/SBTMetaData.sol";

/**
 * @title PulseSBT
 * @author Thomas Moras
 * @notice This contract implements the Soulbound Token functionality for Pulse profiles
 * @dev Extends ERC721 with non-transferable tokens and profile metadata
 */
contract PulseSBT is ERC721, Ownable {
  /**
   * @notice Next token ID to be minted
   */
  uint256 private _nextTokenId;

  /**
   * @notice Address of the main Pulse contract
   */
  address public pulseContractAddress;

  // Mappings
  /** @notice Mapping from token ID to token metadata */
  mapping(uint256 => SBTMetaData) private _tokenMetadata;
  /** @notice Mapping from user address to token metadata */
  mapping(address => SBTMetaData) private _tokenMetadataByUser;
  /** @notice Mapping from user address to token ID */
  mapping(address => uint256) private _tokenIdByUser;
  /** @notice Mapping tracking if an address has a SoulBound token */
  mapping(address => bool) private _hasSoulBoundToken;

  // Events
  /** @notice Emitted when a new token is minted */
  event TokenMinted(address indexed _recipient, uint256 _tokenId);
  /** @notice Emitted when token metadata is updated */
  event SBTMetaDataUpdated(uint256 indexed _tokenId);
  /** @notice Emitted when a token is burned */
  event TokenBurnt(uint256 indexed _tokenId);

  /**
   * @notice Initializes the PulseSBT contract
   * @dev Sets up the ERC721 token with name "PulseAccountSBT" and symbol "PSBT"
   */
  constructor() ERC721("PulseAccountSBT", "PSBT") Ownable(msg.sender) {}

  /**
   * @notice Ensures the function caller is the Pulse contract
   */
  modifier onlyPulseContract() {
    require(msg.sender == pulseContractAddress, "Only the Pulse contract can call this function");
    _;
  }

  /**
   * @notice Sets the address of the main Pulse contract
   * @param _pulseContractAddress Address of the Pulse contract
   * @dev Can only be called by contract owner
   */
  function setPulseAddress(address _pulseContractAddress) external onlyOwner {
    require(_pulseContractAddress != address(0), "Invalid address");
    pulseContractAddress = _pulseContractAddress;
  }

  /**
   * @notice Returns the address of the Pulse contract
   * @return address The Pulse contract address
   */
  function getPulseContractAddress() external view returns (address) {
    return pulseContractAddress;
  }

  /**
   * @notice Mints a new SoulBound Token
   * @param _recipient Address receiving the token
   * @param _data Token metadata
   * @return uint256 ID of the minted token
   * @dev Can only be called by the Pulse contract
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

  /**
   * @notice Checks if an address has a SoulBound Token
   * @param _recipient Address to check
   * @return bool True if the address has a token
   */
  function hasSoulBoundToken(address _recipient) external view returns (bool) {
    return _hasSoulBoundToken[_recipient];
  }

  /**
   * @notice Gets the metadata for a user's SoulBound Token
   * @param _recipient Address of the token holder
   * @return SBTMetaData The token's metadata
   */
  function getSBTMetaDataByUser(
    address _recipient
  ) external view onlyPulseContract returns (SBTMetaData memory) {
    return _tokenMetadataByUser[_recipient];
  }

  /**
   * @notice Updates the metadata of a SoulBound Token
   * @param _recipient Address of the token holder
   * @param _data New metadata
   * @return uint256 ID of the updated token
   */
  function updateTokenMetadata(
    address _recipient,
    SBTMetaData memory _data
  ) external onlyPulseContract returns (uint256) {
    require(_hasSoulBoundToken[_recipient], "User does not have a SoulBound Token");

    _tokenMetadataByUser[_recipient] = _data;

    emit SBTMetaDataUpdated(_tokenIdByUser[_recipient]);

    return _tokenIdByUser[_recipient];
  }

  /**
   * @notice Constructs the IPFS URL for a token's image
   * @param hash IPFS hash of the image
   * @return string Complete IPFS URL
   */
  function getImageUrl(string memory hash) public pure returns (string memory) {
    return string(abi.encodePacked("ipfs://", hash));
  }

  /**
   * @notice Gets the token ID for a user
   * @param user Address of the token holder
   * @return uint256 ID of the user's token
   */
  function getTokenIdByUser(address user) public view returns (uint256) {
    uint256 tokenId = _tokenIdByUser[user];
    require(tokenId != 0, "No token found for this user");
    return tokenId;
  }

  /**
   * @notice Burns a SoulBound Token
   * @param _tokenId ID of the token to burn
   * @dev Can only be called by the token owner
   */
  function burn(uint256 _tokenId) external {
    require(ownerOf(_tokenId) == msg.sender, "Only token owner can burn");
    require(_tokenId != 0, "Token is not valid");
    _burn(_tokenId);
    delete _tokenMetadataByUser[msg.sender];
    _hasSoulBoundToken[msg.sender] = false;
    emit TokenBurnt(_tokenId);
  }

  /**
   * @notice Disabled - SoulBound Tokens cannot be transferred
   * @dev Always reverts
   */
  function transferFrom(address, address, uint256) public virtual override(ERC721) {
    revert("SoulBound Tokens are non-transferable");
  }

  /**
   * @notice Disabled - SoulBound Tokens cannot be transferred
   * @dev Always reverts
   */
  function safeTransferFrom(
    address,
    address,
    uint256,
    bytes memory
  ) public virtual override(ERC721) {
    revert("SoulBound Tokens are non-transferable");
  }

  /**
   * @notice Disabled - SoulBound Tokens cannot be approved
   * @dev Always reverts
   */
  function approve(address, uint256) public virtual override(ERC721) {
    revert("SoulBound Tokens can not be approved");
  }

  /**
   * @notice Disabled - SoulBound Tokens cannot be approved
   * @dev Always reverts
   */
  function setApprovalForAll(address, bool) public virtual override(ERC721) {
    revert("SoulBound tokens can not support approvals");
  }
}
