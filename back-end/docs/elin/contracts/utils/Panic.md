# Panic







*Helper library for emitting standardized panic codes. ```solidity contract Example {      using Panic for uint256;      // Use any of the declared internal constants      function foo() { Panic.GENERIC.panic(); }      // Alternatively      function foo() { Panic.panic(Panic.GENERIC); } } ``` Follows the list from https://github.com/ethereum/solidity/blob/v0.8.24/libsolutil/ErrorCodes.h[libsolutil]. _Available since v5.1._*



