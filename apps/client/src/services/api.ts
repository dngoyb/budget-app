import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
	// Base URL for your backend API.
	// We use import.meta.env.VITE_API_URL for environment variable support with Vite.
	// Provide a fallback URL for development.
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

	// Default headers to be included in requests
	headers: {
		'Content-Type': 'application/json',
		// Other headers like 'Accept' can be added here if needed
	},

	// You can add other default configurations here, e.g., timeout
	// timeout: 5000, // Request timeout in milliseconds
});

// Add a request interceptor
// This interceptor will run before each request is sent.
api.interceptors.request.use(
	(config) => {
		// Get the token from localStorage (or wherever you store it after login)
		// We'll store the token under the key 'accessToken'
		const token = localStorage.getItem('accessToken');

		// If a token exists, add it to the Authorization header in the Bearer format
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Return the updated configuration object
		return config;
	},
	(error) => {
		// Do something with request error (e.g., log it)
		// You can also handle specific request errors globally here
		return Promise.reject(error);
	}
);

// We will add a response interceptor here later for global error handling (e.g., 401 Unauthorized).

export default api; // Export the configured Axios instance
