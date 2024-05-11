import { Context, Effect, Layer, Option } from 'effect';
import { SoundNotFoundError } from '#app/sounds/errors/sound-not-found-error';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import { SoundId } from '#app/sounds/schemas/sound-id-schema';
import { Sound } from '#app/sounds/schemas/sound-schema';
import type { Bucket } from '#providers/bucket/services/bucket-service';

export class GetSoundService extends Context.Tag('GetSoundService')<
  GetSoundService,
  {
    readonly getAll: () => Effect.Effect<Sound[], never, Bucket>;
    readonly getById: (id: string) => Effect.Effect<Sound, SoundNotFoundError, Bucket>;
  }
>() {
  static readonly Live = Layer.effect(
    GetSoundService,
    Effect.gen(function* () {
      const repository = yield* SoundRepository;

      return {
        getAll: () => {
          return Effect.gen(function* (_) {
            const sounds = yield* repository.getAll();

            return yield* Effect.forEach(sounds, (sound) => Sound.fromRecord(sound), {
              concurrency: 'unbounded',
            });
          });
        },

        getById: (id) => {
          return Effect.gen(function* (_) {
            const sound = yield* repository.getById(SoundId(id));

            return yield* Option.match(Option.fromNullable(sound), {
              onSome: (sound) => Sound.fromRecord(sound),
              onNone: () => new SoundNotFoundError(),
            });
          });
        },
      };
    }),
  );
}
