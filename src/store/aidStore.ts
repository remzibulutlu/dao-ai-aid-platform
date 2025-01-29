import { create } from 'zustand';
import { ethers } from 'ethers';
import { AID_DISTRIBUTION_ABI, AID_DISTRIBUTION_ADDRESS } from '../contracts/AidDistribution';

interface AidState {
  isDistributing: boolean;
  distributionError: string | null;
  pendingTransactions: Record<string, boolean>;
  distributeAid: (requestId: string, amount: number) => Promise<void>;
  clearError: () => void;
}

export const useAidStore = create<AidState>((set, get) => ({
  isDistributing: false,
  distributionError: null,
  pendingTransactions: {},

  distributeAid: async (requestId: string, amount: number) => {
    set({ isDistributing: true, distributionError: null });

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to distribute aid');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        AID_DISTRIBUTION_ADDRESS,
        AID_DISTRIBUTION_ABI,
        signer
      );

      // Convert amount to Wei (assuming amount is in ETH)
      const amountInWei = ethers.parseEther(amount.toString());

      // Send the transaction
      const tx = await contract.distributeAid(requestId, amountInWei, {
        value: amountInWei
      });
      
      // Update pending transactions
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [requestId]: true
        }
      }));

      // Wait for transaction confirmation
      await tx.wait();

      // Remove from pending transactions
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [requestId]: false
        }
      }));

    } catch (error: any) {
      console.error('Distribution error:', error);
      set({ distributionError: error.message || 'Failed to distribute aid' });
    } finally {
      set({ isDistributing: false });
    }
  },

  clearError: () => set({ distributionError: null })
}));