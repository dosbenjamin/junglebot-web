import { Schema } from '@effect/schema';

export const SoundId = Schema.UUID.pipe(Schema.brand('SoundId'));
export type SoundId = Schema.Schema.Type<typeof SoundId>;

export class Sound extends Schema.Class<Sound>('Sound')({
  id: SoundId,
  name: Schema.String,
  author: Schema.String,
  fileUrl: Schema.String,
  createAt: Schema.Number,
}) {}
