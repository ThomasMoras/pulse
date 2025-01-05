# SafeCast







*Wrappers over Solidity&#39;s uintXX/intXX/bool casting operators with added overflow checks. Downcasting from uint256/int256 in Solidity does not revert on overflow. This can easily result in undesired exploitation or bugs, since developers usually assume that overflows raise errors. `SafeCast` restores this intuition by reverting the transaction when such an operation overflows. Using this library instead of the unchecked operations eliminates an entire class of bugs, so it&#39;s recommended to use it always.*



## Errors

### SafeCastOverflowedIntDowncast

```solidity
error SafeCastOverflowedIntDowncast(uint8 bits, int256 value)
```



*Value doesn&#39;t fit in an int of `bits` size.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| bits | uint8 | undefined |
| value | int256 | undefined |

### SafeCastOverflowedIntToUint

```solidity
error SafeCastOverflowedIntToUint(int256 value)
```



*An int value doesn&#39;t fit in an uint of `bits` size.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| value | int256 | undefined |

### SafeCastOverflowedUintDowncast

```solidity
error SafeCastOverflowedUintDowncast(uint8 bits, uint256 value)
```



*Value doesn&#39;t fit in an uint of `bits` size.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| bits | uint8 | undefined |
| value | uint256 | undefined |

### SafeCastOverflowedUintToInt

```solidity
error SafeCastOverflowedUintToInt(uint256 value)
```



*An uint value doesn&#39;t fit in an int of `bits` size.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| value | uint256 | undefined |


