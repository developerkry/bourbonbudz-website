// YouTube API Integration for Bourbon Budz Website with Fallback Support

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

interface LiveStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  viewerCount: string;
  isLive: boolean;
}

// Get available API keys with fallback
function getAPIKeys(): string[] {
  const keys = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  ].filter(Boolean) as string[];
  
  return keys;
}

// Try API call with multiple keys
async function apiCallWithFallback(url: string): Promise<any> {
  const keys = getAPIKeys();
  
  if (keys.length === 0) {
    console.warn('❌ No YouTube API keys configured');
    throw new Error('No YouTube API keys available');
  }
  
  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    const fullUrl = `${url}&key=${apiKey}`;
    
    try {
      console.log(`🔄 Trying YouTube API key ${i + 1}/${keys.length}`);
      const response = await fetch(fullUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if the response has an error (even with 200 status)
        if (data.error) {
          console.warn(`⚠️ API key ${i + 1} returned error: ${data.error.message}`);
          
          // If it's a quota error, try next key
          if (data.error.reason === 'quotaExceeded' || data.error.reason === 'dailyLimitExceeded') {
            console.warn(`📊 API key ${i + 1} quota exceeded, trying next key...`);
            continue;
          }
          
          // For other errors, still try next key
          continue;
        }
        
        console.log(`✅ Success with API key ${i + 1}`);
        return data;
      }
      
      // Handle HTTP error responses
      if (response.status === 403) {
        const errorData = await response.json().catch(() => null);
        console.warn(`🚫 API key ${i + 1} forbidden (likely quota exceeded):`, errorData?.error?.message || 'Unknown error');
        continue;
      }
      
      if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        console.warn(`❌ API key ${i + 1} bad request:`, errorData?.error?.message || 'Bad request');
        continue;
      }
      
      // Other HTTP errors
      console.warn(`⚠️ API key ${i + 1} HTTP error ${response.status}: ${response.statusText}`);
      continue;
      
    } catch (fetchError) {
      console.warn(`🌐 Network error with API key ${i + 1}:`, fetchError);
      
      // If this is the last key, throw the error
      if (i === keys.length - 1) {
        throw new Error(`All ${keys.length} API keys failed. Last error: ${fetchError}`);
      }
      continue;
    }
  }
  
  // All keys failed
  throw new Error(`All ${keys.length} YouTube API keys failed`);
}

// Check if channel is currently live
export const checkLiveStatus = async (channelId: string, apiKey?: string): Promise<LiveStream | null> => {
  try {
    // Check if we have any API keys configured
    const keys = getAPIKeys();

    if (keys.length === 0) {
      console.log('🚫 No YouTube API keys configured - returning offline status');
      return null;
    }

    // Use fallback system instead of single API key
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video`;
    const data = await apiCallWithFallback(searchUrl);
    
    if (data.items && data.items.length > 0) {
      const liveVideo = data.items[0];
      
      // Get live video details including viewer count
      try {
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,statistics,snippet&id=${liveVideo.id.videoId}`;
        const detailsData = await apiCallWithFallback(detailsUrl);
        
        if (detailsData.items && detailsData.items.length > 0) {
          const videoDetails = detailsData.items[0];
          
          return {
            videoId: liveVideo.id.videoId,
            title: liveVideo.snippet.title,
            description: liveVideo.snippet.description,
            thumbnail: liveVideo.snippet.thumbnails.medium.url,
            viewerCount: videoDetails.liveStreamingDetails?.concurrentViewers || '0',
            isLive: true
          };
        }
      } catch (detailsError) {
        console.warn('Failed to get live video details, using basic info');
        // Still return basic info even if details fail
        return {
          videoId: liveVideo.id.videoId,
          title: liveVideo.snippet.title,
          description: liveVideo.snippet.description,
          thumbnail: liveVideo.snippet.thumbnails.medium.url,
          viewerCount: '0',
          isLive: true
        };
      }
    }
    
    console.log('📺 Channel is not currently live');
    return null; // Not live
  } catch (error) {
    console.warn('❌ YouTube API live check failed:', error);
    return null; // Return null instead of throwing
  }
};

// Fetch channel videos
export const fetchChannelVideos = async (channelId: string, apiKey?: string, maxResults: number = 20): Promise<YouTubeVideo[]> => {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video`;
    const data = await apiCallWithFallback(searchUrl);
    
    if (!data.items || data.items.length === 0) {
      return [];
    }
    
    // Get video details including duration and view count
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}`;
    
    try {
      const detailsData = await apiCallWithFallback(detailsUrl);
      
      // Combine search results with video details
      const videos = data.items.map((item: any, index: number) => {
        const details = detailsData.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
          duration: details ? formatDuration(details.contentDetails.duration) : 'N/A',
          viewCount: details ? formatViewCount(details.statistics.viewCount) : 'N/A',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
      });
      
      return videos;
    } catch (detailsError) {
      console.warn('Failed to get video details, returning basic info');
      // Return basic info without details if the details call fails
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        duration: 'N/A',
        viewCount: 'N/A',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    }
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
};

// Helper function to format ISO 8601 duration to readable format
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

// Helper function to format view count
const formatViewCount = (count: string): string => {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

export default {};
