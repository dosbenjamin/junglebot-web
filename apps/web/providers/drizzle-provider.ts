import { type DrizzleD1Database, drizzle as d1 } from 'drizzle-orm/d1';
import { Context, Effect, Layer } from 'effect';
import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';

export class Drizzle extends Context.Tag('Drizzle')<
  Drizzle,
  {
    readonly db: Effect.Effect<DrizzleD1Database>;
  }
>() {}

export const drizzle = createMiddleware<Env>(async (context, next) => {
  const DrizzleLive = Layer.succeed(Drizzle, {
    db: Effect.succeed(d1(context.env.DATABASE)),
  });

  context.set('drizzle', DrizzleLive);

  await next();
});
