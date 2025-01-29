export interface AidRequest {
  id: string;
  location: string;
  urgencyLevel: number;
  description: string;
  requiredAmount: number;
  status: 'pending' | 'approved' | 'distributed';
  timestamp: number;
  aiPrediction: {
    confidence: number;
    recommendation: string;
    riskFactors: string[];
  };
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'active' | 'passed' | 'rejected';
  deadline: number;
  requiredAmount?: number; // Amount requested from faucet
  receivedAmount?: number; // Amount already received from individual donations
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface AidDistributionContract {
  distributeAid: (requestId: string, amount: ethers.BigNumber) => Promise<void>;
  getAidRequest: (requestId: string) => Promise<{
    location: string;
    requiredAmount: ethers.BigNumber;
    distributedAmount: ethers.BigNumber;
    isActive: boolean;
  }>;
}