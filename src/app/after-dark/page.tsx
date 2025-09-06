'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, LockClosedIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FireIcon, EyeSlashIcon, ClockIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SubscriptionModal from '../components/SubscriptionModal';
import LiveChat from '../components/LiveChat';
import StreamPlayer from '../components/StreamPlayer';
import LiveViewers from '../components/LiveViewers';

interface StreamStatus {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description?: string;
  startTime?: string;
  viewerCount?: number;
}

const subscriptionTiers = [
  {
    name: "AFTER DARK Access",
    price: "$9.99",
    period: "month",
    features: [
      "Unlimited access to AFTER DARK streams",
      "No content restrictions or censorship",
      "Exclusive behind-the-scenes content",
      "Priority chat access during live streams",
      "Ad-free viewing experience",
      "Early access to new episodes"
    ],
    popular: false
  },
  {
    name: "VIP AFTER DARK",
    price: "$19.99",
    period: "month",
    features: [
      "Everything in AFTER DARK Access",
      "Monthly exclusive bourbon tasting kit",
      "Private Discord access with hosts",
      "Quarterly virtual meet & greet",
      "Vote on upcoming episode topics",
      "Exclusive VIP merchandise",
      "Priority customer support"
    ],
    popular: true
  },
  {
    name: "BOURBON BARON",
    price: "$49.99",
    period: "month",
    features: [
      "Everything in VIP AFTER DARK",
      "Monthly premium bourbon sample box",
      "One-on-one virtual tasting session",
      "Access to private bourbon collection tours",
      "Personalized bourbon recommendations",
      "Invitation to annual Bourbon Budz meetup",
      "Co-host opportunity on select episodes"
    ],
    popular: false
  }
];

export default function AfterDark() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(true);

  // For demo purposes, check if user is logged in
  const hasAccess = session?.user;

  // Load stream status
  useEffect(() => {
    loadStreamStatus();
    // Poll for stream status updates every 10 seconds
    const interval = setInterval(loadStreamStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStreamStatus = async () => {
    try {
      const response = await fetch('/api/stream?streamId=after-dark');
      const data = await response.json();
      if (data.success) {
        setStreamStatus(data.stream);
      }
    } catch (error) {
      console.error('Failed to load stream status:', error);
    } finally {
      setIsLoadingStream(false);
    }
  };

  const handleStreamEnd = () => {
    // Reload stream status when stream ends
    loadStreamStatus();
  };

  const handleSubscribe = (tierName: string) => {
    setSelectedTier(tierName);
    setShowSubscriptionModal(true);
  };

  return (
    <div className="bg-gradient-to-b from-black via-red-950/20 to-black min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-black/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <FireIcon className="w-12 h-12 text-red-500 mr-4 animate-pulse" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                AFTER DARK
              </h1>
              <FireIcon className="w-12 h-12 text-red-500 ml-4 animate-pulse" />
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              No limits. No censorship. No holds barred. Dive into the uncensored world of bourbon 
              with Chet & John where anything goes and everything's on the table.
            </p>
            <div className="flex items-center justify-center space-x-6 text-red-400">
              <div className="flex items-center">
                <EyeSlashIcon className="w-6 h-6 mr-2" />
                <span className="font-bold">18+ ONLY</span>
              </div>
              <div className="flex items-center">
                <LockClosedIcon className="w-6 h-6 mr-2" />
                <span className="font-bold">SUBSCRIBERS ONLY</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-6 h-6 mr-2" />
                <span className="font-bold">
                  {streamStatus?.isLive ? (
                    <>🔴 LIVE NOW</>
                  ) : (
                    'LIVE THURSDAYS 9PM EST'
                  )}
                </span>
              </div>
              {streamStatus?.viewerCount !== undefined && streamStatus.viewerCount > 0 && (
                <div className="flex items-center">
                  <span className="font-bold">{streamStatus.viewerCount} WATCHING</span>
                </div>
              )}
            </div>
            
            {/* Live Viewers Indicator */}
            {hasAccess && (
              <div className="mt-6 flex justify-center">
                <LiveViewers 
                  streamId="after-dark" 
                  isStreamLive={streamStatus?.isLive || false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Stream Section */}
      {hasAccess ? (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stream */}
            <div className="lg:col-span-2">
              {isLoadingStream ? (
                <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center border-2 border-red-500/30">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-white">Loading stream status...</p>
                  </div>
                </div>
              ) : (
                <StreamPlayer
                  streamUrl={streamStatus?.streamUrl}
                  isLive={streamStatus?.isLive || false}
                  title={streamStatus?.title || 'AFTER DARK: Uncensored Bourbon Talk'}
                  onStreamEnd={handleStreamEnd}
                />
              )}

              {/* Stream Info */}
              {streamStatus && (
                <div className="mt-6 bg-zinc-900 rounded-lg p-6 border border-zinc-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{streamStatus.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {streamStatus.isLive && streamStatus.startTime && (
                        <span>
                          Started: {new Date(streamStatus.startTime).toLocaleTimeString()}
                        </span>
                      )}
                      {!streamStatus.isLive && (
                        <span>Next stream: Thursday 9PM EST</span>
                      )}
                    </div>
                  </div>
                  {streamStatus.description && (
                    <p className="text-gray-300">{streamStatus.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Live Chat */}
            <div className="lg:col-span-1">
              <LiveChat streamId="after-dark" />
              
              {/* Chat-only message when stream is offline */}
              {!streamStatus?.isLive && !isLoadingStream && (
                <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-bold mb-2">Stream Offline</h4>
                  <p className="text-gray-300 text-sm">
                    We're not live right now, but feel free to chat with other Bourbon Budz! 
                    We'll be back Thursday at 9PM EST.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Authentication Required Section */
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <LockClosedIcon className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Premium Content Awaits</h2>
            <p className="text-gray-400 text-lg mb-8">
              Sign in to access uncensored bourbon discussions, exclusive content, and live chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Sign In to Watch
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tiers */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Experience</h2>
          <p className="text-gray-400 text-lg">
            Select the subscription tier that's right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border-2 p-8 ${
                tier.popular
                  ? 'border-red-500 bg-gradient-to-b from-red-900/30 to-black'
                  : 'border-zinc-700 bg-zinc-900'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-red-500 mb-1">
                  {tier.price}
                  <span className="text-lg text-gray-400">/{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.name)}
                className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
                  tier.popular
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes AFTER DARK Special */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why AFTER DARK?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <EyeSlashIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Uncensored</h3>
            <p className="text-gray-400">
              No corporate filters. Raw, honest discussions about bourbon, life, and everything in between.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FireIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exclusive</h3>
            <p className="text-gray-400">
              Content you won't find anywhere else. Behind-the-scenes access and premium experiences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Live Interactive</h3>
            <p className="text-gray-400">
              Real-time chat, Q&A sessions, and direct interaction with Chet & John during streams.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Perks</h3>
            <p className="text-gray-400">
              Bourbon samples, exclusive merchandise, and VIP access to events and tastings.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-900/50 to-black py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Go AFTER DARK?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of bourbon enthusiasts in our exclusive uncensored community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleSubscribe('AFTER DARK Access')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Start Your Subscription
            </button>
            <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
              Watch Preview
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Cancel anytime. No long-term commitments. 18+ only.
          </p>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        selectedTier={selectedTier}
      />
    </div>
  );
}
