import React, { useState, useEffect } from 'react';
import { Activity, Users, Vote, AlertTriangle, Loader2, HandCoins, Brain, Gauge, PiggyBank, Check } from 'lucide-react';
import type { AidRequest, Proposal } from '../types';
import { useWalletStore } from '../store/walletStore';
import { useProposalStore } from '../store/proposalStore';
import { useAidStore } from '../store/aidStore';
import { useFaucetStore } from '../store/faucetStore';

const mockAidRequests: AidRequest[] = [
  {
    id: '1',
    location: 'Defne, Hatay',
    urgencyLevel: 10,
    description: 'Emergency medical supplies needed',
    requiredAmount: 5,
    status: 'pending',
    timestamp: Date.now(),
    aiPrediction: {
      confidence: 0.95,
      recommendation: 'Immediate distribution recommended based on AI+ML reporting!',
      riskFactors: ['Natural disaster', 'Limited medical resources']
    }
  },
  {
    id: '2',
    location: 'Pazarcık, Kahramanmaraş',
    urgencyLevel: 8,
    description: 'Food and water supplies for earthquake victims',
    requiredAmount: 7.5,
    status: 'approved',
    timestamp: Date.now() - 86400000,
    aiPrediction: {
      confidence: 0.85,
      recommendation: 'Distribution advised within 24 hours based on AI+ML reporting!',
      riskFactors: ['Infrastructure damage', 'Supply chain disruption']
    }
  },
];

const DAO_MEMBERS_COUNT = 100;
const PROPOSAL_THRESHOLD = Math.ceil(DAO_MEMBERS_COUNT / 2);
const FAUCET_DISTRIBUTION_PERCENTAGE = 0.1;

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Emergency Response Protocol Update',
    description: 'Implement new AI-driven response protocols for natural disasters',
    votes: 45,
    status: 'active',
    deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    requiredAmount: 5
  },
  {
    id: '2',
    title: 'Community Health Initiative',
    description: 'Establish mobile medical units in underserved areas',
    votes: 32,
    status: 'active',
    deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
    requiredAmount: 3
  }
];

const approvedProposals: Proposal[] = [
  {
    id: '3',
    title: 'Disaster Relief Fund',
    description: 'Emergency fund for immediate disaster response',
    votes: 65,
    status: 'passed',
    deadline: Date.now() - 2 * 24 * 60 * 60 * 1000,
    requiredAmount: 10,
    receivedAmount: 2
  }
];

