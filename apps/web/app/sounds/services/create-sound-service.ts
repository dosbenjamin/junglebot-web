import { Context, Data, Effect, Layer, Option } from 'effect';
import { SoundNotFoundError } from '#app/sounds/errors/sound-not-found-error';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import type { CreateSoundPayload } from '#app/sounds/schemas/create-sound-payload';
import { Sound } from '#app/sounds/schemas/sound-schema';
import type { BucketExternalError } from '#providers/bucket/errors/bucket-external-error';
import { Bucket } from '#providers/bucket/services/bucket-service';

class SoundNameAlreadyUsedError extends Data.TaggedError('SoundNameAlreadyUsedError') {}

export class CreateSoundService extends Context.Tag('CreateSoundService')<
  CreateSoundService,
  {
    readonly create: (
      payload: CreateSoundPayload,
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
        create: (payload) => {
          return Effect.gen(function* (_) {
            if (yield* repository.getByName(payload.name)) {
              return yield* new SoundNameAlreadyUsedError();
            }

            const { key } = yield* bucket.put(payload.file);

            const sound = yield* repository.create({
              author: payload.author,
              name: payload.name,
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
