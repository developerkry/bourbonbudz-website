'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, StopIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface StreamStatus {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description?: string;
  startTime?: string;
  viewerCount?: number;
}

export default function StreamAdmin() {
  const { data: session } = useSession();
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you'd check if the user is an admin
  const isAdmin = session?.user?.email === 'bourbonbudz@gmail.com' || 
                  session?.user?.email === 'admin@bourbonbudz.com' || 
                  session?.user?.email === 'chet@bourbonbudz.com' ||
                  session?.user?.email === 'john@bourbonbudz.com';

  useEffect(() => {
    loadStreamStatus();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadStreamStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStreamStatus = async () => {
    try {
      const response = await fetch('/api/stream?streamId=after-dark');
      const data = await response.json();
      if (data.success) {
        setStreamStatus(data.stream);
        setStreamUrl(data.stream.streamUrl || '');
        setStreamTitle(data.stream.title || '');
        setStreamDescription(data.stream.description || '');
      }
    } catch (error) {
      console.error('Failed to load stream status:', error);
    }
  };

  const startStream = async () => {
    if (!streamUrl.trim()) {
      alert('Please enter a stream URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          streamUrl: streamUrl.trim(),
          title: streamTitle.trim() || 'AFTER DARK: Live Stream',
          description: streamDescription.trim()
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStreamStatus(data.stream);
        alert('Stream started successfully!');
      } else {
        alert('Failed to start stream: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to start stream:', error);
      alert('Failed to start stream');
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    if (!confirm('Are you sure you want to stop the stream?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'stop'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStreamStatus(data.stream);
        alert('Stream stopped successfully!');
      } else {
        alert('Failed to stop stream: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to stop stream:', error);
      alert('Failed to stop stream');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStream = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          streamUrl: streamUrl.trim(),
          title: streamTitle.trim(),
          description: streamDescription.trim()
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStreamStatus(data.stream);
        alert('Stream updated successfully!');
      } else {
        alert('Failed to update stream: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to update stream:', error);
      alert('Failed to update stream');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access the stream admin panel.</p>
          <a
            href="/auth/signin"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <a
            href="/after-dark"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Back to After Dark
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Stream Admin Panel</h1>
          <p className="text-gray-400">Manage the AFTER DARK live stream</p>
          
          {/* Admin Navigation */}
          <div className="mt-4 flex space-x-4">
            <a
              href="/admin/stream"
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Stream Management
            </a>
            <a
              href="/admin/users"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              User Management
            </a>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Current Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                streamStatus?.isLive ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="font-bold text-white">
                {streamStatus?.isLive ? 'LIVE' : 'OFFLINE'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Viewers</p>
              <p className="font-bold text-white">{streamStatus?.viewerCount || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Stream URL</p>
              <p className="font-bold text-white text-xs truncate">
                {streamStatus?.streamUrl ? 'Set' : 'Not Set'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Start Time</p>
              <p className="font-bold text-white text-xs">
                {streamStatus?.startTime ? 
                  new Date(streamStatus.startTime).toLocaleTimeString() : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stream Configuration */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Cog6ToothIcon className="w-6 h-6 mr-2" />
            Stream Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Stream URL (RTMP, HLS, or direct video URL)
              </label>
              <input
                type="url"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://stream.example.com/live/stream-key"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter your OBS stream URL, YouTube live stream URL, or any video stream URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Stream Title
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="AFTER DARK: Live Stream"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Stream Description (Optional)
              </label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Tonight's topic: Rare bourbon finds and unfiltered opinions..."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Stream Controls */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Stream Controls</h2>
          
          <div className="flex flex-wrap gap-4">
            {!streamStatus?.isLive ? (
              <button
                onClick={startStream}
                disabled={isLoading || !streamUrl.trim()}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Starting...' : 'Start Stream'}
              </button>
            ) : (
              <button
                onClick={stopStream}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                <StopIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Stopping...' : 'Stop Stream'}
              </button>
            )}

            <button
              onClick={updateStream}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Updating...' : 'Update Settings'}
            </button>

            <button
              onClick={loadStreamStatus}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-lg transition-colors"
            >
              Refresh Status
            </button>
          </div>

          <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
            <h3 className="font-bold text-white mb-2">Quick Setup Guide:</h3>
            <ol className="text-sm text-gray-300 space-y-1">
              <li>1. Set up your streaming software (OBS, Streamlabs, etc.)</li>
              <li>2. Get your stream URL/key from your streaming platform</li>
              <li>3. Enter the stream URL above</li>
              <li>4. Set your title and description</li>
              <li>5. Click "Start Stream" to go live</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/after-dark"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            ← Back to After Dark
          </a>
        </div>
      </div>
    </div>
  );
}
