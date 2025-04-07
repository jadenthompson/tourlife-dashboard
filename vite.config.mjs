import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'lucide-react'],
  },
});
