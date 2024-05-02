import { Layer, pipe } from 'effect';
import { createMiddleware } from '#helpers/hono-helpers';
import { ViteAssetPathResolver } from '#providers/vite/vite-asset-path-resolver';
import { ViteManifestRepository } from '#providers/vite/vite-manifest-repository';
import { Vite } from '#providers/vite/vite-service';

export const vite = createMiddleware(async (context, next) => {
  if (import.meta.env.DEV) {
    context.set('ViteLive', Vite.Live);

    return next();
  }

  const ViteLive = pipe(
    Layer.provide(Vite.Live, ViteAssetPathResolver.Live),
    Layer.provide(ViteManifestRepository.live(context.env.ASSETS, context.req.url)),
  );

  context.set('ViteLive', ViteLive);

  await next();
});
