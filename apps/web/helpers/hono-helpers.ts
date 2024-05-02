import { type Env, Hono } from 'hono';
import { createFactory } from 'hono/factory';

export const { createHandlers, createMiddleware } = createFactory<Env>();
export const createRouteGroup = <T extends Hono>(register: (group: Hono) => T) => {
  return register(new Hono());
};
