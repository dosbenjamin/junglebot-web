import { Schema } from '@effect/schema';
import { Context, Data, Effect, Layer, Option } from 'effect';
import { bucketConfig } from '#providers/bucket/bucket-config';
import { BucketObjectKey } from '#providers/bucket/schemas/bucket-schemas';

class BucketExternalError extends Data.TaggedError('BucketExternalError') {}
class BucketObjectNotFoundError extends Data.TaggedError('BucketObjectNotFoundError') {}

class BucketObject extends Schema.Class<BucketObject>('BucketObject')({
  key: BucketObjectKey,
  body: Schema.instanceOf(ReadableStream),
}) {}

export class Bucket extends Context.Tag('Bucket')<
  Bucket,
  {
    readonly put: (value: ReadableStream) => Effect.Effect<BucketObject, BucketExternalError>;
    readonly get: (
      key: BucketObjectKey,
    ) => Effect.Effect<BucketObject, BucketExternalError | BucketObjectNotFoundError>;
    readonly getUrl: (key: BucketObjectKey) => Effect.Effect<string>;
    readonly delete: (key: BucketObjectKey) => Effect.Effect<void, BucketExternalError>;
  }
>() {
  static live(bucket: R2Bucket): Layer.Layer<Bucket> {
    return Layer.succeed(Bucket, {
      put(value: ReadableStream) {
        const key = BucketObjectKey(crypto.randomUUID());

        return Effect.gen(function* () {
          yield* Effect.tryPromise({
            try: () => bucket.put(key, value),
            catch: () => new BucketExternalError(),
          });

          return new BucketObject({ key, body: value });
        });
      },

      get(key: BucketObjectKey) {
        return Effect.gen(function* () {
          const object = yield* Effect.tryPromise({
            try: () => bucket.get(key),
            catch: () => new BucketExternalError(),
          });

          const { body } = yield* Option.match(Option.fromNullable(object), {
            onSome: (object) => Effect.succeed(object),
            onNone: () => new BucketObjectNotFoundError(),
          });

          return new BucketObject({ key, body });
        });
      },

      getUrl(key: BucketObjectKey) {
        const url = new URL(import.meta.url, bucketConfig.rewrite(key));

        return Effect.succeed(url.toString());
      },

      delete(key: BucketObjectKey) {
        return Effect.tryPromise({
          try: () => bucket.delete(key),
          catch: () => new BucketExternalError(),
        });
      },
    });
  }
}
