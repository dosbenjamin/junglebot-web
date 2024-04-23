import type { Layer } from 'effect';
import type { Drizzle } from '#providers/drizzle-provider';
import type { Vite } from '#providers/vite-provider';

declare module 'hono' {
  interface Env {
    Bindings: {
      ASSETS: Fetcher;
      DATABASE: D1Database;
    };
  }

  interface ContextVariableMap {
    vite: Vite;
    drizzle: Layer.Layer<Drizzle>;
  }
}
