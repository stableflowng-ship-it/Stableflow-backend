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

export interface WebhookPayload {
  event: string;
  data: {
    id: string;
    reference: string;
    senderAddress: string;
    recipientAddress: string;
    amount: string;
    amountPaid: string;
    fee: string | null;
    currency: string;
    blockNumber: number;
    blockHash: string;
    hash: string;
    confirmations: number;
    confirmed: boolean;
    gasPrice: string;
    gasUsed: string;
    gasFee: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
    type: "DEPOSIT" | "WITHDRAWAL";
    note: string | null;
    amlScreening: {
      provider: string;
      status: string;
      message: string;
    };
    assetSwept: string | null;
    assetSweptAt: string | null;
    assetSweptGasFee: string | null;
    assetSweptHash: string | null;
    assetSweptSenderAddress: string | null;
    assetSweptRecipientAddress: string | null;
    assetSweptAmount: string | null;
    reason: string | null;
    network: string;
    chainId: number;
    metadata: {
      user_id: number;
      [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
    asset: {
      id: string;
      name: string;
      symbol: string;
      decimals: number;
      address: string;
      standard: string;
      isActive: boolean;
      logoUrl: string;
      network: string;
      createdAt: string;
      updatedAt: string;
    };
    address: {
      id: string;
      address: string;
      name: string;
      isActive: boolean;
      type: string;
      derivationPath: string;
      metadata: {
        user_id: number;
        [key: string]: any;
      };
      configurations: {
        aml: {
          status: string;
          message: string;
          provider: string;
        };
        showPrivateKey: boolean;
        disableAutoSweep: boolean;
        enableGaslessWithdraw: boolean;
      };
      network: string;
      createdAt: string;
      updatedAt: string;
    };
    blockchain: {
      id: string;
      name: string;
      symbol: string;
      slug: string;
      derivationPath: string;
      isEvmCompatible: boolean;
      logoUrl: string;
      isActive: boolean;
      tokenStandard: string;
      createdAt: string;
      updatedAt: string;
    };
    wallet: {
      id: string;
      name: string;
      description: string;
      address: string;
      derivationPath: string;
      isActive: boolean;
      status: string;
      network: string;
      createdAt: string;
      updatedAt: string;
      business: {
        id: string;
        name: string;
        sector: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    };
    beneficiary: string | null;
  };
}


export interface WithdrawalResponse {
  amlScreening: any | null;
  amount: string;
  amountPaid: string;
  asset: {
    address: string;
    blockchain: {
      createdAt: string;
      derivationPath: string;
      id: string;
      isActive: boolean;
      isEvmCompatible: boolean;
      logoUrl: string;
      name: string;
      slug: string;
      symbol: string;
      tokenStandard: string;
      updatedAt: string;
    };
    createdAt: string;
    decimals: number;
    id: string;
    isActive: boolean;
    logoUrl: string;
    name: string;
    network: string;
    standard: string;
    symbol: string;
    updatedAt: string;
  };
  assetSwept: any | null;
  assetSweptAmount: string | null;
  assetSweptAt: string | null;
  assetSweptGasFee: string | null;
  assetSweptHash: string | null;
  assetSweptRecipientAddress: string | null;
  assetSweptResponse: any | null;
  assetSweptSenderAddress: string | null;
  blockHash: string | null;
  blockNumber: string | null;
  blockchain: {
    createdAt: string;
    derivationPath: string;
    id: string;
    isActive: boolean;
    isEvmCompatible: boolean;
    logoUrl: string;
    name: string;
    slug: string;
    symbol: string;
    tokenStandard: string;
    updatedAt: string;
  };
  chainId: string | null;
  confirmations: number | null;
  confirmed: boolean;
  createdAt: string;
  currency: string;
  fee: string | null;
  feeMetadata: any | null;
  gasFee: string | null;
  gasPrice: string | null;
  gasUsed: string | null;
  hash: string;
  id: string;
  metadata: any | null;
  network: string;
  note: string | null;
  reason: string | null;
  recipientAddress: string;
  senderAddress: string;
  status: string;
  tokenAddress: string | null;
  type: string;
  updatedAt: string;
  wallet: {
    id: string;
  };
}



export type GetRate = {
  token: string
  amount: number
  currency: string
  network: string
}

export type CreateOrder = {
  amount: number,
  token: string,
  network: string
  bankName: string,
  accountNumber: string,
  accountName: string
  returnAddress: string
  rate?: string
  reference: string
}

export type WebhookPaycrest = {

}