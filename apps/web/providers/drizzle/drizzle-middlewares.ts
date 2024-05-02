import { drizzle as d1 } from 'drizzle-orm/d1';
import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';
import { schema } from '#providers/drizzle/drizzle-schema';

export const drizzle = createMiddleware<Env>(async (context, next) => {
  context.set('drizzle', d1(context.env.DATABASE, { schema }));

  await next();
});
