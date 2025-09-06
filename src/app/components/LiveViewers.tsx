'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { EyeIcon, ChatBubbleLeftIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ActiveUser {
  id: string;
  name: string;
  image?: string;
  status: 'watching' | 'chatting';
  lastSeen: string;
}

interface LiveViewersProps {
  streamId?: string;
  isStreamLive?: boolean;
}

export default function LiveViewers({ streamId = 'after-dark', isStreamLive = false }: LiveViewersProps) {
  const { data: session } = useSession();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [userCounts, setUserCounts] = useState({ total: 0, watching: 0, chatting: 0 });
  const [showUsersList, setShowUsersList] = useState(false);
  const [userStatus, setUserStatus] = useState<'watching' | 'chatting'>('chatting');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!session?.user) return;

    // Set initial status based on stream state
    const initialStatus = isStreamLive ? 'watching' : 'chatting';
    setUserStatus(initialStatus);

    // Add current user to active users
    updateUserStatus(initialStatus);

    // Poll for active users every 10 seconds
    const interval = setInterval(loadActiveUsers, 10000);

    // Update user status every 20 seconds to keep them active
    const heartbeatInterval = setInterval(() => {
      updateUserStatus(userStatus);
    }, 20000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearInterval(heartbeatInterval);
      removeCurrentUser();
    };
  }, [session, streamId, isStreamLive]);

  // Update status when stream state changes
  useEffect(() => {
    if (session?.user) {
      const newStatus = isStreamLive ? 'watching' : 'chatting';
      setUserStatus(newStatus);
      updateUserStatus(newStatus);
    }
  }, [isStreamLive]);

  const loadActiveUsers = async () => {
    try {
      const response = await fetch(`/api/active-users?streamId=${streamId}`);
      const data = await response.json();
      if (data.success) {
        setActiveUsers(data.users || []);
        setUserCounts(data.counts || { total: 0, watching: 0, chatting: 0 });
      }
    } catch (error) {
      console.error('Failed to load active users:', error);
    }
  };

  const updateUserStatus = async (status: 'watching' | 'chatting') => {
    if (!session?.user) return;

    try {
      await fetch('/api/active-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.email || 'anonymous',
          name: session.user.name || 'Anonymous',
          image: session.user.image,
          status
        }),
      });
      // Immediately reload users to see the update
      loadActiveUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const removeCurrentUser = async () => {
    if (!session?.user) return;

    try {
      await fetch(`/api/active-users?userId=${encodeURIComponent(session.user.email || 'anonymous')}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffSeconds = Math.floor((now.getTime() - seen.getTime()) / 1000);
    
    if (diffSeconds < 30) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const toggleUsersList = () => {
    if (!showUsersList && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalWidth = 320; // 320px is the modal width
      const modalHeight = 400; // Approximate modal height
      
      // Calculate initial position
      let left = rect.right - modalWidth;
      let top = rect.bottom + window.scrollY + 8;
      
      // Ensure modal doesn't go off the right edge
      if (left < 16) {
        left = 16;
      }
      
      // Ensure modal doesn't go off the left edge
      const maxLeft = window.innerWidth - modalWidth - 16;
      if (left > maxLeft) {
        left = maxLeft;
      }
      
      // If modal would go below viewport, show it above the button instead
      if (rect.bottom + modalHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - modalHeight - 8;
      }
      
      setModalPosition({ top, left });
    }
    setShowUsersList(!showUsersList);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Live Viewers Indicator */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleUsersList}
          className="flex items-center space-x-2 bg-zinc-900/90 hover:bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-lg px-4 py-2 transition-colors"
        >
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-white font-medium">{userCounts.total}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400">
            {userCounts.watching > 0 && (
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span className="text-sm">{userCounts.watching}</span>
              </div>
            )}
            {userCounts.chatting > 0 && (
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="text-sm">{userCounts.chatting}</span>
              </div>
            )}
          </div>
        </button>

        {/* Users List Modal */}
        {showUsersList && (
          <div 
            className="fixed w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-[9999] max-h-96 overflow-hidden"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Live on After Dark</h3>
                  <p className="text-gray-400 text-sm">{userCounts.total} people online</p>
                </div>
                <button
                  onClick={() => setShowUsersList(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto">
              {activeUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No users online</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-700">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="p-3 flex items-center space-x-3">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium text-sm truncate">
                            {user.name}
                            {user.id === session.user?.email && (
                              <span className="text-red-400 ml-1">(You)</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>{formatLastSeen(user.lastSeen)}</span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex-shrink-0">
                        {user.status === 'watching' ? (
                          <div className="flex items-center space-x-1 text-green-400">
                            <EyeIcon className="w-4 h-4" />
                            <span className="text-xs">Watching</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-blue-400">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span className="text-xs">Chatting</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-800 border-t border-zinc-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Updates every 10s</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-3 h-3" />
                    <span>Watching</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="w-3 h-3" />
                    <span>Chatting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showUsersList && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowUsersList(false)}
        />
      )}
    </>
  );
}
