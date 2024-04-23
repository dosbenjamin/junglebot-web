import { Schema } from '@effect/schema';
import { Context, Effect, Layer, pipe } from 'effect';
import type { Manifest } from 'vite';
import { ViteAssetPathNotFoundError } from '#providers/vite/vite-errors';
import { ViteManifest, ViteManifestChunk } from '#providers/vite/vite-schemas';

const decodeManifest = Schema.decodeUnknown(ViteManifest);
const formatPath = (path: string): string => `/${path}`;

export class ViteAssetPathResolver extends Context.Tag('ViteAssetPathResolver')<
  ViteAssetPathResolver,
  {
    readonly resolve: (path: string) => Effect.Effect<string, ViteAssetPathNotFoundError>;
  }
>() {
  static live(manifest: Manifest): Layer.Layer<ViteAssetPathResolver> {
    const getChunks = pipe(
      decodeManifest(manifest),
      Effect.map((manifest) => Object.values(manifest)),
      Effect.catchAll(() => Effect.succeed(ViteManifestChunk.records)),
    );

    const chunks = Effect.runSync(getChunks);

    return Layer.succeed(ViteAssetPathResolver, {
      resolve: (path) => {
        const chunk = chunks.find((chunk) => formatPath(chunk.src) === path);

        return chunk ? Effect.succeed(formatPath(chunk.file)) : new ViteAssetPathNotFoundError();
      },
    });
  }
}
