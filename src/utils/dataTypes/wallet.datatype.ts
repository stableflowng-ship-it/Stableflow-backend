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

export type WebhookPayload = {
  id?: string;
  event?: string;
  data?: {
    id?: string;
    reference: string
    event?: string;
    event_type?: string;
    eventType?: string;
    recipientAddress?: string;
    senderAddress?: string;
    amount?: string;
    type: string
    asset?: {
      symbol?: string;
      name: string
    };
    address: {
      id: string,
      address: string
      [key: string]: any;
    }
    currency?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export type GetRate = {
  token: string
  amount: number
  currency: string
  network: string
}