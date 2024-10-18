import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vite configuration
export default defineConfig({
  plugins: [
    // React plugin for Vite
    react(),
    // PWA plugin configuration
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Home Repair Service',
        short_name: 'HRS',
        description: 'Home Repair Service web application',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
