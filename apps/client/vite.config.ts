// apps/client/vite.config.ts
import path from 'path'; // Import the path module to resolve paths
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind CSS Vite plugin

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(), // The standard Vite React plugin
		tailwindcss(), // Add the Tailwind CSS plugin here
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	// You can add other Vite configuration options here if needed,
	// like server settings, build options, etc.
	server: {
		// Configure the development server if necessary, e.g., port
		// port: 5173,
	},
});
