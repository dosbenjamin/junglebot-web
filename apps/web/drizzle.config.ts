import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1',
  out: 'migrations',
  schema: '**/*-entity.ts',
});
