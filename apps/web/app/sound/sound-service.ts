import { Context, Data, Effect, Layer, Option } from 'effect';
import type { SelectSound } from '#app/sound/sound-models';
import { SoundRepository } from '#app/sound/sound-repository';
import { Sound, SoundId } from '#app/sound/sound-schemas';
import { BucketObjectKey } from '#providers/bucket/bucket-schemas';
import { Bucket } from '#providers/bucket/bucket-service';

class SoundNotFoundError extends Data.TaggedError('SoundNotFoundError') {}

export class SoundService extends Context.Tag('SoundService')<
  SoundService,
  {
    readonly list: () => Effect.Effect<Sound[]>;
    readonly findById: (id: string) => Effect.Effect<Sound, SoundNotFoundError>;
  }
>() {
  static readonly Live = Layer.effect(
    SoundService,
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
        list: () => {
          return Effect.gen(function* () {
            const sounds = yield* repository.list();

            return yield* Effect.forEach(sounds, (sound) => reconciliate(sound), {
              concurrency: 'unbounded',
            });
          });
        },

        findById: (id) => {
          return Effect.gen(function* () {
            const sound = yield* repository.findById(id);

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
