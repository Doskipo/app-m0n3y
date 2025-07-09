import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/Icon_Necse_WhiteTheme_192x192.png',
        'icons/Icon_Necse_WhiteTheme_512x512.png'
      ],
      manifest: {
        name: 'NECSE',
        short_name: 'NECSE',
        description: 'App de finances personals',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/?v=3',
        icons: [
          {
            src: '/icons/Icon_Necse_WhiteTheme_192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/Icon_Necse_WhiteTheme_512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
