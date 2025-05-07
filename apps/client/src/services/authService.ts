import api from './api';
import type { LoginDto, CreateUserDto } from '../types/auth';
import type { User, AuthResponse } from '../types/user';

const authService = {
	/**
	 * Sends a login request to the backend.
	 * @param credentials - User login credentials (email and password).
	 * @returns A promise that resolves with the authentication response (including token and user info).
	 */
	login: async (credentials: LoginDto): Promise<AuthResponse> => {
		const response = await api.post('/auth/login', credentials);
		const { accessToken, user } = response.data;

		// Store the token in localStorage upon successful login
		localStorage.setItem('accessToken', accessToken);
		// Optionally store user info as well
		localStorage.setItem('user', JSON.stringify(user));

		return response.data;
	},

	/**
	 * Sends a registration request to the backend.
	 * @param userData - User registration data (email, name, password).
	 * @returns A promise that resolves with the registration response.
	 */
	register: async (
		userData: CreateUserDto
	): Promise<{ message: string; user: User }> => {
		const response = await api.post('/auth/register', userData);
		return response.data;
	},

	/**
	 * Logs the user out by removing the token and user info from storage.
	 */
	logout: () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');
		// You might also want to clear any in-memory user state here
	},

	/**
	 * Retrieves the current user's information from storage.
	 * @returns The user object if found, otherwise null.
	 */
	getCurrentUser: (): User | null => {
		const userJson = localStorage.getItem('user');
		try {
			return userJson ? JSON.parse(userJson) : null;
		} catch (e) {
			console.error('Failed to parse user from localStorage:', e);
			return null;
		}
	},

	/**
	 * Checks if the user is currently authenticated based on the presence of a token.
	 * @returns True if a token exists, false otherwise.
	 */
	isAuthenticated: (): boolean => {
		return !!localStorage.getItem('accessToken');
	},
};

export default authService;
