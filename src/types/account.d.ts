// account.d.ts

type BalanceType = {
  [currency in StableType]: number;
}

interface UserDeposits {
  beforeCompound: number;
  afterCompound: number;
}