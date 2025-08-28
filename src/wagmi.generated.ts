import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DSF
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const dsfAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_tokens', internalType: 'address[3]', type: 'address[3]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'pid', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'strategyAddr',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AddedPool',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'AutoCompoundAll' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimedAllManagementFee',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'depositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
    ],
    name: 'CreatedPendingDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'withdrawer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'lpShares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenAmounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
    ],
    name: 'CreatedPendingWithdrawal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'depositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
      {
        name: 'lpShares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'depositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
      {
        name: 'lpShares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FailedDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'withdrawer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
      {
        name: 'lpShares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FailedWithdrawal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'pid', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SetDefaultDepositPid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'pid', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SetDefaultWithdrawPid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'withdrawer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawalType',
        internalType: 'enum IStrategy.WithdrawalType',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'tokenAmounts',
        internalType: 'uint256[3]',
        type: 'uint256[3]',
        indexed: false,
      },
      {
        name: 'lpShares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenIndex',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'Withdrawn',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALL_WITHDRAWAL_TYPES_MASK',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FUNDS_DENOMINATOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LP_RATIO_MULTIPLIER',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_LOCK_TIME',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'OPERATOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'POOL_ASSETS',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_strategyAddr', internalType: 'address', type: 'address' },
    ],
    name: 'addPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'autoCompoundAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'availableWithdrawalTypes',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'calcManagementFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAmounts', internalType: 'uint256[3]', type: 'uint256[3]' },
      { name: 'isDeposit', internalType: 'bool', type: 'bool' },
    ],
    name: 'calcSharesAmount',
    outputs: [{ name: 'lpShares', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'lpShares', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenIndex', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'calcWithdrawOneCoin',
    outputs: [
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimAllManagementFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'userList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'completeFeesOptimizationDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'userList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'completeFeesOptimizationWithdrawals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'userList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'completeFeesOptimizationWithdrawalsMk2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'decimalsMultipliers',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultDepositPid',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultWithdrawPid',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amounts', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amounts', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    name: 'feesOptimizationDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'lpShares', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAmounts', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    name: 'feesOptimizationWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'launch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'launched',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lpPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'managementFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_strategies', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'withdrawalsPercents',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: '_receiverStrategyId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'moveFundsBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'pendingDeposits',
    outputs: [{ name: '', internalType: 'uint256[3]', type: 'uint256[3]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'tokenIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'pendingDepositsToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'pendingWithdrawals',
    outputs: [
      {
        name: '',
        internalType: 'struct DSF.PendingWithdrawal',
        type: 'tuple',
        components: [
          { name: 'lpShares', internalType: 'uint256', type: 'uint256' },
          {
            name: 'tokenAmounts',
            internalType: 'uint256[3]',
            type: 'uint256[3]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'pid', internalType: 'uint256', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct DSF.PoolInfo',
        type: 'tuple',
        components: [
          {
            name: 'strategy',
            internalType: 'contract IStrategy',
            type: 'address',
          },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'lpShares', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removePendingDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removePendingWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newAvailableWithdrawalTypes',
        internalType: 'uint8',
        type: 'uint8',
      },
    ],
    name: 'setAvailableWithdrawalTypes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newPoolId', internalType: 'uint256', type: 'uint256' }],
    name: 'setDefaultDepositPid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newPoolId', internalType: 'uint256', type: 'uint256' }],
    name: 'setDefaultWithdrawPid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newManagementFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setManagementFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokens',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDeposited',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalHoldings',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newOperator', internalType: 'address', type: 'address' },
    ],
    name: 'updateOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'lpShares', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAmounts', internalType: 'uint256[3]', type: 'uint256[3]' },
      {
        name: 'withdrawalType',
        internalType: 'enum IStrategy.WithdrawalType',
        type: 'uint8',
      },
      { name: 'tokenIndex', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_token',
        internalType: 'contract IERC20Metadata',
        type: 'address',
      },
    ],
    name: 'withdrawStuckToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const dsfAddress = {
  1: '0x22586ea4fDaA9Ef012581109B336f0124530Ae69',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const dsfConfig = { address: dsfAddress, abi: dsfAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsf = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"ALL_WITHDRAWAL_TYPES_MASK"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfAllWithdrawalTypesMask =
  /*#__PURE__*/ createUseReadContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'ALL_WITHDRAWAL_TYPES_MASK',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"FEE_DENOMINATOR"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfFeeDenominator = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'FEE_DENOMINATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"FUNDS_DENOMINATOR"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfFundsDenominator = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'FUNDS_DENOMINATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"LP_RATIO_MULTIPLIER"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfLpRatioMultiplier = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'LP_RATIO_MULTIPLIER',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"MIN_LOCK_TIME"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfMinLockTime = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'MIN_LOCK_TIME',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"OPERATOR_ROLE"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfOperatorRole = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'OPERATOR_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"POOL_ASSETS"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPoolAssets = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'POOL_ASSETS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfAllowance = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"availableWithdrawalTypes"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfAvailableWithdrawalTypes =
  /*#__PURE__*/ createUseReadContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'availableWithdrawalTypes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"calcManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfCalcManagementFee = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'calcManagementFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"calcSharesAmount"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfCalcSharesAmount = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'calcSharesAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"calcWithdrawOneCoin"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfCalcWithdrawOneCoin =
  /*#__PURE__*/ createUseReadContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'calcWithdrawOneCoin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfDecimals = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"decimalsMultipliers"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfDecimalsMultipliers =
  /*#__PURE__*/ createUseReadContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'decimalsMultipliers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"defaultDepositPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfDefaultDepositPid = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'defaultDepositPid',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"defaultWithdrawPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfDefaultWithdrawPid = /*#__PURE__*/ createUseReadContract(
  { abi: dsfAbi, address: dsfAddress, functionName: 'defaultWithdrawPid' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"hasRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfHasRole = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"launched"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfLaunched = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'launched',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"lpPrice"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfLpPrice = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'lpPrice',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"managementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfManagementFee = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'managementFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfName = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"paused"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPaused = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"pendingDeposits"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPendingDeposits = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'pendingDeposits',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"pendingDepositsToken"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPendingDepositsToken =
  /*#__PURE__*/ createUseReadContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'pendingDepositsToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"pendingWithdrawals"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPendingWithdrawals = /*#__PURE__*/ createUseReadContract(
  { abi: dsfAbi, address: dsfAddress, functionName: 'pendingWithdrawals' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"poolCount"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPoolCount = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'poolCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"poolInfo"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfPoolInfo = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'poolInfo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfSymbol = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"tokens"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfTokens = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'tokens',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"totalDeposited"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfTotalDeposited = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'totalDeposited',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"totalHoldings"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfTotalHoldings = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'totalHoldings',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useReadDsfTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsf = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"addPool"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfAddPool = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'addPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfApprove = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"autoCompoundAll"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfAutoCompoundAll = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'autoCompoundAll',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"claimAllManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfClaimAllManagementFee =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'claimAllManagementFee',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationDeposits"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfCompleteFeesOptimizationDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationWithdrawals"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfCompleteFeesOptimizationWithdrawals =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationWithdrawals',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationWithdrawalsMk2"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfCompleteFeesOptimizationWithdrawalsMk2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationWithdrawalsMk2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"feesOptimizationDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfFeesOptimizationDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'feesOptimizationDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"feesOptimizationWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfFeesOptimizationWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'feesOptimizationWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"launch"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfLaunch = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'launch',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"moveFundsBatch"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfMoveFundsBatch = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'moveFundsBatch',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfPause = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"removePendingDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfRemovePendingDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'removePendingDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"removePendingWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfRemovePendingWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'removePendingWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setAvailableWithdrawalTypes"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfSetAvailableWithdrawalTypes =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setAvailableWithdrawalTypes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setDefaultDepositPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfSetDefaultDepositPid =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setDefaultDepositPid',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setDefaultWithdrawPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfSetDefaultWithdrawPid =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setDefaultWithdrawPid',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfSetManagementFee = /*#__PURE__*/ createUseWriteContract(
  { abi: dsfAbi, address: dsfAddress, functionName: 'setManagementFee' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"updateOperator"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfUpdateOperator = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'updateOperator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"withdraw"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"withdrawStuckToken"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWriteDsfWithdrawStuckToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'withdrawStuckToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsf = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"addPool"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfAddPool = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'addPool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"autoCompoundAll"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfAutoCompoundAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'autoCompoundAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"claimAllManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfClaimAllManagementFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'claimAllManagementFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationDeposits"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfCompleteFeesOptimizationDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationWithdrawals"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfCompleteFeesOptimizationWithdrawals =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationWithdrawals',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"completeFeesOptimizationWithdrawalsMk2"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfCompleteFeesOptimizationWithdrawalsMk2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'completeFeesOptimizationWithdrawalsMk2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"feesOptimizationDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfFeesOptimizationDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'feesOptimizationDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"feesOptimizationWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfFeesOptimizationWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'feesOptimizationWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfGrantRole = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"launch"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfLaunch = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'launch',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"moveFundsBatch"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfMoveFundsBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'moveFundsBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfPause = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"removePendingDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfRemovePendingDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'removePendingDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"removePendingWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfRemovePendingWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'removePendingWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfRevokeRole = /*#__PURE__*/ createUseSimulateContract(
  { abi: dsfAbi, address: dsfAddress, functionName: 'revokeRole' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setAvailableWithdrawalTypes"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfSetAvailableWithdrawalTypes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setAvailableWithdrawalTypes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setDefaultDepositPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfSetDefaultDepositPid =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setDefaultDepositPid',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setDefaultWithdrawPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfSetDefaultWithdrawPid =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setDefaultWithdrawPid',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"setManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfSetManagementFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'setManagementFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"updateOperator"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfUpdateOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'updateOperator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"withdraw"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: dsfAbi,
  address: dsfAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dsfAbi}__ and `functionName` set to `"withdrawStuckToken"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useSimulateDsfWithdrawStuckToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dsfAbi,
    address: dsfAddress,
    functionName: 'withdrawStuckToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: dsfAbi,
  address: dsfAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"AddedPool"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfAddedPoolEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'AddedPool',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"AutoCompoundAll"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfAutoCompoundAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'AutoCompoundAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"ClaimedAllManagementFee"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfClaimedAllManagementFeeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'ClaimedAllManagementFee',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"CreatedPendingDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfCreatedPendingDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'CreatedPendingDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"CreatedPendingWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfCreatedPendingWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'CreatedPendingWithdrawal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Deposited"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"FailedDeposit"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfFailedDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'FailedDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"FailedWithdrawal"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfFailedWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'FailedWithdrawal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Paused"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfPausedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: dsfAbi, address: dsfAddress, eventName: 'Paused' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"SetDefaultDepositPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfSetDefaultDepositPidEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'SetDefaultDepositPid',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"SetDefaultWithdrawPid"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfSetDefaultWithdrawPidEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'SetDefaultWithdrawPid',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Unpaused"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dsfAbi}__ and `eventName` set to `"Withdrawn"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x22586ea4fDaA9Ef012581109B336f0124530Ae69)
 */
export const useWatchDsfWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dsfAbi,
    address: dsfAddress,
    eventName: 'Withdrawn',
  })
