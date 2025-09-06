import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

interface StreamKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  createdBy: string;
}

// In-memory store for stream keys (in production, use database)
const streamKeys = new Map<string, StreamKey>();

// RTMP server configuration
const RTMP_CONFIG = {
  serverUrl: process.env.RTMP_SERVER_URL || 'rtmp://localhost:1935/live',
  hlsUrl: process.env.HLS_SERVER_URL || 'http://localhost:8080/hls',
  port: process.env.RTMP_PORT || 1935
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyId = searchParams.get('keyId');

    if (keyId) {
      // Get specific stream key
      const streamKey = streamKeys.get(keyId);
      if (!streamKey) {
        return NextResponse.json(
          { success: false, error: 'Stream key not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        streamKey,
        config: RTMP_CONFIG
      });
    } else {
      // Get all stream keys
      const allKeys = Array.from(streamKeys.values());
      return NextResponse.json({
        success: true,
        streamKeys: allKeys,
        config: RTMP_CONFIG
      });
    }
  } catch (error) {
    console.error('Stream keys error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get stream keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, name, createdBy } = body;

    if (!createdBy) {
      return NextResponse.json(
        { success: false, error: 'Creator email required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        if (!name) {
          return NextResponse.json(
            { success: false, error: 'Stream key name required' },
            { status: 400 }
          );
        }

        // Generate unique stream key
        const newKeyId = randomBytes(16).toString('hex');
        const streamKey = randomBytes(32).toString('hex');

        const newStreamKey: StreamKey = {
          id: newKeyId,
          key: streamKey,
          name,
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy
        };

        streamKeys.set(newKeyId, newStreamKey);

        return NextResponse.json({
          success: true,
          streamKey: newStreamKey,
          config: RTMP_CONFIG
        });

      case 'toggle':
        const { keyId: toggleKeyId } = body;
        const existingKey = streamKeys.get(toggleKeyId);
        
        if (!existingKey) {
          return NextResponse.json(
            { success: false, error: 'Stream key not found' },
            { status: 404 }
          );
        }

        existingKey.isActive = !existingKey.isActive;
        streamKeys.set(toggleKeyId, existingKey);

        return NextResponse.json({
          success: true,
          streamKey: existingKey
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Stream key creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage stream key' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyId = searchParams.get('keyId');
    const deletedBy = searchParams.get('deletedBy');

    if (!keyId || !deletedBy) {
      return NextResponse.json(
        { success: false, error: 'Key ID and deleter required' },
        { status: 400 }
      );
    }

    if (!streamKeys.has(keyId)) {
      return NextResponse.json(
        { success: false, error: 'Stream key not found' },
        { status: 404 }
      );
    }

    streamKeys.delete(keyId);

    return NextResponse.json({
      success: true,
      message: 'Stream key deleted successfully'
    });
  } catch (error) {
    console.error('Stream key deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stream key' },
      { status: 500 }
    );
  }
}

// Webhook endpoint for RTMP server to validate stream keys
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { streamKey, action } = body;

    // Find the stream key
    const key = Array.from(streamKeys.values()).find(k => k.key === streamKey);
    
    if (!key || !key.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or inactive stream key' },
        { status: 401 }
      );
    }

    // Update last used timestamp
    if (action === 'publish') {
      key.lastUsed = new Date().toISOString();
      streamKeys.set(key.id, key);
    }

    return NextResponse.json({
      success: true,
      message: 'Stream key validated'
    });
  } catch (error) {
    console.error('Stream key validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate stream key' },
      { status: 500 }
    );
  }
}
