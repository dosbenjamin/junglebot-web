import { createHandlers } from '#helpers/hono-helpers';
import { About } from '#views/pages/about-page';

export const render = createHandlers((context) => context.render(<About />));
