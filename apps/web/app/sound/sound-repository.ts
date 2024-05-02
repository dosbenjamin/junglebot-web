import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Context, Effect, Layer } from 'effect';
import { type SelectSound, soundsTable } from '#app/sound/sound-models';
import type { DrizzleSchema } from '#providers/drizzle/drizzle-schema';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly list: () => Effect.Effect<SelectSound[]>;
    readonly findById: (id: string) => Effect.Effect<SelectSound | undefined>;
  }
>() {
  static live(db: DrizzleD1Database<DrizzleSchema>): Layer.Layer<SoundRepository> {
    return Layer.succeed(SoundRepository, {
      list: () => {
        const query = db.query.sounds.findMany();

        return Effect.promise(() => query.execute());
      },

      findById: (id) => {
        const query = db.query.sounds.findFirst({ where: eq(soundsTable.id, id) });

        return Effect.promise(() => query.execute());
      },
    });
  }
}
