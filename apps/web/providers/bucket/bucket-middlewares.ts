import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';
import { Bucket } from '#providers/bucket/bucket-service';

export const bucket = createMiddleware<Env>(async (context, next) => {
  context.set('BucketLive', Bucket.live(context.env.BUCKET));

  await next();
});
