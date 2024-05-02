import { Schema } from '@effect/schema';
import { Context, Effect, Layer, Option, pipe } from 'effect';
import { ViteAssetPathNotFoundError } from '#providers/vite/vite-errors';
import { ViteManifestRepository } from '#providers/vite/vite-manifest-repository';

const ViteManifestChunk = Schema.Struct({
  src: Schema.String,
  file: Schema.String,
});
const ViteManifest = Schema.Record(Schema.String, ViteManifestChunk);
const decodeManifest = Schema.decodeUnknown(ViteManifest);

const formatPath = (path: string): string => `/${path}`;

export class ViteAssetPathResolver extends Context.Tag('ViteAssetPathResolver')<
  ViteAssetPathResolver,
  {
    readonly resolve: (path: string) => Effect.Effect<string, ViteAssetPathNotFoundError>;
  }
>() {
  static readonly Live = Layer.effect(
    ViteAssetPathResolver,
    Effect.map(ViteManifestRepository, (repository) => {
      const getChunks = pipe(
        Effect.flatMap(repository.get(), (manifest) => decodeManifest(manifest)),
        Effect.map((manifest) => Object.values(manifest)),
        Effect.catchAll(() => Effect.succeed(ViteManifestChunk.records)),
      );

      return {
        resolve: (path) => {
          return Effect.gen(function* () {
            const chunks = yield* getChunks;

            const chunk = chunks.find((chunk) => formatPath(chunk.src) === path);

            return yield* Option.match(Option.fromNullable(chunk), {
              onSome: (chunk) => Effect.succeed(formatPath(chunk.file)),
              onNone: () => new ViteAssetPathNotFoundError(),
            });
          });
        },
      };
    }),
  );
}
