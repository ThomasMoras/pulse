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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_adress",
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
          "name": "_adress",
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
          "name": "_recipient",
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
          "name": "_sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_receiver",
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
          "name": "_recipient",
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
          "name": "_sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_receiver",
          "type": "address",
        },
      ],
      "name": "Like",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_addr1",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_addr2",
          "type": "address",
        },
      ],
      "name": "Match",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_receiver",
          "type": "address",
        },
      ],
      "name": "NotLike",
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_adress",
          "type": "address",
        },
      ],
      "name": "ProfilUpdated",
      "type": "event",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_sender",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_receiver",
          "type": "address",
        },
      ],
      "name": "SuperLike",
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
              "internalType": "uint256",
              "name": "id",
              "type": "uint256",
            },
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint8",
              "name": "age",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
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
              "internalType": "uint256",
              "name": "note",
              "type": "uint256",
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
          ],
          "internalType": "struct SBTMetaData",
          "name": "_data",
          "type": "tuple",
        },
      ],
      "name": "createAccount",
      "outputs": [],
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
          "name": "_sender",
          "type": "address",
        },
      ],
      "name": "doLike",
      "outputs": [],
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
      "name": "doNotLike",
      "outputs": [],
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
      "name": "doSuperLike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address",
        },
      ],
      "name": "getTokenMetadataByUser",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256",
            },
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string",
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string",
            },
            {
              "internalType": "uint8",
              "name": "age",
              "type": "uint8",
            },
            {
              "internalType": "enum Gender",
              "name": "gender",
              "type": "uint8",
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
              "internalType": "uint256",
              "name": "note",
              "type": "uint256",
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
      "inputs": [],
      "name": "updateAccount",
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
  ],
} as const;
