import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./views/**/*.tsx'],
  theme: {
    extend: {},
  },
});
