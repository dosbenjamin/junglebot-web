import { Context, Data, Effect, Layer, Option } from 'effect';
import type { SelectSound } from '#app/sounds/entities/sound-entity';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import { Sound, SoundId } from '#app/sounds/schemas/sound-schemas';
import { BucketObjectKey } from '#providers/bucket/schemas/bucket-schemas';
import { Bucket } from '#providers/bucket/services/bucket-service';

class SoundNotFoundError extends Data.TaggedError('SoundNotFoundError') {}

export class GetSoundService extends Context.Tag('GetSoundService')<
  GetSoundService,
  {
    readonly getAll: () => Effect.Effect<Sound[]>;
    readonly get: (id: string) => Effect.Effect<Sound, SoundNotFoundError>;
  }
>() {
  static readonly Live = Layer.effect(
    GetSoundService,
    Effect.gen(function* () {
      const repository = yield* SoundRepository;
      const bucket = yield* Bucket;

      const reconciliate = (sound: SelectSound): Effect.Effect<Sound> => {
        const id = SoundId(sound.id);
        const key = BucketObjectKey(sound.fileId);

        return Effect.map(bucket.getUrl(key), (fileUrl) => {
          return new Sound({
            id,
            fileUrl,
            name: sound.name,
            author: sound.author,
            createAt: sound.createdAt,
          });
        });
      };

      return {
        getAll: () => {
          return Effect.gen(function* () {
            const sounds = yield* repository.getAll();

            return yield* Effect.forEach(sounds, (sound) => reconciliate(sound), {
              concurrency: 'unbounded',
            });
          });
        },

        get: (id) => {
          return Effect.gen(function* () {
            const sound = yield* repository.get(id);

            return yield* Option.match(Option.fromNullable(sound), {
              onSome: (sound) => reconciliate(sound),
              onNone: () => new SoundNotFoundError(),
            });
          });
        },
      };
    }),
  );
}
