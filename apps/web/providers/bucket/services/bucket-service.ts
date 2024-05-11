import { Schema } from '@effect/schema';
import { Context, Data, Effect, Layer, Option } from 'effect';
import { BucketExternalError } from '#providers/bucket/errors/bucket-external-error';
import { BucketObjectKey } from '#providers/bucket/schemas/bucket-object-key-schema';

class BucketObjectNotFoundError extends Data.TaggedError('BucketObjectNotFoundError') {}

class BucketObject extends Schema.Class<BucketObject>('BucketObject')({
  key: BucketObjectKey,
  file: Schema.instanceOf(File),
}) {}

export class Bucket extends Context.Tag('Bucket')<
  Bucket,
  {
    readonly put: (value: File) => Effect.Effect<BucketObject, BucketExternalError>;
    readonly get: (
      key: BucketObjectKey,
    ) => Effect.Effect<BucketObject, BucketExternalError | BucketObjectNotFoundError>;
    readonly getUrl: (key: BucketObjectKey) => Effect.Effect<string>;
    readonly delete: (key: BucketObjectKey) => Effect.Effect<void, BucketExternalError>;
  }
>() {
  static live(bucket: R2Bucket, currentUrl: string, objectPath: string): Layer.Layer<Bucket> {
    return Layer.succeed(Bucket, {
      put(value) {
        const key = BucketObjectKey(crypto.randomUUID());

        return Effect.gen(function* () {
          yield* Effect.tryPromise({
            try: () => bucket.put(key, value),
            catch: () => new BucketExternalError(),
          });

          return new BucketObject({ key, file: value });
        });
      },

      get(key) {
        return Effect.gen(function* (_) {
          const object = yield* Effect.tryPromise({
            try: () => bucket.get(key),
            catch: () => new BucketExternalError(),
          });

          const { blob } = yield* Option.match(Option.fromNullable(object), {
            onSome: (object) => Effect.succeed(object),
            onNone: () => new BucketObjectNotFoundError(),
          });

          const file = yield* _(
            Effect.promise(() => blob()),
            Effect.map((blob) => new File([blob], key)),
          );

          return new BucketObject({ key, file });
        });
      },

      getUrl(key) {
        const url = new URL(`${objectPath}/${key}`, currentUrl);

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
