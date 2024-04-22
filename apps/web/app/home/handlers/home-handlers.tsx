import { createHandlers } from '#helpers/hono-helpers';
import { Home } from '#views/pages/home-page';

export const render = createHandlers((context) => context.render(<Home />));
