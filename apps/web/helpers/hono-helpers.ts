import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

export const { createHandlers } = createFactory();
export const createRouteGroup = <T extends Hono>(register: (group: Hono) => T) => {
  return register(new Hono());
};
