import type { Vite } from '#providers/vite-provider';

declare module 'hono' {
  interface Env {
    Bindings: {
      ASSETS: Fetcher;
    };
  }

  interface ContextVariableMap {
    vite: Vite;
  }
}
