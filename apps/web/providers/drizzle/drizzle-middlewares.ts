import { drizzle as d1 } from 'drizzle-orm/d1';
import { createMiddleware } from '#helpers/hono-helpers';
import { schema } from '#providers/drizzle/drizzle-schema';

export const drizzle = createMiddleware(async (context, next) => {
  context.set('drizzle', d1(context.env.DATABASE, { schema }));

  await next();
});
