export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurants: string[]; // IDs of restaurants this user has access to
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'owner' | 'manager' | 'staff' | 'customer';

export interface UserPermissions {
  canCreateRestaurant: boolean;
  canEditRestaurant: boolean;
  canDeleteRestaurant: boolean;
  canManageMenu: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canGenerateAiContent: boolean;
  canPublishDailyMenu: boolean;
}

export const defaultPermissions: Record<UserRole, UserPermissions> = {
  admin: {
    canCreateRestaurant: true,
    canEditRestaurant: true,
    canDeleteRestaurant: true,
    canManageMenu: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canGenerateAiContent: true,
    canPublishDailyMenu: true
  },
  owner: {
    canCreateRestaurant: true,
    canEditRestaurant: true,
    canDeleteRestaurant: false,
    canManageMenu: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canGenerateAiContent: true,
    canPublishDailyMenu: true
  },
  manager: {
    canCreateRestaurant: false,
    canEditRestaurant: true,
    canDeleteRestaurant: false,
    canManageMenu: true,
    canManageUsers: false,
    canViewAnalytics: true,
    canGenerateAiContent: true,
    canPublishDailyMenu: true
  },
  staff: {
    canCreateRestaurant: false,
    canEditRestaurant: false,
    canDeleteRestaurant: false,
    canManageMenu: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canGenerateAiContent: false,
    canPublishDailyMenu: false
  },
  customer: {
    canCreateRestaurant: false,
    canEditRestaurant: false,
    canDeleteRestaurant: false,
    canManageMenu: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canGenerateAiContent: false,
    canPublishDailyMenu: false
  }
}; 