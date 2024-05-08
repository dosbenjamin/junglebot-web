import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Layer } from 'effect';
import type { Bucket } from '#providers/bucket/services/bucket-service';
import type { DrizzleSchema } from '#providers/drizzle/config/drizzle-config';
import type { Vite } from '#providers/vite/services/vite-service';

declare module 'hono' {
  interface Env {
    Bindings: {
      ASSETS: Fetcher;
      BUCKET: R2Bucket;
      DATABASE: D1Database;
    };
  }

  interface ContextVariableMap {
    drizzle: DrizzleD1Database<DrizzleSchema>;
    BucketLive: Layer.Layer<Bucket>;
    ViteLive: Layer.Layer<Vite>;
  }
}
