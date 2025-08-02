import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // This makes the environment variable available in the client-side code,
    // as required by the Gemini API setup.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
