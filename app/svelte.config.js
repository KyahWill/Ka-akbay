import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { 
		adapter: adapter({
			// Enable precompression for better performance
			precompress: true,
			// Enable polyfills for better compatibility
			polyfill: true
		}),
		csrf: { checkOrigin: false },
		// Optimize SSR performance
		prerender: {
			// Handle client-side navigation gracefully
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for dynamic routes
				if (message.includes('Not found')) {
					return;
				}
				// Throw other errors
				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
