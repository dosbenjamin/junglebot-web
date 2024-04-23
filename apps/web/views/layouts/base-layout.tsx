import type { FC, PropsWithChildren } from 'hono/jsx';
import { Script, Stylesheet } from '#providers/vite/vite-helpers';

export const Base: FC<PropsWithChildren> = (props) => (
  <html lang="en">
    <head>
      <Stylesheet href="/static/css/index.css" />
      <Script defer src="/static/ts/index.ts" />
    </head>
    <body>{props.children}</body>
  </html>
);
