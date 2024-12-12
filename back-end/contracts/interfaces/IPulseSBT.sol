// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../enum/GenderType.sol";

interface IPulseSBT {
    function mintSoulBoundToken(
        address recipient,
        string memory firstName,
        string memory lastName,
        uint8 age,
        Gender gender,
        string memory localisation,
        string memory hobbies,
        string memory ipfsImageHash
    ) external returns (uint256);

    function hasSoulBoundToken(address user) external view returns (bool);
}
