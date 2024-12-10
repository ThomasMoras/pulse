// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PulseAccountSBT is ERC721, Ownable {
    uint256 private _tokenIds;

    // Enum representing shipping status
    enum Gender {
        Male,
        Female,
        NonBinary,
        Other,
        Undisclosed
    }

    // Struct to store additional token metadata
    struct TokenMetadata {
        string firstName;
        string lastName;
        uint8 age;
        Gender gender;
        string localisation;
        string hobbies;
        uint note;
        uint256 issuedAt;
        address issuer;
    }

    // Mapping to store token metadata by token id
    // mapping(uint256 => TokenMetadata) private _tokenMetadataById;

    // Mapping to store token metadata by user address
    mapping(address => TokenMetadata) private _tokenMetadataByUser;

    // Mapping to track which addresses have received a token
    mapping(address => bool) private _hasSoulBoundToken;

    // Events
    event TokenMinted(address indexed recipient, uint256 tokenId);
    event TokenDataUpdated(uint256 indexed tokenId, string newData);

    constructor() ERC721("PulseAccountSBT", "PSBT") Ownable(msg.sender) {}

    /**
     * @dev Mint a SoulBound Token to a specific address
     * @param recipient The address receiving the token
     * @param firstName First name of the recipient
     * @param lastName Last name of the recipient
     * @param age Age of the recipient
     * @param gender Gender of the recipient
     * @param localisation Localisation of the recipient
     * @param hobbies Hobbies of the recipient
     */
    function mintSoulBoundToken(
        address recipient,
        string memory firstName,
        string memory lastName,
        uint8 age,
        Gender gender,
        string memory localisation,
        string memory hobbies
    ) public onlyOwner returns (uint256) {
        // Ensure an address can only receive one SBT
        require(
            !_hasSoulBoundToken[recipient],
            "Address has already received a SoulBound Token"
        );

        _safeMint(recipient, ++_tokenIds);

        // Store token metadata
        // _tokenMetadataById[_tokenIds] = TokenMetadata(
        //     firstName,
        //     lastName,
        //     age,
        //     gender,
        //     localisation,
        //     hobbies,
        //     0,
        //     block.timestamp,
        //     msg.sender
        // );

        _tokenMetadataByUser[recipient] = TokenMetadata(
            firstName,
            lastName,
            age,
            gender,
            localisation,
            hobbies,
            0,
            block.timestamp,
            msg.sender
        );


        // Mark address as having received a token
        _hasSoulBoundToken[recipient] = true;

        emit TokenMinted(recipient, _tokenIds);

        return _tokenIds;
    }

    function getTokenMetadataByUser(
        address user
    ) external view onlyOwner returns (TokenMetadata memory) {
        return _tokenMetadataByUser[user];
    }


    // add burn

    // ::::::::::::: ERC721 OVERRIDE ::::::::::::: //

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
        revert("SoulBound Tokens can not be approve");
    }
}
