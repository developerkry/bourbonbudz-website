'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, CalendarIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { fetchChannelVideos } from '../utils/youtube-api';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

export default function YouTubeEpisodes() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Temporarily disable YouTube API calls due to quota limits
        setError('YouTube API temporarily disabled due to quota limits. Please check back later.');
        setLoading(false);
        return;

        /* Uncomment when API quota is reset
        const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

        if (!channelId) {
          throw new Error('YouTube channel ID not found. Please set NEXT_PUBLIC_YOUTUBE_CHANNEL_ID in your environment variables.');
        }

        const fetchedVideos = await fetchChannelVideos(channelId, undefined, 20);
        setVideos(fetchedVideos);
        */
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setError(error instanceof Error ? error.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pulse">
            <div className="aspect-video bg-zinc-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
              <div className="h-3 bg-zinc-800 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-bold mb-2">Failed to Load Videos</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <p className="text-gray-500 text-xs">
            Make sure you have set up your YouTube API credentials in the environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-white font-bold mb-2">No Videos Found</h3>
          <p className="text-gray-400 text-sm">
            No videos were found on this channel. Check your channel ID or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-500/30 transition-all duration-300 group"
        >
          <div className="aspect-video bg-gradient-to-br from-red-900/20 to-zinc-800 flex items-center justify-center relative overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center text-gray-400 text-xs mb-2">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {formatDate(video.publishedAt)}
              <span className="mx-2">•</span>
              <EyeIcon className="w-3 h-3 mr-1" />
              {video.viewCount} views
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
              {video.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {video.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
