import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Layer } from 'effect';
import type { Bucket } from '#providers/bucket/bucket-service';
import type { Vite } from '#providers/vite/vite-service';

declare module 'hono' {
  interface Env {
    Bindings: {
      ASSETS: Fetcher;
      BUCKET: R2Bucket;
      DATABASE: D1Database;
    };
  }

  interface ContextVariableMap {
    drizzle: DrizzleD1Database;
    BucketLive: Layer.Layer<Bucket>;
    ViteLive: Layer.Layer<Vite>;
  }
}
