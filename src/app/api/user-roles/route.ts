import { NextRequest, NextResponse } from 'next/server';

// User roles system
export interface UserRole {
  email: string;
  role: 'admin' | 'moderator' | 'user';
  assignedBy?: string;
  assignedAt: string;
  permissions: string[];
}

// Default permissions for each role
const ROLE_PERMISSIONS = {
  admin: [
    'manage_streams',
    'create_streams',
    'delete_streams',
    'manage_users',
    'assign_roles',
    'moderate_chat',
    'view_analytics',
    'manage_settings'
  ],
  moderator: [
    'moderate_chat',
    'timeout_users',
    'delete_messages',
    'view_reports'
  ],
  user: [
    'send_messages',
    'view_streams'
  ]
};

// In-memory store for user roles (in production, use database)
const userRoles = new Map<string, UserRole>();

// Initialize default admin
userRoles.set('bourbonbudz@gmail.com', {
  email: 'bourbonbudz@gmail.com',
  role: 'admin',
  assignedAt: new Date().toISOString(),
  permissions: ROLE_PERMISSIONS.admin
});

// Add other initial admins
const initialAdmins = [
  'admin@bourbonbudz.com',
  'chet@bourbonbudz.com', 
  'john@bourbonbudz.com'
];

initialAdmins.forEach(email => {
  userRoles.set(email, {
    email,
    role: 'admin',
    assignedBy: 'bourbonbudz@gmail.com',
    assignedAt: new Date().toISOString(),
    permissions: ROLE_PERMISSIONS.admin
  });
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('email');

    if (userEmail) {
      // Get specific user role
      const userRole = userRoles.get(userEmail) || {
        email: userEmail,
        role: 'user' as const,
        assignedAt: new Date().toISOString(),
        permissions: ROLE_PERMISSIONS.user
      };

      return NextResponse.json({
        success: true,
        userRole
      });
    } else {
      // Get all user roles
      const allRoles = Array.from(userRoles.values());
      return NextResponse.json({
        success: true,
        roles: allRoles
      });
    }
  } catch (error) {
    console.error('User roles error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, role, assignedBy } = body;

    if (!userEmail || !role || !assignedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the assigner has permission
    const assignerRole = userRoles.get(assignedBy);
    if (!assignerRole || assignerRole.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Validate role
    if (!['admin', 'moderator', 'user'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Assign role
    userRoles.set(userEmail, {
      email: userEmail,
      role: role as 'admin' | 'moderator' | 'user',
      assignedBy,
      assignedAt: new Date().toISOString(),
      permissions: ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]
    });

    return NextResponse.json({
      success: true,
      userRole: userRoles.get(userEmail)
    });
  } catch (error) {
    console.error('Assign role error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('email');
    const removedBy = searchParams.get('removedBy');

    if (!userEmail || !removedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if the remover has permission
    const removerRole = userRoles.get(removedBy);
    if (!removerRole || removerRole.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Can't remove the main admin
    if (userEmail === 'bourbonbudz@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove main admin' },
        { status: 403 }
      );
    }

    // Remove role (will default to user)
    userRoles.delete(userEmail);

    return NextResponse.json({
      success: true,
      message: 'Role removed successfully'
    });
  } catch (error) {
    console.error('Remove role error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}

// Helper function to check user permissions
export function hasPermission(userEmail: string, permission: string): boolean {
  const userRole = userRoles.get(userEmail);
  if (!userRole) return ROLE_PERMISSIONS.user.includes(permission);
  return userRole.permissions.includes(permission);
}

// Helper function to get user role
export function getUserRole(userEmail: string): UserRole {
  return userRoles.get(userEmail) || {
    email: userEmail,
    role: 'user',
    assignedAt: new Date().toISOString(),
    permissions: ROLE_PERMISSIONS.user
  };
}
