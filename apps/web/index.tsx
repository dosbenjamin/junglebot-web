import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-pages';
import { jsxRenderer } from 'hono/jsx-renderer';
import * as about from '#app/about/handlers/about-handlers';
import * as home from '#app/home/handlers/home-handlers';
import * as ping from '#app/ping/handlers/ping-handlers';
import { createRouteGroup } from '#helpers/hono-helpers';
import { bucketConfig } from '#providers/bucket/bucket-config';
import { serveBucket } from '#providers/bucket/handlers/bucket-handlers';
import { bucket } from '#providers/bucket/middlewares/bucket-middlewares';
import { drizzle } from '#providers/drizzle/middlewares/drizzle-middlewares';
import { vite } from '#providers/vite/middlewares/vite-middlewares';
import { Base } from '#views/layouts/base-layout';

const app = new Hono()
  .use(drizzle, bucket)
  .get(bucketConfig.path, ...serveBucket)
  .route(
    '/',
    createRouteGroup((web) => {
      return web
        .use(
          vite,
          jsxRenderer((props) => <Base {...props} />),
        )
        .get('/', ...home.render)
        .get('/about', ...about.render)
        .get('/static/*', serveStatic());
    }),
  )
  .route(
    '/api',
    createRouteGroup((api) => api.get('/', ...ping.handle)),
  );

export default app;
