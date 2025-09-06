'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { checkLiveStatus } from '../utils/youtube-api';

interface LiveStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  viewerCount: string;
  isLive: boolean;
}

export default function LiveStreamPlayer() {
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkForLiveStream = async () => {
      try {
        // Temporarily disable YouTube API calls due to quota limits
        console.log('YouTube API temporarily disabled due to quota limits');
        setIsLoading(false);
        return;

        /* Uncomment when API quota is reset
        const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

        if (!channelId) {
          console.log('YouTube channel ID not found');
          setIsLoading(false);
          return;
        }

        const stream = await checkLiveStatus(channelId);
        setLiveStream(stream);
        */
      } catch (error) {
        console.error('Error checking live status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkForLiveStream();
    
    // Temporarily disable interval checks
    // const interval = setInterval(checkForLiveStream, 30000);
    // return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setLiveStream(null);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // This would control the iframe audio if possible
    // YouTube iframe API has limited audio control from external domains
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!liveStream) {
    return null; // Don't show anything if not live
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <div className="bg-black rounded-lg shadow-2xl border-2 border-red-500 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-2 animate-pulse"></div>
            <span className="text-white font-bold text-sm">LIVE</span>
            <span className="text-red-100 text-xs ml-2">
              {parseInt(liveStream.viewerCount).toLocaleString()} viewers
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-red-200 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="w-4 h-4" />
              ) : (
                <SpeakerWaveIcon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={toggleMinimize}
              className="text-white hover:text-red-200 transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? "□" : "−"}
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-red-200 transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        {!isMinimized && (
          <div className="relative">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                title={liveStream.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            {/* Stream Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                {liveStream.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">Bourbon Budz</span>
                <a
                  href={`https://www.youtube.com/watch?v=${liveStream.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                >
                  Open in YouTube
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {liveStream.title}
                </p>
                <p className="text-gray-400 text-xs">
                  {parseInt(liveStream.viewerCount).toLocaleString()} watching
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
