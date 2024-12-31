// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./Gender.sol";

struct FilterCriteria {
  uint256 minAge;
  uint256 maxAge;
  Gender gender;
}
