import { NextResponse,NextRequest } from 'next/server'
import { BigNumber, ethers } from 'ethers';
import { Relayer, RelayerTransactionPayload } from '@openzeppelin/defender-relay-client';

export const config = {
  runtime: 'edge',
};

interface Log {
  address: string;
  topics: string[];
  data: string;
}

interface TransferLog {
  from: string;
  to: string;
  value: ethers.BigNumber;
}

const ABI= `
[
  {
    "type": "constructor",
    "name": "",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "error",
    "name": "OperatorNotAllowed",
    "inputs": [
      {
        "type": "address",
        "name": "operator",
        "internalType": "address"
      }
    ],
    "outputs": []
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "type": "address",
        "name": "account",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "operator",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "bool",
        "name": "approved",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClaimConditionsUpdated",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "type": "tuple[]",
        "name": "claimConditions",
        "components": [
          {
            "type": "uint256",
            "name": "startTimestamp",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "maxClaimableSupply",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "supplyClaimed",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "quantityLimitPerWallet",
            "internalType": "uint256"
          },
          {
            "type": "bytes32",
            "name": "merkleRoot",
            "internalType": "bytes32"
          },
          {
            "type": "uint256",
            "name": "pricePerToken",
            "internalType": "uint256"
          },
          {
            "type": "address",
            "name": "currency",
            "internalType": "address"
          },
          {
            "type": "string",
            "name": "metadata",
            "internalType": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct IClaimCondition.ClaimCondition[]"
      },
      {
        "type": "bool",
        "name": "resetEligibility",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ContractURIUpdated",
    "inputs": [
      {
        "type": "string",
        "name": "prevURI",
        "indexed": false,
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "newURI",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DefaultRoyalty",
    "inputs": [
      {
        "type": "address",
        "name": "newRoyaltyRecipient",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "newRoyaltyBps",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "type": "uint8",
        "name": "version",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MaxTotalSupplyUpdated",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "maxTotalSupply",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorRestriction",
    "inputs": [
      {
        "type": "bool",
        "name": "restriction",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnerUpdated",
    "inputs": [
      {
        "type": "address",
        "name": "prevOwner",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "newOwner",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PlatformFeeInfoUpdated",
    "inputs": [
      {
        "type": "address",
        "name": "platformFeeRecipient",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "platformFeeBps",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PrimarySaleRecipientUpdated",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "type": "bytes32",
        "name": "previousAdminRole",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "type": "bytes32",
        "name": "newAdminRole",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "sender",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "sender",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoyaltyForToken",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "royaltyRecipient",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "royaltyBps",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SaleRecipientForTokenUpdated",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "saleRecipient",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokensClaimed",
    "inputs": [
      {
        "type": "uint256",
        "name": "claimConditionIndex",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "claimer",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "receiver",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "quantityClaimed",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokensLazyMinted",
    "inputs": [
      {
        "type": "uint256",
        "name": "startTokenId",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "endTokenId",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "type": "string",
        "name": "baseURI",
        "indexed": false,
        "internalType": "string"
      },
      {
        "type": "bytes",
        "name": "encryptedBaseURI",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferBatch",
    "inputs": [
      {
        "type": "address",
        "name": "operator",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "from",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256[]",
        "name": "ids",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "type": "uint256[]",
        "name": "values",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferSingle",
    "inputs": [
      {
        "type": "address",
        "name": "operator",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "from",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true,
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "id",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "value",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "URI",
    "inputs": [
      {
        "type": "string",
        "name": "value",
        "indexed": false,
        "internalType": "string"
      },
      {
        "type": "uint256",
        "name": "id",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": [],
    "outputs": [
      {
        "type": "bytes32",
        "name": "",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "id",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOfBatch",
    "inputs": [
      {
        "type": "address[]",
        "name": "accounts",
        "internalType": "address[]"
      },
      {
        "type": "uint256[]",
        "name": "ids",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "type": "uint256[]",
        "name": "",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "burnBatch",
    "inputs": [
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      },
      {
        "type": "uint256[]",
        "name": "ids",
        "internalType": "uint256[]"
      },
      {
        "type": "uint256[]",
        "name": "values",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {
        "type": "address",
        "name": "_receiver",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "_quantity",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_currency",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_pricePerToken",
        "internalType": "uint256"
      },
      {
        "type": "tuple",
        "name": "_allowlistProof",
        "components": [
          {
            "type": "bytes32[]",
            "name": "proof",
            "internalType": "bytes32[]"
          },
          {
            "type": "uint256",
            "name": "quantityLimitPerWallet",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "pricePerToken",
            "internalType": "uint256"
          },
          {
            "type": "address",
            "name": "currency",
            "internalType": "address"
          }
        ],
        "internalType": "struct IDrop1155.AllowlistProof"
      },
      {
        "type": "bytes",
        "name": "_data",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "claimCondition",
    "inputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "currentStartId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "count",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contractType",
    "inputs": [],
    "outputs": [
      {
        "type": "bytes32",
        "name": "",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "contractURI",
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": "",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contractVersion",
    "inputs": [],
    "outputs": [
      {
        "type": "uint8",
        "name": "",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getActiveClaimConditionId",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBaseURICount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBatchIdAtIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "_index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getClaimConditionById",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "_conditionId",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "tuple",
        "name": "condition",
        "components": [
          {
            "type": "uint256",
            "name": "startTimestamp",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "maxClaimableSupply",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "supplyClaimed",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "quantityLimitPerWallet",
            "internalType": "uint256"
          },
          {
            "type": "bytes32",
            "name": "merkleRoot",
            "internalType": "bytes32"
          },
          {
            "type": "uint256",
            "name": "pricePerToken",
            "internalType": "uint256"
          },
          {
            "type": "address",
            "name": "currency",
            "internalType": "address"
          },
          {
            "type": "string",
            "name": "metadata",
            "internalType": "string"
          }
        ],
        "internalType": "struct IClaimCondition.ClaimCondition"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDefaultRoyaltyInfo",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      },
      {
        "type": "uint16",
        "name": "",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlatformFeeInfo",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      },
      {
        "type": "uint16",
        "name": "",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoleAdmin",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "type": "bytes32",
        "name": "",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoleMember",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "member",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoleMemberCount",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "count",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoyaltyInfoForToken",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      },
      {
        "type": "uint16",
        "name": "",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSupplyClaimedByWallet",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "_conditionId",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_claimer",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "supplyClaimedByWallet",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "grantRole",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "hasRole",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasRoleWithSwitch",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "type": "address",
        "name": "_defaultAdmin",
        "internalType": "address"
      },
      {
        "type": "string",
        "name": "_name",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "_symbol",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "_contractURI",
        "internalType": "string"
      },
      {
        "type": "address[]",
        "name": "_trustedForwarders",
        "internalType": "address[]"
      },
      {
        "type": "address",
        "name": "_saleRecipient",
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "_royaltyRecipient",
        "internalType": "address"
      },
      {
        "type": "uint128",
        "name": "_royaltyBps",
        "internalType": "uint128"
      },
      {
        "type": "uint128",
        "name": "_platformFeeBps",
        "internalType": "uint128"
      },
      {
        "type": "address",
        "name": "_platformFeeRecipient",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "operator",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isTrustedForwarder",
    "inputs": [
      {
        "type": "address",
        "name": "forwarder",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lazyMint",
    "inputs": [
      {
        "type": "uint256",
        "name": "_amount",
        "internalType": "uint256"
      },
      {
        "type": "string",
        "name": "_baseURIForTokens",
        "internalType": "string"
      },
      {
        "type": "bytes",
        "name": "_data",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "batchId",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "maxTotalSupply",
    "inputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "multicall",
    "inputs": [
      {
        "type": "bytes[]",
        "name": "data",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [
      {
        "type": "bytes[]",
        "name": "results",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": "",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextTokenIdToMint",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "operatorRestriction",
    "inputs": [],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "primarySaleRecipient",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceRole",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeRole",
    "inputs": [
      {
        "type": "bytes32",
        "name": "role",
        "internalType": "bytes32"
      },
      {
        "type": "address",
        "name": "account",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "royaltyInfo",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "salePrice",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "receiver",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "royaltyAmount",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "safeBatchTransferFrom",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "to",
        "internalType": "address"
      },
      {
        "type": "uint256[]",
        "name": "ids",
        "internalType": "uint256[]"
      },
      {
        "type": "uint256[]",
        "name": "amounts",
        "internalType": "uint256[]"
      },
      {
        "type": "bytes",
        "name": "data",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "internalType": "address"
      },
      {
        "type": "address",
        "name": "to",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "id",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "amount",
        "internalType": "uint256"
      },
      {
        "type": "bytes",
        "name": "data",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "saleRecipient",
    "inputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "type": "address",
        "name": "operator",
        "internalType": "address"
      },
      {
        "type": "bool",
        "name": "approved",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setClaimConditions",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "tuple[]",
        "name": "_conditions",
        "components": [
          {
            "type": "uint256",
            "name": "startTimestamp",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "maxClaimableSupply",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "supplyClaimed",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "quantityLimitPerWallet",
            "internalType": "uint256"
          },
          {
            "type": "bytes32",
            "name": "merkleRoot",
            "internalType": "bytes32"
          },
          {
            "type": "uint256",
            "name": "pricePerToken",
            "internalType": "uint256"
          },
          {
            "type": "address",
            "name": "currency",
            "internalType": "address"
          },
          {
            "type": "string",
            "name": "metadata",
            "internalType": "string"
          }
        ],
        "internalType": "struct IClaimCondition.ClaimCondition[]"
      },
      {
        "type": "bool",
        "name": "_resetClaimEligibility",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setContractURI",
    "inputs": [
      {
        "type": "string",
        "name": "_uri",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setDefaultRoyaltyInfo",
    "inputs": [
      {
        "type": "address",
        "name": "_royaltyRecipient",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_royaltyBps",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setMaxTotalSupply",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "_maxTotalSupply",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOperatorRestriction",
    "inputs": [
      {
        "type": "bool",
        "name": "_restriction",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOwner",
    "inputs": [
      {
        "type": "address",
        "name": "_newOwner",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPlatformFeeInfo",
    "inputs": [
      {
        "type": "address",
        "name": "_platformFeeRecipient",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_platformFeeBps",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPrimarySaleRecipient",
    "inputs": [
      {
        "type": "address",
        "name": "_saleRecipient",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setRoyaltyInfoForToken",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_recipient",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_bps",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSaleRecipientForToken",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_saleRecipient",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "subscribeToRegistry",
    "inputs": [
      {
        "type": "address",
        "name": "_subscription",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "type": "bytes4",
        "name": "interfaceId",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": "",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "uri",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "string",
        "name": "",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyClaim",
    "inputs": [
      {
        "type": "uint256",
        "name": "_conditionId",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_claimer",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_tokenId",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "_quantity",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "_currency",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_pricePerToken",
        "internalType": "uint256"
      },
      {
        "type": "tuple",
        "name": "_allowlistProof",
        "components": [
          {
            "type": "bytes32[]",
            "name": "proof",
            "internalType": "bytes32[]"
          },
          {
            "type": "uint256",
            "name": "quantityLimitPerWallet",
            "internalType": "uint256"
          },
          {
            "type": "uint256",
            "name": "pricePerToken",
            "internalType": "uint256"
          },
          {
            "type": "address",
            "name": "currency",
            "internalType": "address"
          }
        ],
        "internalType": "struct IDrop1155.AllowlistProof"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "isOverride",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
]
`

