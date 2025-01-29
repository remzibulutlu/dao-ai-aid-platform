import { create } from 'zustand';
import { ethers } from 'ethers';
import { FAUCET_ABI, FAUCET_ADDRESS } from '../contracts/Faucet';

interface FaucetState {
  balance: number;
  isDonating: boolean;
  donationError: string | null;
  pendingTransactions: Record<string, boolean>;
  donate: (amount: string) => Promise<void>;
  getBalance: () => Promise<void>;
  clearError: () => void;
}

export const useFaucetStore = create<FaucetState>((set, get) => ({
  balance: 0,
  isDonating: false,
  donationError: null,
  pendingTransactions: {},

  donate: async (amount: string) => {
    set({ isDonating: true, donationError: null });

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to donate');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send ETH directly to the faucet address
      const tx = await signer.sendTransaction({
        to: FAUCET_ADDRESS,
        value: ethers.parseEther(amount)
      });

      // Update pending transactions
      const txHash = tx.hash;
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [txHash]: true
        }
      }));

      // Wait for transaction confirmation
      await tx.wait();

      // Remove from pending transactions and update balance
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [txHash]: false
        }
      }));

      // Update the faucet balance
      await get().getBalance();

    } catch (error: any) {
      console.error('Donation error:', error);
      set({ donationError: error.message || 'Failed to donate to faucet' });
    } finally {
      set({ isDonating: false });
    }
  },

  getBalance: async () => {
    try {
      if (!window.ethereum) {
        set({ balance: 0 });
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // First check if we're connected to Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) { // Sepolia chainId
        set({ balance: 0 });
        return;
      }

      // Get the ETH balance of the faucet address
      const balance = await provider.getBalance(FAUCET_ADDRESS);
      set({ balance: Number(ethers.formatEther(balance)) });

    } catch (error) {
      console.error('Error fetching balance:', error);
      set({ balance: 0 });
    }
  },

  clearError: () => set({ donationError: null })
}));