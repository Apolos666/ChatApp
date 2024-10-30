export interface UserConnectionDto {
  userId: number;
  userName: string;
  roomId: number;
  timestamp: string;
} 
export interface User {
    id: string;
    name: string;
    email: string;
    role: "User" | "Moderator" | "Admin";
    status: "active" | "inactive";
    phone_number: string;
    dob: string;  // ISO date string format
    address: string;
    password: string;
    created_at: string;  // ISO date string format
}

export type UserStatus = User["status"];
export type UserRole = User["role"];
