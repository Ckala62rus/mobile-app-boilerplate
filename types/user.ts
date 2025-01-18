import { ApiResponse } from "./api";

export enum UserRole {
	Attendee = "attendee",
	Manager = "manager",
}

export type AuthResponse = ApiResponse<{
  access_token: any; token: string; user: User 
}>;

export type User = {
	id: number;
	email: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
}
