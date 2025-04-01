import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Optional but safe for Netlify/Vercel
  plugins: [react()],
});
