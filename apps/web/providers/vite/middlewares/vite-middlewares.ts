import { Layer, pipe } from 'effect';
import { createMiddleware } from '#helpers/hono-helpers';
import { ViteManifestRepository } from '#providers/vite/repositories/vite-manifest-repository';
import { ViteAssetPathResolver } from '#providers/vite/services/vite-asset-path-resolver';
import { Vite } from '#providers/vite/services/vite-service';

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
