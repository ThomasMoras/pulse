export const pulseContract = {
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  fromBlock: BigInt(0),
  abi: [
    {
      inputs: [],
      stateMutability: "payable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [],
      name: "AccountCreate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "AccountRemove",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "Evaluate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "Like",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "Match",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "NotLike",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "ProfilUpdated",
      type: "event",
    },
    {
      inputs: [],
      name: "LIKE_PER_DAY",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "like",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "notLike",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const;
