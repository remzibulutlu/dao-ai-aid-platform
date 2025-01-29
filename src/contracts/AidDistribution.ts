// ABI for the Aid Distribution smart contract
export const AID_DISTRIBUTION_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "requestId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AidDistributed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_requestId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "distributeAid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_requestId",
        "type": "string"
      }
    ],
    "name": "getAidRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "requiredAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributedAmount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct AidDistribution.AidRequest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address on Sepolia testnet
export const AID_DISTRIBUTION_ADDRESS = "0x9A676e781A523b5d0C0e43731313A708CB607508";