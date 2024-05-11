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
      values: NewSound,
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
        create: (values) => {
          return Effect.gen(function* () {
            if (yield* repository.getByName(values.name)) {
              return yield* new SoundNameAlreadyUsedError();
            }

            const { key } = yield* bucket.put(values.stream);

            const sound = yield* repository.create({
              author: values.author,
              name: values.name,
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
