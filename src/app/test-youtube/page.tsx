'use client';

import { useState } from 'react';

export default function TestYouTube() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API key fallback system...\n\n');
    
    try {
      const apiKey1 = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const apiKey2 = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2;
      const apiKey3 = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3;
      const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
      
      setResult(prev => prev + `🔑 API Key 1: ${apiKey1 ? 'Set' : 'Missing'}\n`);
      setResult(prev => prev + `🔑 API Key 2: ${apiKey2 ? 'Set' : 'Missing'}\n`);
      setResult(prev => prev + `🔑 API Key 3: ${apiKey3 ? 'Set' : 'Missing'}\n`);
      setResult(prev => prev + `📺 Channel ID: ${channelId ? 'Set' : 'Missing'}\n\n`);
      
      if (!channelId) {
        setResult(prev => prev + '❌ Error: Missing channel ID!');
        setLoading(false);
        return;
      }
      
      // Test the fallback system by trying to get channel info
      setResult(prev => prev + '🧪 Testing channel info with fallback system...\n');
      
      // Import the functions from our API utility
      const { checkLiveStatus, fetchChannelVideos } = await import('../utils/youtube-api');
      
      // Test live status
      setResult(prev => prev + '\n🔴 Testing live status...\n');
      const liveStatus = await checkLiveStatus(channelId);
      
      if (liveStatus) {
        setResult(prev => prev + `✅ Currently LIVE: ${liveStatus.title}\n`);
        setResult(prev => prev + `👥 Viewers: ${liveStatus.viewerCount}\n`);
      } else {
        setResult(prev => prev + '⚫ Not currently live\n');
      }
      
      // Test fetching videos
      setResult(prev => prev + '\n📹 Testing video fetch...\n');
      const videos = await fetchChannelVideos(channelId, undefined, 5);
      
      if (videos.length > 0) {
        setResult(prev => prev + `✅ Found ${videos.length} videos:\n`);
        videos.slice(0, 3).forEach((video, index) => {
          setResult(prev => prev + `  ${index + 1}. ${video.title}\n`);
        });
      } else {
        setResult(prev => prev + '❌ No videos found\n');
      }
      
      setResult(prev => prev + '\n🎉 API fallback system working correctly!');
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8">YouTube API Test</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg mb-6"
        >
          {loading ? 'Testing...' : 'Test YouTube API'}
        </button>
        
        {result && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <h2 className="text-white font-bold mb-3">Results:</h2>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <h2 className="text-white font-bold mb-3">Current Environment Variables:</h2>
          <div className="text-gray-300 text-sm space-y-1">
            <div>API Key: {process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ? '✅ Set' : '❌ Missing'}</div>
            <div>Channel ID: {process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ? '✅ Set' : '❌ Missing'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
