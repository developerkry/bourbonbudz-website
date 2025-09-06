import { NextRequest, NextResponse } from 'next/server';

interface StreamStatus {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description?: string;
  startTime?: string;
  viewerCount?: number;
  streamType?: 'rtmp' | 'hls' | 'youtube' | 'other';
}

// RTMP to HLS conversion helper
function convertRtmpToHls(rtmpUrl: string): string {
  // Extract stream key from RTMP URL
  const streamKey = rtmpUrl.split('/').pop();
  
  // Convert to HLS URL based on your RTMP server configuration
  return `http://localhost:8000/live/${streamKey}.m3u8`;
}

// In a real application, this would be stored in a database
// For now, we'll use a simple in-memory store
let currentStreamStatus: StreamStatus = {
  isLive: false,
  title: "AFTER DARK: Uncensored Bourbon Talk",
  description: "Join Chet & John for unfiltered bourbon discussions",
  viewerCount: 0,
  streamType: 'hls'
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const streamId = searchParams.get('streamId') || 'after-dark';

    // In a real app, you'd fetch this from your database based on streamId
    return NextResponse.json({
      success: true,
      stream: currentStreamStatus
    });
  } catch (error) {
    console.error('Stream status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get stream status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, streamUrl, title, description, streamType } = body;

    // Basic authentication check - in a real app, you'd verify admin credentials
    // For now, we'll allow any authenticated request to control the stream
    
    switch (action) {
      case 'start':
        let processedStreamUrl = streamUrl;
        let detectedStreamType = streamType;
        
        // Auto-detect and convert stream types
        if (streamUrl) {
          if (streamUrl.includes('rtmp://')) {
            detectedStreamType = 'rtmp';
            processedStreamUrl = convertRtmpToHls(streamUrl);
          } else if (streamUrl.includes('.m3u8')) {
            detectedStreamType = 'hls';
          } else if (streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be')) {
            detectedStreamType = 'youtube';
          } else {
            detectedStreamType = 'other';
          }
        }
        
        currentStreamStatus = {
          ...currentStreamStatus,
          isLive: true,
          streamUrl: processedStreamUrl || currentStreamStatus.streamUrl,
          title: title || currentStreamStatus.title,
          description: description || currentStreamStatus.description,
          startTime: new Date().toISOString(),
          viewerCount: 0,
          streamType: detectedStreamType
        };
        break;
        
      case 'stop':
        currentStreamStatus = {
          ...currentStreamStatus,
          isLive: false,
          streamUrl: undefined,
          startTime: undefined
        };
        break;
        
      case 'update':
        let updatedStreamUrl = streamUrl;
        let updatedStreamType = streamType;
        
        // Auto-detect and convert stream types for updates too
        if (streamUrl) {
          if (streamUrl.includes('rtmp://')) {
            updatedStreamType = 'rtmp';
            updatedStreamUrl = convertRtmpToHls(streamUrl);
          } else if (streamUrl.includes('.m3u8')) {
            updatedStreamType = 'hls';
          } else if (streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be')) {
            updatedStreamType = 'youtube';
          } else {
            updatedStreamType = 'other';
          }
        }
        
        currentStreamStatus = {
          ...currentStreamStatus,
          title: title || currentStreamStatus.title,
          description: description || currentStreamStatus.description,
          streamUrl: updatedStreamUrl || currentStreamStatus.streamUrl,
          streamType: updatedStreamType || currentStreamStatus.streamType
        };
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      stream: currentStreamStatus
    });
  } catch (error) {
    console.error('Stream control error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to control stream' },
      { status: 500 }
    );
  }
}

// PATCH endpoint for updating viewer count
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { viewerCount } = body;

    if (typeof viewerCount === 'number') {
      currentStreamStatus.viewerCount = viewerCount;
    }

    return NextResponse.json({
      success: true,
      stream: currentStreamStatus
    });
  } catch (error) {
    console.error('Viewer count update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update viewer count' },
      { status: 500 }
    );
  }
}
