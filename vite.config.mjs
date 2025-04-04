import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'lucide-react']
  }
});