const c = new ethers.Contract(process.env.ERC1155_CONTRACT_ADDRESS as string, ABI)

function decodeERC20Transfers(logs: Log[]): TransferLog[] {
  const iface = new ethers.utils.Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ]);

  const transferLogs = logs.filter((log) => log.topics[0] === iface.getEventTopic('Transfer'));

  return transferLogs.map((log) => {
    const decodedLog = iface.decodeEventLog('Transfer', log.data, log.topics);
    return {
      from: decodedLog.from,
      to: decodedLog.to,
      value: decodedLog.value,
    };
  });
}

export async function POST(req:NextRequest) {  
  /*
 {
  id: '7c6f5040-a376-4fa5-b5d0-51928866d007',
  event_type: 'ALERT',
  transaction: {
    network: '84531',
    block_hash: '0x08f71ff83628a94cd91b8b1ab480bc3cb4a559cd06fd5489e36e06ff29c9d7a5',
    block_number: 9474421,
    hash: '0x4a2d9212cbc7d5187eefd4b8d6f6208b75d08bbde95b90a512c02f121d95f60a',
    from: '0x69bAdF095B03d62e97445EB0142e6488d19fF38B',
    to: '0xCB0B29999f1EC513992509625FF69655f667330A',
    logs: [{"address":"0xCB0B29999f1EC513992509625FF69655f667330A","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x00000000000000000000000069badf095b03d62e97445eb0142e6488d19ff38b","0x0000000000000000000000004c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5"],"data":"0x00000000000000000000000000000000000000000000003635c9adc5dea00000"}],
    input: '0xa9059cbb0000000000000000000000004c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d500000000000000000000000000000000000000000000003635c9adc5dea00000',
    value: '0x0',
    nonce: '0x17',
    gas: '0x13aa4',
    gas_used: '0xf968',
    cumulative_gas_used: '0x1b381',
    gas_price: '0x5f5e132',
    gas_tip_cap: '0x5f5e100',
    gas_fee_cap: '0x5f5e139'
  }
}
*/
  const credentials = { apiKey: process.env.DEFENDER_API_KEY as string, apiSecret: process.env.DEFENDER_API_SECRET as string }

  const relayer = new Relayer(credentials);

  const data = await req.json()
  const transferLog = decodeERC20Transfers(data.transaction.logs)
  console.log("received transfers:",transferLog);


  //Note: thirdweb with oz relay is TOO slow for vercel, we need to use raw txs instead 
  // const sdk =ThirdwebSDK.fromSigner(tWallet,process.env.CHAIN as string, {   
  //   secretKey:process.env.THIRD_WEB_SECRET as string,
  // });
  // const contract  = await sdk.getContract(process.env.ERC1155_CONTRACT_ADDRESS as string, ABI);
  
  const toAddress = transferLog[0].from
  let tokenId=0;
  const minAmountWei = ethers.utils.parseUnits(process.env.MIN_AMOUNT_ETH as string,"ether")
  if (transferLog[0].value.gt(BigNumber.from(minAmountWei))){
    tokenId=1;
  }// The token ID of the NFT you want to send
  const amount = 1; // How many copies of the NFTs to transfer
  console.log("sending nft to:",toAddress)
  
  console.log("populating Tx:");
  let pTx = await c.populateTransaction.safeTransferFrom("0x6B2bc7a4e217549936AE28B9121eE6e06A207381", toAddress, tokenId, amount, "0x")   
  const rTx = {
    to:pTx.to as string,
    data: pTx.data as string,
    value:"0x00",
    speed: 'fastest',
    gasLimit: 500000,
  } as RelayerTransactionPayload

  console.log("sending populated tx to oz for signing:",pTx)
  //Note: this is faster because all we do is wait for the relayer to sign!
  const r = await relayer.sendTransaction(rTx)
  console.log("receipt from oz:",rTx)

  return NextResponse.json({})
}