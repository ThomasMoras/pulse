# Pulse

*Thomas Moras*

> Pulse

This contract implements the core functionality of the Pulse dating application

*Main contract handling user interactions, matches, and conversations*

## Methods

### LIKE_PER_DAY

```solidity
function LIKE_PER_DAY() external view returns (uint8)
```

Maximum number of likes per day for users without NFT advantages




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### SUPER_LIKE_PER_DAY

```solidity
function SUPER_LIKE_PER_DAY() external view returns (uint8)
```

Maximum number of super likes per day




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### createAccount

```solidity
function createAccount(address _recipient, SBTMetaData _data) external nonpayable returns (uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _recipient | address | undefined |
| _data | SBTMetaData | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### dislike

```solidity
function dislike(address _recipient) external nonpayable
```

Allows a user to dislike another user&#39;s profile



#### Parameters

| Name | Type | Description |
|---|---|---|
| _recipient | address | Address of the user being disliked |

### getBatchOfUsers

```solidity
function getBatchOfUsers(uint256 batchSize, uint256 startIndex, FilterCriteria criteria, address caller) external view returns (struct SBTMetaData[] batch, uint256 count)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| batchSize | uint256 | undefined |
| startIndex | uint256 | undefined |
| criteria | FilterCriteria | undefined |
| caller | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| batch | SBTMetaData[] | undefined |
| count | uint256 | undefined |

### getConversationBetween

```solidity
function getConversationBetween(address _user1, address _user2) external view returns (bytes32)
```

Gets the conversation ID between two users



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user1 | address | Address of the first user |
| _user2 | address | Address of the second user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | bytes32 The conversation ID |

### getConversationMessages

```solidity
function getConversationMessages(bytes32 _conversationId, address caller) external view returns (struct Message[])
```

Gets all messages in a conversation



#### Parameters

| Name | Type | Description |
|---|---|---|
| _conversationId | bytes32 | ID of the conversation |
| caller | address | Address of the user requesting messages |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Message[] | Message[] Array of messages in the conversation |

### getInteractionStatus

```solidity
function getInteractionStatus(address _user, address _recipient) external view returns (enum InteractionStatus)
```

Gets the interaction status between two users



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the first user |
| _recipient | address | Address of the second user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum InteractionStatus | InteractionStatus The status of their interaction |

### getReminderLike

```solidity
function getReminderLike(address _user) external view returns (uint8)
```

Gets remaining likes for a user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | uint8 Number of remaining likes |

### getReminderSuperLike

```solidity
function getReminderSuperLike(address _user) external view returns (uint8)
```

Gets remaining super likes for a user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | uint8 Number of remaining super likes |

### getUserConversationsCount

```solidity
function getUserConversationsCount(address _user) external view returns (uint256)
```

Gets the total number of conversations for a user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 Number of conversations |

### getUserConversationsPage

```solidity
function getUserConversationsPage(address _user, uint256 _page) external view returns (struct ConversationInfo[] conversations, uint256 totalPages)
```

Gets a page of conversations for a user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the user |
| _page | uint256 | Page number to retrieve |

#### Returns

| Name | Type | Description |
|---|---|---|
| conversations | ConversationInfo[] | Array of conversation info |
| totalPages | uint256 | Total number of pages |

### hasSoulBoundToken

```solidity
function hasSoulBoundToken(address _address) external view returns (bool)
```

Checks if an address has a SoulBound Token



#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | Address to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool True if the address has an SBT |

### isParticipant

```solidity
function isParticipant(address _user, bytes32 _conversationId) external view returns (bool)
```

Checks if a user is participant in a conversation



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the user |
| _conversationId | bytes32 | ID of the conversation |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool True if the user is a participant |

### like

```solidity
function like(address _recipient) external nonpayable
```

Allows a user to like another user&#39;s profile

*Creates a match if both users have liked each other*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _recipient | address | Address of the user being liked |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### pulseSBT

```solidity
function pulseSBT() external view returns (contract IPulseSBT)
```

Interface to interact with the PulseSBT contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IPulseSBT | undefined |

### pulseSBTAddress

```solidity
function pulseSBTAddress() external view returns (address)
```

Address of the PulseSBT contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### sendMessage

```solidity
function sendMessage(bytes32 _conversationId, string _encryptedContent) external nonpayable
```

Sends a message in a conversation



#### Parameters

| Name | Type | Description |
|---|---|---|
| _conversationId | bytes32 | ID of the conversation |
| _encryptedContent | string | Encrypted content of the message |

### superLike

```solidity
function superLike(address _recipient) external nonpayable
```

Allows a user to super like another user&#39;s profile



#### Parameters

| Name | Type | Description |
|---|---|---|
| _recipient | address | Address of the user being super liked |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateAccount

```solidity
function updateAccount(address _recipient, SBTMetaData _data) external nonpayable returns (uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _recipient | address | undefined |
| _data | SBTMetaData | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### userCount

```solidity
function userCount() external view returns (uint256)
```

Total number of registered users




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### userIndexToAddress

```solidity
function userIndexToAddress(uint256) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### AccountCreate

```solidity
event AccountCreate(address sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |

### AccountRemove

```solidity
event AccountRemove(address sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |

### AccountUpdated

```solidity
event AccountUpdated(address sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |

### CreateEvent

```solidity
event CreateEvent(address sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |

### Evaluate

```solidity
event Evaluate(address sender, address receiver)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| receiver  | address | undefined |

### Interacted

```solidity
event Interacted(address sender, address receiver, enum InteractionStatus interraction)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| receiver  | address | undefined |
| interraction  | enum InteractionStatus | undefined |

### JointEvent

```solidity
event JointEvent(address sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |

### Match

```solidity
event Match(address sender, address receiver, bytes32 conversationId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| receiver  | address | undefined |
| conversationId  | bytes32 | undefined |

### NewMessage

```solidity
event NewMessage(bytes32 indexed conversationId, address indexed sender, uint256 timestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| conversationId `indexed` | bytes32 | undefined |
| sender `indexed` | address | undefined |
| timestamp  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



## Errors

### AlreadyInteracted

```solidity
error AlreadyInteracted(address user, address recipient)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |
| recipient | address | undefined |

### ConversationNotFound

```solidity
error ConversationNotFound()
```






### EmptyMessage

```solidity
error EmptyMessage()
```






### InvalidAddress

```solidity
error InvalidAddress()
```






### NotAParticipant

```solidity
error NotAParticipant()
```






### OwnableInvalidOwner

```solidity
error OwnableInvalidOwner(address owner)
```



*The owner is not a valid owner account. (eg. `address(0)`)*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

### OwnableUnauthorizedAccount

```solidity
error OwnableUnauthorizedAccount(address account)
```



*The caller account is not authorized to perform an operation.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### SelfInteractionCheck

```solidity
error SelfInteractionCheck(address user)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

### UnauthorizedAccess

```solidity
error UnauthorizedAccess(address user)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

### UserNotActive

```solidity
error UserNotActive(address user)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

### UserNotRegistered

```solidity
error UserNotRegistered(address user)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |


