import { Schema } from '@effect/schema';
import { Effect } from 'effect';
import type { SelectSound } from '#app/sounds/entities/sound-entity';
import { SoundId } from '#app/sounds/schemas/sound-id-schema';
import { Bucket } from '#providers/bucket/services/bucket-service';

export class Sound extends Schema.Class<Sound>('Sound')({
  id: SoundId,
  name: Schema.String,
  author: Schema.String,
  fileUrl: Schema.String,
  createAt: Schema.Number,
}) {
  static fromRecord(sound: SelectSound): Effect.Effect<Sound, never, Bucket> {
    return Effect.gen(function* () {
      const bucket = yield* Bucket;
      const fileUrl = yield* bucket.getUrl(sound.fileId);

      return new Sound({
        id: sound.id,
        fileUrl,
        name: sound.name,
        author: sound.author,
        createAt: sound.createdAt,
      });
    });
  }
}
