// 

export type WalletAddressRequest = {
  name: string;
  disableAutoSweep: boolean;
  enableGaslessWithdraw: boolean;
  showPrivateKey: boolean;
  metadata: {
    business_id: string;
    user_id: string;
    wallet_type: string;
  };
}

export type CreateWallet = {
  businessId: string
  coinType: CoinType
  coinNetwork: CoinNetwork
}

export type CoinType = 'usdc' | 'usdt'
export type CoinNetwork = 'bep20'

export type BlockradarHook = {
  event: "deposit.success" | "withdraw.success"
  data: {
    id: string
    reference: string
    senderAddress: string,
    amount: string
    amountPaid: string
    blockNumber: number
    blockHash: string
    hash: string
    type: string
  }
}