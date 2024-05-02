import { createMiddleware } from '#helpers/hono-helpers';
import { Bucket } from '#providers/bucket/bucket-service';

export const bucket = createMiddleware(async (context, next) => {
  context.set('BucketLive', Bucket.live(context.env.BUCKET));

  await next();
});
