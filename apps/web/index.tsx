import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-pages';
import { jsxRenderer } from 'hono/jsx-renderer';
import * as about from '#app/about/handlers/about-handlers';
import * as home from '#app/home/handlers/home-handlers';
import * as ping from '#app/ping/handlers/ping-handlers';
import { createRouteGroup } from '#helpers/hono-helpers';
import { drizzle } from '#providers/drizzle-provider';
import { vite } from '#providers/vite-provider';
import { Base } from '#views/layouts/base-layout';

const app = new Hono()
  .route(
    '/',
    createRouteGroup((web) => {
      return web
        .use(
          drizzle,
          jsxRenderer((props) => <Base {...props} />),
          vite,
        )
        .get('/', ...home.render)
        .get('/about', ...about.render)
        .use('/static/*', serveStatic());
    }),
  )
  .route(
    '/api',
    createRouteGroup((api) => api.get('/', ...ping.handle)),
  );

export default app;
