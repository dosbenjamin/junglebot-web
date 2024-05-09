import { Schema } from '@effect/schema';
import { Context, Data, Effect, Layer, Option } from 'effect';
import { bucketConfig } from '#providers/bucket/bucket-config';
import { BucketExternalError } from '#providers/bucket/errors/bucket-errors';
import { BucketObjectKey } from '#providers/bucket/schemas/bucket-schemas';

class BucketObjectNotFoundError extends Data.TaggedError('BucketObjectNotFoundError') {}

class BucketObject extends Schema.Class<BucketObject>('BucketObject')({
  key: BucketObjectKey,
  stream: Schema.instanceOf(ReadableStream),
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
  static live(bucket: R2Bucket, currentUrl: string): Layer.Layer<Bucket> {
    return Layer.succeed(Bucket, {
      put(value) {
        const key = BucketObjectKey(crypto.randomUUID());

        return Effect.gen(function* () {
          yield* Effect.tryPromise({
            try: () => bucket.put(key, value),
            catch: () => new BucketExternalError(),
          });

          return new BucketObject({ key, stream: value });
        });
      },

      get(key) {
        return Effect.gen(function* () {
          const object = yield* Effect.tryPromise({
            try: () => bucket.get(key),
            catch: () => new BucketExternalError(),
          });

          const { body } = yield* Option.match(Option.fromNullable(object), {
            onSome: (object) => Effect.succeed(object),
            onNone: () => new BucketObjectNotFoundError(),
          });

          return new BucketObject({ key, stream: body });
        });
      },

      getUrl(key) {
        const url = new URL(bucketConfig.rewrite(key), currentUrl);

        return Effect.succeed(url.toString());
      },

      delete(key) {
        return Effect.tryPromise({
          try: () => bucket.delete(key),
          catch: () => new BucketExternalError(),
        });
      },
    });
  }
}
