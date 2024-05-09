import { Schema } from '@effect/schema';

export const SoundId = Schema.UUID.pipe(Schema.brand('SoundId'));
export type SoundId = Schema.Schema.Type<typeof SoundId>;
