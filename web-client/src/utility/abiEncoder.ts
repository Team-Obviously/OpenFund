import { ethers } from 'ethers'

const providerURL = 'https://rpc-amoy.polygon.technology'
const contractAddress = '0xae9b52cAf30f7412Fcdb3e3047402fD6947A62BC'

// Set up the provider to connect to the Polygon network
const provider = new ethers.JsonRpcProvider(providerURL)

const ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'DonationReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
    ],
    name: 'RepositoryRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'issueName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'StakeAssigned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'issueName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'resolvers',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'distributions',
        type: 'uint256[]',
      },
    ],
    name: 'StakeDistributed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'issueName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'assignStakeToIssue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'issueName',
        type: 'string',
      },
      {
        internalType: 'address[]',
        name: 'resolvers',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'distributions',
        type: 'uint256[]',
      },
    ],
    name: 'distributeStakeToResolvers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
    ],
    name: 'donateToRepository',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'repoName',
        type: 'string',
      },
    ],
    name: 'registerRepository',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'repositories',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalStake',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

export function encodeDonateToRepository(repoName: string, amount: string) {
  const contract = new ethers.Contract(contractAddress, ABI, provider)
  const value = ethers.parseEther(amount)
  return {
    to: contractAddress,
    data: contract.interface.encodeFunctionData('donateToRepository', [
      repoName,
    ]),
    value: value,
  }
}

export function encodeAssignStakeToIssue(
  repoName: string,
  issueName: string,
  amount: string
) {
  const contract = new ethers.Contract(contractAddress, ABI, provider)
  return {
    to: contractAddress,
    data: contract.interface.encodeFunctionData('assignStakeToIssue', [
      repoName,
      issueName,
      amount,
    ]),
  }
}

export function encodeDistributeStake(
  repoName: string,
  issueName: string,
  resolvers: string[],
  distributions: string[]
) {
  const contract = new ethers.Contract(contractAddress, ABI, provider)
  return {
    to: contractAddress,
    data: contract.interface.encodeFunctionData('distributeStakeToResolvers', [
      repoName,
      issueName,
      resolvers,
      distributions,
    ]),
  }
}
