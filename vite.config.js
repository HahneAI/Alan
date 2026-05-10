import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Inject the service-worker registration script automatically
      injectRegister: 'auto',
      manifest: {
        name: 'Alan Studio',
        short_name: 'Alan',
        description: 'Your personal speech and presentation coaching platform.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        // portrait keeps the layout predictable; users can still rotate
        orientation: 'portrait',
        theme_color: '#ffffff',
        background_color: '#0f172a',
        icons: [
          {
            // SVG scales to any size — works for Android PWA installs
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            // Maskable variant lets Android launchers crop to circle/squircle
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
          /*
           * TODO: add PNG icons for full iOS support.
           * Generate at minimum: 192×192, 512×512, and 180×180 (apple-touch-icon).
           * Without PNG icons, iOS will screenshot the page as the home-screen icon.
           */
        ],
      },
      workbox: {
        // Precache all static assets built by Vite
        globPatterns: ['**/*.{js,css,html,svg}'],
        // Cache-first for static assets, network-first for API/Supabase calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxAgeSeconds: 60 * 5 }, // 5 min
            },
          },
        ],
      },
    }),
  ],
})
