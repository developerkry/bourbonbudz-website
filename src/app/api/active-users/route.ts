import { NextRequest, NextResponse } from 'next/server';

interface ActiveUser {
  id: string;
  name: string;
  image?: string;
  status: 'watching' | 'chatting';
  lastSeen: string;
}

// In-memory store for active users (in production, use Redis or similar)
const activeUsers = new Map<string, ActiveUser>();

// Clean up users who haven't been seen for more than 30 seconds
const CLEANUP_INTERVAL = 30000; // 30 seconds
const USER_TIMEOUT = 45000; // 45 seconds

// Cleanup inactive users
setInterval(() => {
  const now = new Date().getTime();
  for (const [userId, user] of activeUsers.entries()) {
    if (now - new Date(user.lastSeen).getTime() > USER_TIMEOUT) {
      activeUsers.delete(userId);
    }
  }
}, CLEANUP_INTERVAL);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const streamId = searchParams.get('streamId') || 'after-dark';

    // Return list of active users
    const users = Array.from(activeUsers.values());
    
    return NextResponse.json({
      success: true,
      users,
      counts: {
        total: users.length,
        watching: users.filter(u => u.status === 'watching').length,
        chatting: users.filter(u => u.status === 'chatting').length
      }
    });
  } catch (error) {
    console.error('Active users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get active users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, image, status } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or add user
    activeUsers.set(userId, {
      id: userId,
      name,
      image,
      status: status || 'chatting',
      lastSeen: new Date().toISOString()
    });

    const users = Array.from(activeUsers.values());

    return NextResponse.json({
      success: true,
      users,
      counts: {
        total: users.length,
        watching: users.filter(u => u.status === 'watching').length,
        chatting: users.filter(u => u.status === 'chatting').length
      }
    });
  } catch (error) {
    console.error('Update active user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update active user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Remove user
    activeUsers.delete(userId);

    const users = Array.from(activeUsers.values());

    return NextResponse.json({
      success: true,
      users,
      counts: {
        total: users.length,
        watching: users.filter(u => u.status === 'watching').length,
        chatting: users.filter(u => u.status === 'chatting').length
      }
    });
  } catch (error) {
    console.error('Remove active user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove active user' },
      { status: 500 }
    );
  }
}
