// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../enum/GenderType.sol";
import "../SBTMetaData.sol";

interface IPulseSBT {
    function mintSoulBoundToken(
        address _recipient,
        SBTMetaData calldata _data
    ) external returns (uint256);

    function updateTokenMetadata(
        address _recipient,
        SBTMetaData calldata _data
    ) external returns (uint256);

    function hasSoulBoundToken(address _recipient) external view returns (bool);

    function getSBTMetaDataByUser(
        address _recipient
    ) external view returns (SBTMetaData memory);
}
