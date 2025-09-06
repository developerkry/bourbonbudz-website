'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserPlusIcon, ShieldCheckIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UserRole {
  email: string;
  role: 'admin' | 'moderator' | 'user';
  assignedBy?: string;
  assignedAt: string;
  permissions: string[];
}

export default function UserManagement() {
  const { data: session } = useSession();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'user'>('moderator');
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user is admin
  const isAdmin = session?.user?.email === 'bourbonbudz@gmail.com' || 
                  session?.user?.email === 'admin@bourbonbudz.com' || 
                  session?.user?.email === 'chet@bourbonbudz.com' ||
                  session?.user?.email === 'john@bourbonbudz.com';

  useEffect(() => {
    if (isAdmin) {
      loadUserRoles();
    }
  }, [isAdmin]);

  const loadUserRoles = async () => {
    try {
      const response = await fetch('/api/user-roles');
      const data = await response.json();
      if (data.success) {
        setUserRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Failed to load user roles:', error);
    }
  };

  const assignRole = async () => {
    if (!newUserEmail.trim()) {
      alert('Please enter a user email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: newUserEmail.trim(),
          role: newUserRole,
          assignedBy: session?.user?.email
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewUserEmail('');
        setNewUserRole('moderator');
        loadUserRoles();
        alert('Role assigned successfully!');
      } else {
        alert('Failed to assign role: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to assign role:', error);
      alert('Failed to assign role');
    } finally {
      setIsLoading(false);
    }
  };

  const removeRole = async (userEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${userEmail}'s role?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user-roles?email=${encodeURIComponent(userEmail)}&removedBy=${encodeURIComponent(session?.user?.email || '')}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        loadUserRoles();
        alert('Role removed successfully!');
      } else {
        alert('Failed to remove role: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to remove role:', error);
      alert('Failed to remove role');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-900/20 border-red-500/50';
      case 'moderator': return 'text-blue-400 bg-blue-900/20 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/50';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheckIcon className="w-4 h-4" />;
      case 'moderator': return <UserIcon className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access user management.</p>
          <a
            href="/auth/signin"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access user management.</p>
          <a
            href="/after-dark"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Back to After Dark
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>

        {/* Add New User Role */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <UserPlusIcon className="w-6 h-6 mr-2" />
            Assign User Role
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                User Email
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'moderator' | 'user')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={assignRole}
                disabled={isLoading || !newUserEmail.trim()}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                {isLoading ? 'Assigning...' : 'Assign Role'}
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
            <h3 className="font-bold text-white mb-2">Role Permissions:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="text-red-400 font-bold mb-1">Admin</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Manage streams</li>
                  <li>• Assign roles</li>
                  <li>• Full moderation</li>
                  <li>• View analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-bold mb-1">Moderator</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Moderate chat</li>
                  <li>• Timeout users</li>
                  <li>• Delete messages</li>
                  <li>• View reports</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-400 font-bold mb-1">User</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Send messages</li>
                  <li>• View streams</li>
                  <li>• Basic access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Current User Roles */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Current User Roles</h2>
          
          {userRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No user roles assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-4 text-white font-bold">User</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Role</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Assigned By</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Assigned At</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((userRole) => (
                    <tr key={userRole.email} className="border-b border-zinc-800">
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{userRole.email}</div>
                        {userRole.email === session?.user?.email && (
                          <div className="text-red-400 text-sm">(You)</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold border ${getRoleColor(userRole.role)}`}>
                          {getRoleIcon(userRole.role)}
                          <span>{userRole.role.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {userRole.assignedBy || 'System'}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(userRole.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {userRole.email !== 'bourbonbudz@gmail.com' && userRole.email !== session?.user?.email && (
                          <button
                            onClick={() => removeRole(userRole.email)}
                            disabled={isLoading}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove role"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/admin/stream"
            className="text-red-400 hover:text-red-300 transition-colors mr-6"
          >
            ← Stream Management
          </a>
          <a
            href="/after-dark"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Back to After Dark
          </a>
        </div>
      </div>
    </div>
  );
}
