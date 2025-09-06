'use client';

import { useState, useEffect } from 'react';
import { checkLiveStatus } from '../utils/youtube-api';

interface LiveStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  viewerCount: string;
  isLive: boolean;
}

export default function LiveStatus() {
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkForLiveStream = async () => {
      try {
        const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

        if (!channelId) {
          console.log('YouTube channel ID not found');
          setIsLoading(false);
          return;
        }

        const stream = await checkLiveStatus(channelId);
        setLiveStream(stream);
      } catch (error) {
        console.error('Error checking live status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkForLiveStream();
    
    // Check every 30 seconds for live status
    const interval = setInterval(checkForLiveStream, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
        <span className="text-gray-400 text-sm">Checking live status...</span>
      </div>
    );
  }

  if (!liveStream) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-gray-400 font-medium">Currently Offline</span>
        </div>
        <p className="text-sm text-gray-500">
          We'll be back soon with more bourbon talk!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center animate-pulse">
      <div className="flex items-center justify-center mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
        <span className="text-red-400 font-bold">LIVE NOW</span>
      </div>
      <p className="text-white font-medium mb-2">{liveStream.title}</p>
      <p className="text-sm text-gray-300 mb-3">
        {parseInt(liveStream.viewerCount).toLocaleString()} viewers watching
      </p>
      <a
        href={`https://www.youtube.com/watch?v=${liveStream.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Watch Live on YouTube
      </a>
    </div>
  );
}
