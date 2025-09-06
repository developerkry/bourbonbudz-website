'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  PlayIcon, 
  StopIcon, 
  Cog6ToothIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface StreamKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  createdBy: string;
}

interface RTMPConfig {
  serverUrl: string;
  hlsUrl: string;
  port: string | number;
}

export default function RTMPStreamAdmin() {
  const { data: session } = useSession();
  const [streamKeys, setStreamKeys] = useState<StreamKey[]>([]);
  const [rtmpConfig, setRtmpConfig] = useState<RTMPConfig | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  // Check if current user is admin
  const isAdmin = session?.user?.email === 'bourbonbudz@gmail.com' || 
                  session?.user?.email === 'admin@bourbonbudz.com' || 
                  session?.user?.email === 'chet@bourbonbudz.com' ||
                  session?.user?.email === 'john@bourbonbudz.com';

  useEffect(() => {
    if (isAdmin) {
      loadStreamKeys();
    }
  }, [isAdmin]);

  const loadStreamKeys = async () => {
    try {
      const response = await fetch('/api/stream-keys');
      const data = await response.json();
      if (data.success) {
        setStreamKeys(data.streamKeys || []);
        setRtmpConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to load stream keys:', error);
    }
  };

  const createStreamKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the stream key');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stream-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          name: newKeyName.trim(),
          createdBy: session?.user?.email
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewKeyName('');
        loadStreamKeys();
        alert('Stream key created successfully!');
      } else {
        alert('Failed to create stream key: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to create stream key:', error);
      alert('Failed to create stream key');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStreamKey = async (keyId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stream-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle',
          keyId,
          createdBy: session?.user?.email
        }),
      });

      const data = await response.json();
      if (data.success) {
        loadStreamKeys();
      } else {
        alert('Failed to toggle stream key: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to toggle stream key:', error);
      alert('Failed to toggle stream key');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStreamKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this stream key?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/stream-keys?keyId=${keyId}&deletedBy=${encodeURIComponent(session?.user?.email || '')}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        loadStreamKeys();
        alert('Stream key deleted successfully!');
      } else {
        alert('Failed to delete stream key: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to delete stream key:', error);
      alert('Failed to delete stream key');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access RTMP stream management.</p>
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
          <p className="text-gray-400 mb-6">You don't have permission to access RTMP stream management.</p>
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RTMP Stream Management</h1>
          <p className="text-gray-400">Manage direct streaming from OBS to your website</p>
          
          {/* Navigation */}
          <div className="mt-4 flex space-x-4">
            <a
              href="/admin/stream"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Basic Stream Management
            </a>
            <a
              href="/admin/rtmp"
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              RTMP Management
            </a>
            <a
              href="/admin/users"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              User Management
            </a>
          </div>
        </div>

        {/* RTMP Server Configuration */}
        {rtmpConfig && (
          <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Cog6ToothIcon className="w-6 h-6 mr-2" />
              RTMP Server Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  RTMP Server URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={rtmpConfig.serverUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-l-lg text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(rtmpConfig.serverUrl)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-lg transition-colors"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  HLS Playback URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={rtmpConfig.hlsUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-l-lg text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(rtmpConfig.hlsUrl)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-lg transition-colors"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h3 className="font-bold text-red-400 mb-2">⚠️ Important Setup Notes:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• This requires an RTMP server (like nginx-rtmp or Node Media Server)</li>
                <li>• Server must be configured to accept streams and generate HLS output</li>
                <li>• Firewall port {rtmpConfig.port} must be open for RTMP traffic</li>
                <li>• Consider using a CDN for better performance and reliability</li>
              </ul>
            </div>
          </div>
        )}

        {/* Create New Stream Key */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <PlusIcon className="w-6 h-6 mr-2" />
            Create New Stream Key
          </h2>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Stream key name (e.g., 'Main Show', 'After Dark')"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              onClick={createStreamKey}
              disabled={isLoading || !newKeyName.trim()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </div>

        {/* Stream Keys List */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <KeyIcon className="w-6 h-6 mr-2" />
            Stream Keys ({streamKeys.length})
          </h2>
          
          {streamKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No stream keys created yet</p>
              <p className="text-sm mt-2">Create your first stream key to start streaming from OBS</p>
            </div>
          ) : (
            <div className="space-y-4">
              {streamKeys.map((streamKey) => (
                <div
                  key={streamKey.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold">{streamKey.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Created: {new Date(streamKey.createdAt).toLocaleDateString()}</span>
                        {streamKey.lastUsed && (
                          <span>Last used: {new Date(streamKey.lastUsed).toLocaleString()}</span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          streamKey.isActive 
                            ? 'bg-green-900/20 text-green-400 border border-green-500/50' 
                            : 'bg-red-900/20 text-red-400 border border-red-500/50'
                        }`}>
                          {streamKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStreamKey(streamKey.id)}
                        disabled={isLoading}
                        className={`px-3 py-1 rounded-lg font-bold transition-colors text-sm ${
                          streamKey.isActive
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {streamKey.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => deleteStreamKey(streamKey.id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors text-sm"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Stream Key
                      </label>
                      <div className="flex">
                        <input
                          type={showKeys[streamKey.id] ? 'text' : 'password'}
                          value={streamKey.key}
                          readOnly
                          className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-l-lg text-white"
                        />
                        <button
                          onClick={() => toggleShowKey(streamKey.id)}
                          className="px-3 py-2 bg-zinc-600 hover:bg-zinc-500 text-white transition-colors"
                        >
                          {showKeys[streamKey.id] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(streamKey.key)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-lg transition-colors"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full RTMP URL for OBS
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={`${rtmpConfig?.serverUrl}/${streamKey.key}`}
                          readOnly
                          className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-l-lg text-white text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(`${rtmpConfig?.serverUrl}/${streamKey.key}`)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-lg transition-colors"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OBS Setup Instructions */}
        <div className="mt-8 bg-zinc-900 rounded-lg border border-zinc-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">OBS Studio Setup Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-white mb-2">1. Configure Stream Settings</h3>
              <ol className="text-gray-300 text-sm space-y-2">
                <li>1. Open OBS Studio</li>
                <li>2. Go to Settings → Stream</li>
                <li>3. Set Service to "Custom..."</li>
                <li>4. Enter Server: <code className="bg-zinc-700 px-1 rounded">{rtmpConfig?.serverUrl}</code></li>
                <li>5. Enter Stream Key: <code className="bg-zinc-700 px-1 rounded">[Copy from above]</code></li>
                <li>6. Click Apply and OK</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-2">2. Recommended Settings</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Output Mode:</strong> Advanced</li>
                <li>• <strong>Encoder:</strong> x264 or Hardware (NVENC/AMD)</li>
                <li>• <strong>Bitrate:</strong> 2500-6000 kbps</li>
                <li>• <strong>Keyframe Interval:</strong> 2 seconds</li>
                <li>• <strong>Profile:</strong> High</li>
                <li>• <strong>Resolution:</strong> 1920x1080 or 1280x720</li>
                <li>• <strong>FPS:</strong> 30 or 60</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="font-bold text-blue-400 mb-2">💡 Pro Tips:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Test your stream with the "Start Streaming" button in OBS</li>
              <li>• Monitor stream health in OBS (green = good, red = issues)</li>
              <li>• Use a wired internet connection for best stability</li>
              <li>• Consider using multiple stream keys for backup streams</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/admin/stream"
            className="text-red-400 hover:text-red-300 transition-colors mr-6"
          >
            ← Basic Stream Management
          </a>
          <a
            href="/after-dark"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Back to After Dark
          </a>
        </div>
      </div>
    </div>
  );
}
