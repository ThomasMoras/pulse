// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PulseNFT
 * @author Thomas Moras
 * @dev Factory used to mint other NFT
 */
contract PulseNFTFactory is Ownable {
    constructor() Ownable(msg.sender) {}
}
