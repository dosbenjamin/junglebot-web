import { Schema } from '@effect/schema';
import { Effect, pipe } from 'effect';
import type { SelectSound } from '#app/sounds/entities/sound-entity';
import { SoundId } from '#app/sounds/schemas/sound-id-schema';
import { BucketObjectKey } from '#providers/bucket/schemas/bucket-schemas';
import { Bucket } from '#providers/bucket/services/bucket-service';

export class Sound extends Schema.Class<Sound>('Sound')({
  id: SoundId,
  name: Schema.String,
  author: Schema.String,
  fileUrl: Schema.String,
  createAt: Schema.Number,
}) {
  static fromRecord(sound: SelectSound): Effect.Effect<Sound, never, Bucket> {
    const id = SoundId(sound.id);
    const key = BucketObjectKey(sound.fileId);

    return pipe(
      Effect.flatMap(Bucket, (bucket) => bucket.getUrl(key)),
      Effect.map((fileUrl) => {
        return new Sound({
          id,
          fileUrl,
          name: sound.name,
          author: sound.author,
          createAt: sound.createdAt,
        });
      }),
    );
  }
}
