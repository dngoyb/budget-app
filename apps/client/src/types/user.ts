export interface User {
	id: string;
	email: string;
	name: string;
	// Add other user properties if returned by backend
}

export interface AuthResponse {
	accessToken: string;
	user: User;
	// Add other properties if returned by backend
}
