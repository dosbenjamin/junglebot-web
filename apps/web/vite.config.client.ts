import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'hono-client-vite-config',
      config: () => ({
        build: {
          manifest: true,
          assetsDir: 'static',
          rollupOptions: {
            input: [
              path.join(process.cwd(), 'static/ts/index.ts'),
              path.join(process.cwd(), 'static/css/index.css'),
            ],
          },
        },
      }),
    },
  ],
});
