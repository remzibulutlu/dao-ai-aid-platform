import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWalletStore();

  return (
    <header className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aid Distribution Platform</h1>
        <div>
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Wallet size={16} />
              )}
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}