export function Dashboard() {
  const { isConnected } = useWalletStore();
  const { vote, votingStates, votingError, pendingTransactions: votingTransactions, clearError: clearVotingError } = useProposalStore();
  const { distributeAid, isDistributing, distributionError, pendingTransactions: distributionTransactions, clearError: clearDistributionError } = useAidStore();
  const { balance, isDonating, donationError, pendingTransactions: donationTransactions, donate, getBalance, clearError: clearDonationError } = useFaucetStore();
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [proposalDonationAmount, setProposalDonationAmount] = useState<Record<string, string>>({});

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const handleVote = async (proposalId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return;
    }
    await vote(proposalId);
  };

  const handleDistributeAid = async (requestId: string, amount: number) => {
    if (!isConnected) {
      alert('Please connect your wallet to distribute aid');
      return;
    }
    await distributeAid(requestId, amount);
  };

  const handleDonateToFaucet = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to donate');
      return;
    }
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    await donate(donationAmount);
    setDonationAmount('');
  };

  const handleDonateToProposal = async (proposalId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to donate');
      return;
    }
    const amount = proposalDonationAmount[proposalId];
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    await donate(amount);
    setProposalDonationAmount(prev => ({ ...prev, [proposalId]: '' }));
  };

  const getUrgencyColor = (level: number) => {
    if (level >= 9) return 'text-red-500';
    if (level >= 7) return 'text-orange-500';
    return 'text-yellow-500';
  };

  const renderAIBadge = (confidence: number) => (
    <div className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
      <Brain size={12} />
      <span>{(confidence * 100).toFixed(0)}% confidence</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {votingError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{votingError}</span>
          <button onClick={clearVotingError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      {distributionError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{distributionError}</span>
          <button onClick={clearDistributionError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      {donationError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{donationError}</span>
          <button onClick={clearDonationError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Activity className="text-indigo-600" size={24} />
              <div>
                <h3 className="text-sm text-gray-500">Active Requests</h3>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Users className="text-indigo-600" size={24} />
              <div>
                <h3 className="text-sm text-gray-500">DAO Members</h3>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Vote className="text-indigo-600" size={24} />
              <div>
                <h3 className="text-sm text-gray-500">Active Proposals</h3>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <HandCoins className="text-green-600" size={24} />
                <div>
                  <h3 className="text-sm text-gray-500">Available Faucet</h3>
                  <p className="text-2xl font-bold">{balance} ETH</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Amount in ETH"
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                  min="0"
                  step="0.1"
                />
                <button
                  onClick={handleDonateToFaucet}
                  disabled={!isConnected || isDonating}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isDonating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Donating...
                    </>
                  ) : (
                    <>
                      <PiggyBank size={16} />
                      Donate to Faucet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Active Proposals</h2>
            <div className="space-y-4">
              {mockProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
                >
                  <h3 className="font-semibold">{proposal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Required Amount: {proposal.requiredAmount} ETH</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {proposal.votes} votes
                      </span>
                      {proposal.votes >= PROPOSAL_THRESHOLD && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                          <Check size={12} />
                          Threshold Reached
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleVote(proposal.id)}
                      disabled={votingStates[proposal.id] || votingTransactions[proposal.id] || !isConnected}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {votingTransactions[proposal.id] ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Confirming...
                        </>
                      ) : votingStates[proposal.id] ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Voting...
                        </>
                      ) : (
                        <>
                          <Vote size={16} />
                          Vote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Approved Proposals</h2>
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
                <Vote size={16} className="text-indigo-600" />
                <span className="text-sm text-indigo-700">
                  Proposals with 50%+1 votes (50% of DAO)
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg">
              These proposals have received majority support (over 50%) from all of our DAO members. Each approved proposal is eligible to receive {FAUCET_DISTRIBUTION_PERCENTAGE * 100}% of the faucet funds initially, and can receive additional individual donations.
            </p>
            <div className="space-y-4">
              {approvedProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 hover:border-green-500 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    {proposal.title}
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <Check size={12} />
                      Approved
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Required: {proposal.requiredAmount} ETH</span>
                      <span>Received: {proposal.receivedAmount} ETH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((proposal.receivedAmount || 0) / (proposal.requiredAmount || 1)) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      value={proposalDonationAmount[proposal.id] || ''}
                      onChange={(e) =>
                        setProposalDonationAmount(prev => ({
                          ...prev,
                          [proposal.id]: e.target.value
                        }))
                      }
                      placeholder="Amount in ETH"
                      className="flex-1 px-3 py-2 text-sm border rounded-lg"
                      min="0"
                      step="0.1"
                    />
                    <button
                      onClick={() => handleDonateToProposal(proposal.id)}
                      disabled={!isConnected || isDonating}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDonating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Donating...
                        </>
                      ) : (
                        <>
                          <HandCoins size={16} />
                          Donate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Priority Aid Requests</h2>
            <div className="space-y-4">
              {mockAidRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-4 hover:border-indigo-500 transition-colors ${
                    request.urgencyLevel >= 10 ? 'bg-red-50' : request.urgencyLevel >= 8 ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.location}</h3>
                      <p className="text-sm text-gray-600">{request.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {renderAIBadge(request.aiPrediction.confidence)}
                        <span className="text-xs text-gray-500">{request.aiPrediction.recommendation}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Gauge size={16} className={getUrgencyColor(request.urgencyLevel)} />
                        <span className={`text-sm font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                          Level {request.urgencyLevel}
                        </span>
                      </div>
                      {request.urgencyLevel >= 8 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Auto-distribution eligible
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.aiPrediction.riskFactors.map((factor, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Required: {request.requiredAmount} ETH
                    </span>
                    <button
                      onClick={() => handleDistributeAid(request.id, request.requiredAmount)}
                      disabled={isDistributing || distributionTransactions[request.id] || !isConnected}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        request.urgencyLevel >= 10 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : request.urgencyLevel >= 8 
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {distributionTransactions[request.id] ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Confirming...
                        </>
                      ) : isDistributing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <HandCoins size={16} />
                          {request.urgencyLevel >= 10 ? 'Auto-Distribute Now' : 'Distribute Aid'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}