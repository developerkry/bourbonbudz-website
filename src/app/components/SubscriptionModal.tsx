'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
}

export default function SubscriptionModal({ isOpen, onClose, selectedTier }: SubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-8 border border-red-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Subscribe to {selectedTier}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Welcome to After Dark!</h4>
            <p className="text-gray-400 mb-6">
              Check your email for login instructions and exclusive content access.
            </p>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
            >
              Start Watching
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-white mb-2">What you get:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Uncensored AFTER DARK streams</li>
                <li>• Exclusive behind-the-scenes content</li>
                <li>• Priority chat access</li>
                <li>• Ad-free viewing experience</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              You must be 18+ to access AFTER DARK content. Cancel anytime.
            </p>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
