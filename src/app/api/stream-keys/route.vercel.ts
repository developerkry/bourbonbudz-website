import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
  provider: 'local' | 'cloudflare' | 'mux' | 'aws' | 'custom';
}

// Configuration for different deployment environments
const getStreamConfig = (): RTMPConfig => {
  const isVercel = process.env.VERCEL === '1';
  const customRtmpUrl = process.env.CUSTOM_RTMP_URL;
  const customHlsUrl = process.env.CUSTOM_HLS_URL;

  if (customRtmpUrl && customHlsUrl) {
    // Custom RTMP server (VPS, dedicated server, etc.)
    return {
      serverUrl: customRtmpUrl,
      hlsUrl: customHlsUrl,
      port: 1935,
      provider: 'custom'
    };
  } else if (isVercel) {
    // Vercel deployment - recommend external service
    return {
      serverUrl: 'rtmp://live.cloudflarestream.com/YOUR_ACCOUNT_ID',
      hlsUrl: 'https://customer-YOUR_ID.cloudflarestream.com',
      port: 1935,
      provider: 'cloudflare'
    };
  } else {
    // Local development
    return {
      serverUrl: 'rtmp://localhost:1935/live',
      hlsUrl: 'http://localhost:8000/live',
      port: 1935,
      provider: 'local'
    };
  }
};

// In-memory storage for development
// In production, use a database
let streamKeys: StreamKey[] = [];

// Generate a secure stream key
const generateStreamKey = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

// Validate admin permissions
const isAuthorizedAdmin = (email?: string): boolean => {
  const adminEmails = [
    'bourbonbudz@gmail.com',
    'admin@bourbonbudz.com',
    'chet@bourbonbudz.com',
    'john@bourbonbudz.com'
  ];
  return adminEmails.includes(email || '');
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const key = searchParams.get('key');

    const rtmpConfig = getStreamConfig();

    if (action === 'validate' && key) {
      // Validate stream key for RTMP server
      const streamKey = streamKeys.find(sk => sk.key === key && sk.isActive);
      
      if (streamKey) {
        // Update last used timestamp
        streamKey.lastUsed = new Date().toISOString();
      }
      
      return NextResponse.json({
        valid: !!streamKey,
        key: streamKey?.id
      });
    }

    // Return all stream keys and config (admin only in production)
    return NextResponse.json({
      success: true,
      streamKeys,
      config: rtmpConfig,
      environment: {
        isVercel: process.env.VERCEL === '1',
        hasCustomRtmp: !!(process.env.CUSTOM_RTMP_URL && process.env.CUSTOM_HLS_URL),
        provider: rtmpConfig.provider
      }
    });
  } catch (error) {
    console.error('Stream keys GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get stream keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, name, createdBy, keyId } = body;

    if (!isAuthorizedAdmin(createdBy)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'create':
        if (!name?.trim()) {
          return NextResponse.json(
            { success: false, error: 'Name is required' },
            { status: 400 }
          );
        }

        const newStreamKey: StreamKey = {
          id: crypto.randomUUID(),
          key: generateStreamKey(),
          name: name.trim(),
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: createdBy
        };

        streamKeys.push(newStreamKey);

        return NextResponse.json({
          success: true,
          streamKey: newStreamKey
        });

      case 'toggle':
        if (!keyId) {
          return NextResponse.json(
            { success: false, error: 'Key ID is required' },
            { status: 400 }
          );
        }

        const keyToToggle = streamKeys.find(sk => sk.id === keyId);
        if (!keyToToggle) {
          return NextResponse.json(
            { success: false, error: 'Stream key not found' },
            { status: 404 }
          );
        }

        keyToToggle.isActive = !keyToToggle.isActive;

        return NextResponse.json({
          success: true,
          streamKey: keyToToggle
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Stream keys POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, key } = body;

    if (action === 'updateLastUsed' && key) {
      const streamKey = streamKeys.find(sk => sk.key === key);
      if (streamKey) {
        streamKey.lastUsed = new Date().toISOString();
      }
      
      return NextResponse.json({
        success: true
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Stream keys PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stream key' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyId = searchParams.get('keyId');
    const deletedBy = searchParams.get('deletedBy');

    if (!isAuthorizedAdmin(deletedBy || undefined)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!keyId) {
      return NextResponse.json(
        { success: false, error: 'Key ID is required' },
        { status: 400 }
      );
    }

    const keyIndex = streamKeys.findIndex(sk => sk.id === keyId);
    if (keyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Stream key not found' },
        { status: 404 }
      );
    }

    streamKeys.splice(keyIndex, 1);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Stream keys DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stream key' },
      { status: 500 }
    );
  }
}
