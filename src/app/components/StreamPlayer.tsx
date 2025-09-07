'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import Hls from 'hls.js';

interface StreamPlayerProps {
  streamUrl?: string;
  isLive: boolean;
  title: string;
  onStreamEnd?: () => void;
}

export default function StreamPlayer({ 
  streamUrl, 
  isLive, 
  title,
  onStreamEnd 
}: StreamPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS when streamUrl changes
  useEffect(() => {
    if (!videoRef.current || !streamUrl) {
      return;
    }

    setIsLoading(true);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;

    // Check if the stream URL is an HLS stream (.m3u8)
    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        // Use HLS.js for modern browsers
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          liveSyncDurationCount: 1,
          liveMaxLatencyDurationCount: 3,
        });

        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, attempting to play');
          setIsLoading(false);
          video.play().catch(console.error);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          setIsLoading(false);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Fatal error, destroying HLS instance');
                hls.destroy();
                break;
            }
          }
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Fragment loaded successfully
          if (video.paused) {
            video.play().catch(console.error);
          }
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().catch(console.error);
        });
      } else {
        console.error('HLS is not supported in this browser');
        setIsLoading(false);
      }
    } else {
      // Direct video stream (MP4, WebM, etc.)
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(console.error);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  // Hide controls after 3 seconds of inactivity
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isFullscreen]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleVideoError = () => {
    console.error('Stream error occurred');
    setIsPlaying(false);
    if (onStreamEnd) {
      onStreamEnd();
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (onStreamEnd) {
      onStreamEnd();
    }
  };

  // If no stream URL is provided, show offline message
  if (!streamUrl || !isLive) {
    return (
      <div 
        ref={containerRef}
        className={`${isMinimized ? 'aspect-video w-80' : 'aspect-video'} bg-gradient-to-br from-zinc-900 to-black rounded-lg flex flex-col items-center justify-center relative border-2 border-red-500/30`}
        onMouseMove={resetControlsTimeout}
      >
        {/* Offline State */}
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlayIcon className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Stream Offline</h3>
          <p className="text-gray-400 mb-4">
            We're not currently live, but you can still chat with other Bourbon Budz!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Next stream: Thursday 9PM EST</span>
          </div>
        </div>

        {/* Offline Status Badge */}
        <div className="absolute top-4 left-4 bg-zinc-800 text-gray-400 px-3 py-1 rounded-full text-sm font-bold flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
          OFFLINE
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${isMinimized ? 'aspect-video w-80' : 'aspect-video'} bg-black rounded-lg relative overflow-hidden border-2 border-red-500`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={streamUrl}
        onError={handleVideoError}
        onEnded={handleVideoEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
        playsInline
      />

      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
          <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
          🔴 LIVE
        </div>
      )}

      {/* Stream Title */}
      <div className="absolute bottom-20 left-4 bg-black/80 text-white text-sm px-3 py-1 rounded backdrop-blur-sm">
        {title}
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
          {/* Volume and Settings Controls Only - No Play/Pause for Live Streams */}
          
          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              {/* Left Controls - Volume Only */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-red-400 transition-colors"
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="w-6 h-6" />
                    ) : (
                      <SpeakerWaveIcon className="w-6 h-6" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-4 relative">
                <button 
                  onClick={toggleMinimize}
                  className="text-white hover:text-red-400 transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? "□" : "−"}
                </button>
                
                {/* Settings Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleSettings}
                    className="text-white hover:text-red-400 transition-colors"
                    title="Settings"
                  >
                    <Cog6ToothIcon className="w-6 h-6" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48 border border-gray-600">
                      <div className="space-y-3">
                        <div>
                          <label className="text-white text-sm font-medium block mb-2">Quality</label>
                          <select className="w-full bg-gray-700 text-white rounded px-3 py-1 text-sm">
                            <option value="auto">Auto</option>
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                            <option value="480p">480p</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium block mb-2">Playback Speed</label>
                          <select className="w-full bg-gray-700 text-white rounded px-3 py-1 text-sm">
                            <option value="1">1x (Normal)</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                          </select>
                        </div>
                        <div className="pt-2 border-t border-gray-600">
                          <div className="text-xs text-gray-400">
                            <div>🔴 LIVE STREAM</div>
                            <div>Latency: ~5-10 seconds</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-400 transition-colors"
                  title="Fullscreen"
                >
                  <ArrowsPointingOutIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || (!isPlaying && streamUrl)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white text-sm">
              {isLoading ? 'Loading stream...' : 'Connecting to stream...'}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
