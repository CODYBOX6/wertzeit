// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://wertzeit.ch',
  
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimisation pour la production
      cssCodeSplit: true,
      minify: 'terser',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparer les dépendances pour un meilleur cache
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    }
  },

  integrations: [
    react(),
  ],
  
  // Optimisation pour la production
  build: {
    inlineStylesheets: 'auto'
  }
});