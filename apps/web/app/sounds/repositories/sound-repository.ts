import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Context, Effect, Layer } from 'effect';
import { type InsertSound, type SelectSound, Sound } from '#app/sounds/entities/sound-entity';
import type { SoundId } from '#app/sounds/schemas/sound-id-schema';
import type { DrizzleSchema } from '#providers/drizzle/drizzle-config';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly getAll: () => Effect.Effect<SelectSound[]>;
    readonly getById: (id: SoundId) => Effect.Effect<SelectSound | undefined>;
    readonly getByName: (name: string) => Effect.Effect<SelectSound | undefined>;
    readonly create: (values: InsertSound) => Effect.Effect<SelectSound | undefined>;
  }
>() {
  static live(db: DrizzleD1Database<DrizzleSchema>): Layer.Layer<SoundRepository> {
    return Layer.succeed(SoundRepository, {
      getAll: () => {
        const query = db.query.sounds.findMany();

        return Effect.promise(() => query.execute());
      },

      getById: (id) => {
        const query = db.query.sounds.findFirst({ where: eq(Sound.id, id) });

        return Effect.promise(() => query.execute());
      },

      getByName: (name) => {
        const query = db.query.sounds.findFirst({ where: eq(Sound.name, name) });

        return Effect.promise(() => query.execute());
      },

      create: (values) => {
        const query = db.insert(Sound).values(values).returning();

        return Effect.promise(() => query.execute().then((sounds) => sounds[0]));
      },
    });
  }
}
