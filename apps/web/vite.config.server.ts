import path from 'node:path';
import pages from '@hono/vite-cloudflare-pages';
import devServer from '@hono/vite-dev-server';
import cloudflare from '@hono/vite-dev-server/cloudflare-pages';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    devServer({
      entry: path.join(process.cwd(), 'index.tsx'),
      plugins: [
        cloudflare({
          d1Databases: ['DATABASE'],
          r2Buckets: ['BUCKET'],
        }),
      ],
    }),
    pages({
      entry: 'index.tsx',
    }),
  ],
  resolve: {
    alias: {
      '#app': path.join(process.cwd(), 'app'),
      '#common': path.join(process.cwd(), 'common'),
      '#helpers': path.join(process.cwd(), 'helpers'),
      '#providers': path.join(process.cwd(), 'providers'),
      '#static': path.join(process.cwd(), 'static'),
      '#views': path.join(process.cwd(), 'views'),
    },
  },
});
