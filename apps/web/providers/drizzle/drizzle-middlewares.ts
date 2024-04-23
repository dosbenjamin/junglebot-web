import { drizzle as d1 } from 'drizzle-orm/d1';
import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';

export const drizzle = createMiddleware<Env>(async (context, next) => {
  context.set('drizzle', d1(context.env.DATABASE));

  await next();
});
