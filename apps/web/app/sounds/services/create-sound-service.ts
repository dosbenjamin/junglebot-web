import { Context, Data, Effect, Layer, Option } from 'effect';
import { SoundNotFoundError } from '#app/sounds/errors/sound-not-found-error';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import type { NewSound } from '#app/sounds/schemas/new-sound-schema';
import { Sound } from '#app/sounds/schemas/sound-schema';
import type { BucketExternalError } from '#providers/bucket/errors/bucket-errors';
import { Bucket } from '#providers/bucket/services/bucket-service';

class SoundNameAlreadyUsedError extends Data.TaggedError('SoundNameAlreadyUsedError') {}

export class CreateSoundService extends Context.Tag('CreateSoundService')<
  CreateSoundService,
  {
    readonly create: (
      newSound: NewSound,
    ) => Effect.Effect<
      Sound,
      SoundNotFoundError | SoundNameAlreadyUsedError | BucketExternalError,
      Bucket
    >;
  }
>() {
  static readonly Live = Layer.effect(
    CreateSoundService,
    Effect.gen(function* () {
      const repository = yield* SoundRepository;
      const bucket = yield* Bucket;

      return {
        create: (newSound) => {
          return Effect.gen(function* () {
            const existingSound = yield* repository.getByName(newSound.name);

            if (existingSound) {
              return yield* new SoundNameAlreadyUsedError();
            }

            const { key } = yield* bucket.put(newSound.stream);

            const sound = yield* repository.create({
              author: newSound.author,
              name: newSound.name,
              fileId: key,
            });

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
