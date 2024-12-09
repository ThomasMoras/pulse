// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Test } from "forge-std/Test.sol";
import { Pulse } from "@/contracts/Pulse.sol";
import "forge-std/console.sol";

contract BankTest is Test {
    address owner = makeAddr("user0");
    address addr1 = makeAddr("addr1");
    address addr2 = makeAddr("addr2");
    address addr3 = makeAddr("addr3");

    Pulse public PulseContract;

    event Deposit(address indexed by, uint256 amount);
    event Withdraw(address indexed by, uint256 amount);
    
    function setUp() public {
        PulseContract = new Pulse();
    }

    // Initialization Tests
    function test_InitializeContract() public view {

    }

}