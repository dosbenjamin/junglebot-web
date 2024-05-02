import type { FC } from 'hono/jsx';
import { css } from '#styled-system/css';

export const Home: FC = () => <div class={css({ color: 'purple.400' })}>Hello World!</div>;
