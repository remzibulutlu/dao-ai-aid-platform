// ABI for the smart contract
export const PROPOSAL_VOTING_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_proposalId",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_proposalId",
        "type": "string"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address on Sepolia testnet with correct EIP-55 checksum
export const PROPOSAL_VOTING_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";