// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title PulseNFT
 * @author Thomas Moras
 * @dev NFTs adding advantages to pulse users
 */
contract PulseNFT is ERC721, Ownable {
        constructor() ERC721("Pulse NFT", "PNFT") Ownable(msg.sender) {}


}