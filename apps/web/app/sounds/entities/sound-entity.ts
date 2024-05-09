import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Sound = sqliteTable('sounds', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text('name').unique().notNull(),
  author: text('author').notNull(),
  fileId: text('file_id')
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
});

export type SelectSound = typeof Sound.$inferSelect;
export type InsertSound = typeof Sound.$inferInsert;