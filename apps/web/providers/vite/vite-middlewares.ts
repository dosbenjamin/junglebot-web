import { Data, Effect, Layer, pipe } from 'effect';
import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';
import type { Manifest } from 'vite';
import { ViteAssetPathResolver } from '#providers/vite/vite-asset-path-resolver';
import { ViteManifest } from '#providers/vite/vite-schemas';
import { Vite } from '#providers/vite/vite-service';

const MANIFEST_PATH = '/.vite/manifest.json';

class GetViteManifestError extends Data.TaggedError('GetViteManifestError') {}

export const vite = createMiddleware<Env>(async (context, next) => {
  if (import.meta.env.DEV) {
    context.set('ViteLive', Vite.Live);

    return next();
  }

  const url = new URL(MANIFEST_PATH, context.req.url);
  const getManifest = pipe(
    Effect.tryPromise({
      try: () => context.env.ASSETS.fetch(url).then((response) => response.json<Manifest>()),
      catch: () => new GetViteManifestError(),
    }),
    Effect.catchAll(() => Effect.succeed(ViteManifest.fields)),
  );
  const manifest = await Effect.runPromise(getManifest);

  const ViteAssetPathResolverLive = ViteAssetPathResolver.live(manifest);
  const ViteLive = Layer.provide(Vite.Live, ViteAssetPathResolverLive);

  context.set('ViteLive', ViteLive);

  await next();
});
