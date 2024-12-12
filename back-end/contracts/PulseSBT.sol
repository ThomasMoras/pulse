// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./enum/GenderType.sol";

/**
 * @title Pulse SoulBond Token Contract
 * @author Thomas Moras
 * @notice This contract allows users to mint their unique SBT corresponding to their profile.
 */
contract PulseSBT is ERC721, Ownable {
    uint256 private _tokenIds;
    address public pulseContractAddress;

    // Struct to store additional token metadata
    struct TokenMetadata {
        uint256 id;
        string firstName;
        string lastName;
        uint8 age;
        Gender gender;
        string localisation;
        string hobbies;
        uint note;
        string ipfsHash;
        uint256 issuedAt;
        address issuer;
    }
    // Mapping to store token metadata by user address
    mapping(address => TokenMetadata) private _tokenMetadataByUser;

    // Mapping to track which addresses have received a token
    mapping(address => bool) private _hasSoulBoundToken;

    // Events
    event TokenMinted(address indexed recipient, uint256 tokenId);
    event TokenDataUpdated(uint256 indexed tokenId);
    event TokenBurnt(uint256 indexed tokenId);

    constructor() ERC721("PulseAccountSBT", "PSBT") Ownable(msg.sender) {}

    modifier onlyPulseContract() {
        require(
            msg.sender == pulseContractAddress,
            "Only the Pulse contract can call this function"
        );
        _;
    }

    /**
     * @dev Mint a SoulBound Token to a specific address
     * @param recipient The address receiving the token
     * @param firstName First name of the recipient
     * @param lastName Last name of the recipient
     * @param age Age of the recipient
     * @param gender Gender of the recipient
     * @param localisation Localisation of the recipient
     * @param hobbies Hobbies of the recipient
     * @param ipfsImageHash URL of the recipient's image
     */
    function mintSoulBoundToken(
        address recipient,
        string memory firstName,
        string memory lastName,
        uint8 age,
        Gender gender,
        string memory localisation,
        string memory hobbies,
        string memory ipfsImageHash
    ) public onlyPulseContract returns (uint256) {
        // Ensure an address can only receive one SBT
        require(
            !_hasSoulBoundToken[recipient],
            "Address has already received a SoulBound Token"
        );

        _safeMint(recipient, ++_tokenIds);

        _tokenMetadataByUser[recipient] = TokenMetadata(
            _tokenIds,
            firstName,
            lastName,
            age,
            gender,
            localisation,
            hobbies,
            0,
            ipfsImageHash,
            block.timestamp,
            msg.sender
        );

        // Mark address as having received a token
        _hasSoulBoundToken[recipient] = true;

        emit TokenMinted(recipient, _tokenIds);

        return _tokenIds;
    }

    function hasSoulBoundToken(address user) external view returns (bool) {
        return _hasSoulBoundToken[user];
    }

    function getTokenMetadataByUser(
        address user
    ) external view onlyPulseContract returns (TokenMetadata memory) {
        return _tokenMetadataByUser[user];
    }

    // Méthode pour configurer l'adresse du ContratA
    function setPulseAddress(address _pulseContractAddress) external {
        require(_pulseContractAddress != address(0), "Invalid address");
        pulseContractAddress = _pulseContractAddress;
    }

    /**
     * @dev Update the metadata of a SoulBound Token
     * @param user The address of the token owner
     * @param firstName First name of the recipient
     * @param lastName Last name of the recipient
     * @param age Age of the recipient
     * @param gender Gender of the recipient
     * @param localisation Localisation of the recipient
     * @param hobbies Hobbies of the recipient
     * @param ipfsImageHash URL of the recipient's image
     */
    function updateTokenMetadata(
        address user,
        string memory firstName,
        string memory lastName,
        uint8 age,
        Gender gender,
        string memory localisation,
        string memory hobbies,
        string memory ipfsImageHash
    ) public onlyPulseContract {
        // Ensure the user has a SoulBound Token
        require(
            _hasSoulBoundToken[user],
            "User does not have a SoulBound Token"
        );

        // Update token metadata
        _tokenMetadataByUser[user] = TokenMetadata(
            _tokenMetadataByUser[user].id,
            firstName,
            lastName,
            age,
            gender,
            localisation,
            hobbies,
            _tokenMetadataByUser[user].note,
            ipfsImageHash,
            _tokenMetadataByUser[user].issuedAt,
            _tokenMetadataByUser[user].issuer
        );

        emit TokenDataUpdated(_tokenMetadataByUser[user].id);
    }

    // Reconstruction de l'URL
    function getImageUrl(
        string memory hash
    ) public pure returns (string memory) {
        return string(abi.encodePacked("ipfs://", hash));
        // Ou alternative
        // return string(abi.encodePacked("https://ipfs.io/ipfs/", hash));
    }

    // ::::::::::::: ERC721 OVERRIDE ::::::::::::: //

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can burn");
        require(tokenId != 0, "Token is not valid");
        _burn(tokenId);
        delete _tokenMetadataByUser[msg.sender];
        _hasSoulBoundToken[msg.sender] = false;
        emit TokenBurnt(tokenId);
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override(ERC721) {
        revert("SoulBound Tokens are non-transferable");
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override(ERC721) {
        revert("SoulBound Tokens are non-transferable");
    }

    function approve(address, uint256) public virtual override(ERC721) {
        revert("SoulBound Tokens can not be approved");
    }
}
