export const pulseContract = {
  address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  fromBlock: BigInt(0),
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_pulseSBTAddress",
          "type": "address",
        },
      ],
      "stateMutability": "payable",
      "type": "constructor",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address",
        },
      ],
      "name": "AlreadyInteracted",
      "type": "error",
    },
    {
      "inputs": [],
      "name": "ConversationNotFound",
      "type": "error",
    },
    {
      "inputs": [],
      "name": "EmptyMessage",
      "type": "error",
    },
    {
      "inputs": [],
      "name": "InvalidAddress",
      "type": "error",
    },
    {
      "inputs": [],
      "name": "NotAParticipant",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address",
        },
      ],
      "name": "OwnableInvalidOwner",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address",
        },
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
      ],
      "name": "SelfInteractionCheck",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
      ],
      "name": "UnauthorizedAccess",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
      ],
      "name": "UserNotActive",
      "type": "error",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
      ],
      "name": "UserNotRegistered",
      "type": "error",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
      ],
      "name": "AccountCreate",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
      ],
      "name": "AccountRemove",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
      ],
      "name": "AccountUpdated",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
      ],
      "name": "CreateEvent",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address",
        },
      ],
      "name": "Evaluate",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "enum InteractionStatus",
          "name": "interraction",
          "type": "uint8",
        },
      ],
      "name": "Interacted",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
      ],
      "name": "JointEvent",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "conversationId",
          "type": "bytes32",
        },
      ],
      "name": "Match",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "conversationId",
          "type": "bytes32",
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256",
        },
      ],
      "name": "NewMessage",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address",
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address",
        },
      ],
      "name": "OwnershipTransferred",
      "type": "event",
    },
    {
      "inputs": [],
      "name": "LIKE_PER_DAY",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "SUPER_LIKE_PER_DAY",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint256",
              "name": "birthday",
              "type": "uint256",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender[]",
              "name": "interestedBy",
              "type": "uint8[]",
            },
            {
              "internalType": "string",
              "name": "localisation",
              "type": "string",
            },
            {
              "internalType": "string[]",
              "name": "hobbies",
              "type": "string[]",
            },
            {
              "internalType": "uint8",
              "name": "note",
              "type": "uint8",
            },
            {
              "internalType": "string[]",
              "name": "ipfsHashs",
              "type": "string[]",
            },
            {
              "internalType": "uint256",
              "name": "issuedAt",
              "type": "uint256",
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address",
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool",
            },
          ],
          "internalType": "struct SBTMetaData",
          "name": "_data",
          "type": "tuple",
        },
      ],
      "name": "createAccount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address",
        },
      ],
      "name": "createEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
      ],
      "name": "dislike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
      ],
      "name": "getAccount",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint256",
              "name": "birthday",
              "type": "uint256",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender[]",
              "name": "interestedBy",
              "type": "uint8[]",
            },
            {
              "internalType": "string",
              "name": "localisation",
              "type": "string",
            },
            {
              "internalType": "string[]",
              "name": "hobbies",
              "type": "string[]",
            },
            {
              "internalType": "uint8",
              "name": "note",
              "type": "uint8",
            },
            {
              "internalType": "string[]",
              "name": "ipfsHashs",
              "type": "string[]",
            },
            {
              "internalType": "uint256",
              "name": "issuedAt",
              "type": "uint256",
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address",
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool",
            },
          ],
          "internalType": "struct SBTMetaData",
          "name": "",
          "type": "tuple",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchSize",
          "type": "uint256",
        },
        {
          "internalType": "uint256",
          "name": "startIndex",
          "type": "uint256",
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "minAge",
              "type": "uint256",
            },
            {
              "internalType": "uint256",
              "name": "maxAge",
              "type": "uint256",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
            },
          ],
          "internalType": "struct FilterCriteria",
          "name": "criteria",
          "type": "tuple",
        },
      ],
      "name": "getBatchOfUsers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint256",
              "name": "birthday",
              "type": "uint256",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender[]",
              "name": "interestedBy",
              "type": "uint8[]",
            },
            {
              "internalType": "string",
              "name": "localisation",
              "type": "string",
            },
            {
              "internalType": "string[]",
              "name": "hobbies",
              "type": "string[]",
            },
            {
              "internalType": "uint8",
              "name": "note",
              "type": "uint8",
            },
            {
              "internalType": "string[]",
              "name": "ipfsHashs",
              "type": "string[]",
            },
            {
              "internalType": "uint256",
              "name": "issuedAt",
              "type": "uint256",
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address",
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool",
            },
          ],
          "internalType": "struct SBTMetaData[]",
          "name": "batch",
          "type": "tuple[]",
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user1",
          "type": "address",
        },
        {
          "internalType": "address",
          "name": "_user2",
          "type": "address",
        },
      ],
      "name": "getConversationBetween",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_conversationId",
          "type": "bytes32",
        },
      ],
      "name": "getConversationMessages",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address",
            },
            {
              "internalType": "string",
              "name": "encryptedContent",
              "type": "string",
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256",
            },
          ],
          "internalType": "struct Message[]",
          "name": "",
          "type": "tuple[]",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
      ],
      "name": "getInteractionStatus",
      "outputs": [
        {
          "internalType": "enum InteractionStatus",
          "name": "",
          "type": "uint8",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "getLikedProfil",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
      ],
      "name": "getReminderLike",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
      ],
      "name": "getReminderSuperLike",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
      ],
      "name": "getUserConversationsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
        {
          "internalType": "uint256",
          "name": "_page",
          "type": "uint256",
        },
      ],
      "name": "getUserConversationsPage",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "conversationId",
              "type": "bytes32",
            },
            {
              "internalType": "address",
              "name": "interlocutor",
              "type": "address",
            },
            {
              "internalType": "uint256",
              "name": "lastMessageTimestamp",
              "type": "uint256",
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool",
            },
          ],
          "internalType": "struct ConversationInfo[]",
          "name": "conversations",
          "type": "tuple[]",
        },
        {
          "internalType": "uint256",
          "name": "totalPages",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address",
        },
      ],
      "name": "hasSoulBoundToken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address",
        },
        {
          "internalType": "bytes32",
          "name": "_conversationId",
          "type": "bytes32",
        },
      ],
      "name": "isParticipant",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address",
        },
      ],
      "name": "joinEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
      ],
      "name": "like",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "pulseSBT",
      "outputs": [
        {
          "internalType": "contract IPulseSBT",
          "name": "",
          "type": "address",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "pulseSBTAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "removeAccount",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_conversationId",
          "type": "bytes32",
        },
        {
          "internalType": "string",
          "name": "_encryptedContent",
          "type": "string",
        },
      ],
      "name": "sendMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
      ],
      "name": "superLike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address",
        },
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address",
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint256",
              "name": "birthday",
              "type": "uint256",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender[]",
              "name": "interestedBy",
              "type": "uint8[]",
            },
            {
              "internalType": "string",
              "name": "localisation",
              "type": "string",
            },
            {
              "internalType": "string[]",
              "name": "hobbies",
              "type": "string[]",
            },
            {
              "internalType": "uint8",
              "name": "note",
              "type": "uint8",
            },
            {
              "internalType": "string[]",
              "name": "ipfsHashs",
              "type": "string[]",
            },
            {
              "internalType": "uint256",
              "name": "issuedAt",
              "type": "uint256",
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address",
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool",
            },
          ],
          "internalType": "struct SBTMetaData",
          "name": "_data",
          "type": "tuple",
        },
      ],
      "name": "updateAccount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [],
      "name": "userCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256",
        },
      ],
      "name": "userIndexToAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
  ],
} as const;
