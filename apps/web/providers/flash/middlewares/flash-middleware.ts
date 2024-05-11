import { createMiddleware } from '#helpers/hono-helpers';
import { flash as _flash } from '#providers/flash/services/flash-service';

export const flash = createMiddleware(async (context, next) => {
  context.set('flash', _flash);

  await next();
});
