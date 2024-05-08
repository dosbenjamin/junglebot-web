import { Cache, Context, Effect, Layer, Option } from 'effect';
import { ViteAssetPathNotFoundError } from '#providers/vite/errors/vite-errors';
import { ViteAssetPathResolver } from '#providers/vite/services/vite-asset-path-resolver';

export class Vite extends Context.Tag('Vite')<
  Vite,
  {
    readonly getAssetPath: (
      path: string | undefined,
    ) => Effect.Effect<string | undefined, ViteAssetPathNotFoundError>;
  }
>() {
  static readonly Live = Layer.effect(
    Vite,
    Effect.gen(function* () {
      const resolver = yield* Effect.serviceOption(ViteAssetPathResolver);

      const get = (
        path: string | undefined,
      ): Effect.Effect<string | undefined, ViteAssetPathNotFoundError> => {
        if (!path) return new ViteAssetPathNotFoundError();

        return Option.match(resolver, {
          onSome: (resolver) => resolver.resolve(path),
          onNone: () => Effect.succeed(path),
        });
      };

      const cache = yield* Cache.make({
        capacity: Number.MAX_SAFE_INTEGER,
        timeToLive: Number.POSITIVE_INFINITY,
        lookup: (key: string | undefined) => get(key),
      });

      return {
        getAssetPath: (path) => cache.get(path),
      };
    }),
  );
}
