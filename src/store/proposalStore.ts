import { create } from 'zustand';
import { ethers } from 'ethers';
import { PROPOSAL_VOTING_ABI, PROPOSAL_VOTING_ADDRESS } from '../contracts/ProposalVoting';

interface ProposalState {
  votingStates: Record<string, boolean>;
  votingError: string | null;
  pendingTransactions: Record<string, boolean>;
  vote: (proposalId: string) => Promise<void>;
  clearError: () => void;
}

export const useProposalStore = create<ProposalState>((set, get) => ({
  votingStates: {},
  votingError: null,
  pendingTransactions: {},

  vote: async (proposalId: string) => {
    // Set voting state for specific proposal
    set(state => ({
      votingStates: {
        ...state.votingStates,
        [proposalId]: true
      },
      votingError: null
    }));

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to vote');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PROPOSAL_VOTING_ADDRESS,
        PROPOSAL_VOTING_ABI,
        signer
      );

      // Send the transaction
      const tx = await contract.vote(proposalId);
      
      // Update pending transactions
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [proposalId]: true
        }
      }));

      // Wait for transaction confirmation
      await tx.wait();

      // Remove from pending transactions
      set(state => ({
        pendingTransactions: {
          ...state.pendingTransactions,
          [proposalId]: false
        }
      }));

    } catch (error: any) {
      console.error('Voting error:', error);
      set({ votingError: error.message || 'Failed to submit vote' });
    } finally {
      // Clear voting state for specific proposal
      set(state => ({
        votingStates: {
          ...state.votingStates,
          [proposalId]: false
        }
      }));
    }
  },

  clearError: () => set({ votingError: null })
}));