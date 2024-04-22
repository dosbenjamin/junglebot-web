import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';
import type { Manifest, ManifestChunk } from 'vite';

const VITE_MANIFEST_PATH = '.vite/manifest.json';

export class Vite {
  readonly #manifestChunks: ManifestChunk[] | null = null;

  constructor(private readonly manifest: Manifest = {}) {
    this.#manifestChunks = Object.values(this.manifest);
  }

  getAssetPath(path: string | undefined): string | undefined {
    if (!path) return;
    if (import.meta.env.DEV) return path;

    const chunk = this.#manifestChunks?.find((chunk) => chunk.src && path.includes(chunk.src));
    return `/${chunk?.file}`;
  }
}

export const vite = createMiddleware<Env>(async (context, next) => {
  if (import.meta.env.DEV) {
    context.set('vite', new Vite());
    return next();
  }

  const url = new URL(`/${VITE_MANIFEST_PATH}`, context.req.url);
  const response = await context.env.ASSETS.fetch(url);
  const manifest = await response.json<Manifest>();
  context.set('vite', new Vite(manifest));

  await next();
});
