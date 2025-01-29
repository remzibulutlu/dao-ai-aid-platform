import { create } from 'zustand';
import { ethers } from 'ethers';
import type { WalletState } from '../types';

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {
    // Prevent multiple connection attempts
    if (get().isConnecting || get().isConnected) {
      return;
    }

    try {
      set({ isConnecting: true });
      
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request connection to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        }).catch(async (error: any) => {
          if (error.code === 4902) {
            // If Sepolia is not added, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } else {
            throw error;
          }
        });

        const accounts = await provider.send('eth_requestAccounts', []);
        set({ address: accounts[0], isConnected: true });
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error: any) {
      // Handle user rejected request
      if (error?.code === 4001) {
        alert('Please connect your wallet to continue');
      } 
      // Handle already processing
      else if (error?.error?.code === -32002) {
        alert('Wallet connection in progress. Please check your MetaMask window');
      }
      // Handle other errors
      else {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again');
      }
    } finally {
      set({ isConnecting: false });
    }
  },
  disconnect: () => {
    set({ address: null, isConnected: false, isConnecting: false });
  },
}));