import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from '#helpers/hono-helpers';
import { Bucket } from '#providers/bucket/services/bucket-service';

export const bucket = (objectPath: string): MiddlewareHandler => {
  return createMiddleware(async (context, next) => {
    context.set('BucketLive', Bucket.live(context.env.BUCKET, context.req.url, objectPath));

    await next();
  });
};
