export interface UserConnectionDto {
  userId: number;
  userName: string;
  roomId: number;
  timestamp: string;
} 
export interface User {
    id: string;
    avatar: string;
    name: string;
    phone_number: string;
    dob: string;  // ISO date string format
    address: string;
    email: string;
    role_id: number;
    is_active: boolean;
}

export const USER_ROLES = {
    1: 'Admin',
    2: 'Moderator',
    3: 'User'
} as const;

export const USER_STATUS = {
    true: 'Activated',
    false: 'Not Activated'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
