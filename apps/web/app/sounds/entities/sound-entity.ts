import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { SoundId } from '#app/sounds/schemas/sound-id-schema';
import type { BucketObjectKey } from '#providers/bucket/schemas/bucket-object-key-schema';

export const Sound = sqliteTable('sounds', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .$type<SoundId>()
    .notNull(),
  name: text('name').unique().notNull(),
  author: text('author').notNull(),
  fileId: text('file_id')
    .$defaultFn(() => crypto.randomUUID())
    .$type<BucketObjectKey>()
    .notNull(),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
});

export type SelectSound = typeof Sound.$inferSelect;
export type InsertSound = typeof Sound.$inferInsert;
