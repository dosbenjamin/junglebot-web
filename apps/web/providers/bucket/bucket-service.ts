import { Context, Data, Effect, Layer } from 'effect';
import { bucketConfig } from '#providers/bucket/bucket-config';
import { BucketObject, BucketObjectKey } from '#providers/bucket/bucket-schemas';

class BucketExternalError extends Data.TaggedError('BucketExternalError') {}
class BucketObjectNotFoundError extends Data.TaggedError('BucketObjectNotFoundError') {}

export class Bucket extends Context.Tag('Bucket')<
  Bucket,
  {
    readonly put: (value: ReadableStream) => Effect.Effect<BucketObject, BucketExternalError>;
    readonly get: (
      key: BucketObjectKey,
    ) => Effect.Effect<BucketObject, BucketExternalError | BucketObjectNotFoundError>;
    readonly getObjectUrl: (key: BucketObjectKey) => Effect.Effect<string>;
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
        return Effect.gen(function* (_) {
          const objectBody = yield* Effect.tryPromise({
            try: () => bucket.get(key),
            catch: () => new BucketExternalError(),
          });

          if (objectBody) {
            return new BucketObject({ key, body: objectBody.body });
          }

          return yield* new BucketObjectNotFoundError();
        });
      },

      getObjectUrl(key: BucketObjectKey) {
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
