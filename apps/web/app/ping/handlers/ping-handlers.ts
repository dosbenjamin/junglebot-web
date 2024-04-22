import { createHandlers } from '#helpers/hono-helpers';

export const handle = createHandlers((context) => context.json({ ping: 'pong' }));
