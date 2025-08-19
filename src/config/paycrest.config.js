// 

// Using viem to send tokens
import { createPublicClient, createWalletClient, http, getContract, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { envHelper } from './env.helper';

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org')
});

const account = privateKeyToAccount(`0x${envHelper.paycrest.api_key}`); // are we using the api key for paycrest here?
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http('https://mainnet.base.org')
});

// USDT contract on Base
const usdtContract = getContract({
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // USDT on Base
  abi: [{
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
  }],
  publicClient,
  walletClient
});

// Send tokens to the receive address
const { request } = await usdtContract.simulate.transfer({
  args: [order.receiveAddress, parseUnits(order.amount, 6)] // USDT has 6 decimals
});

const hash = await walletClient.writeContract(request);
console.log('Transaction hash:', hash);