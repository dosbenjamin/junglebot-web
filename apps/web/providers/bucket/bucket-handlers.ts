import { Schema } from '@effect/schema';
import { Effect, pipe } from 'effect';
import { validator } from 'hono/validator';
import { createHandlers } from '#helpers/hono-helpers';
import { BucketObjectKey } from '#providers/bucket/bucket-schemas';
import { Bucket } from '#providers/bucket/bucket-service';

const decodeParam = Schema.decodeUnknown(
  Schema.Struct({
    key: BucketObjectKey,
  }),
);

export const serveBucket = createHandlers(
  validator('param', (param, context) => {
    const validateParam = pipe(
      decodeParam(param),
      Effect.catchAll(() => Effect.succeed(context.newResponse(null, 400))),
    );

    return Effect.runSync(validateParam);
  }),
  async (context) => {
    const { key } = context.req.valid('param');

    const getBucketObject = pipe(
      Effect.flatMap(Bucket, (bucket) => bucket.get(key)),
      Effect.map((object) => context.newResponse(object.body)),
      Effect.catchTags({
        BucketObjectNotFoundError: () => Effect.succeed(context.notFound()),
        BucketExternalError: () => Effect.succeed(context.newResponse(null, 502)),
      }),
      Effect.provide(context.var.BucketLive),
    );

    return Effect.runPromise(getBucketObject);
  },
);
