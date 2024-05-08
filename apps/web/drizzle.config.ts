import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'd1',
  out: 'migrations',
  schema: '**/*-entity.ts',
});
