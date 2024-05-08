import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Context, Effect, Layer } from 'effect';
import { type SelectSound, Sound } from '#app/sounds/entities/sound-entity';
import type { DrizzleSchema } from '#providers/drizzle/drizzle-config';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly getAll: () => Effect.Effect<SelectSound[]>;
    readonly get: (id: string) => Effect.Effect<SelectSound | undefined>;
  }
>() {
  static live(db: DrizzleD1Database<DrizzleSchema>): Layer.Layer<SoundRepository> {
    return Layer.succeed(SoundRepository, {
      getAll: () => {
        const query = db.query.sounds.findMany();

        return Effect.promise(() => query.execute());
      },

      get: (id) => {
        const query = db.query.sounds.findFirst({ where: eq(Sound.id, id) });

        return Effect.promise(() => query.execute());
      },
    });
  }
}
