import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Separar las librerías del código propio: cambian mucho menos seguido,
        // así un deploy no invalida el caché de React ni de Leaflet.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mapa: ['leaflet', 'leaflet.markercluster'],
        },
      },
    },
  },
});
