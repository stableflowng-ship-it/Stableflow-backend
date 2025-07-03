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