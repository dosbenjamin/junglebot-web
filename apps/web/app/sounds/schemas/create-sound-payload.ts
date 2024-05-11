import { Schema } from '@effect/schema';

export class CreateSoundPayload extends Schema.Class<CreateSoundPayload>('CreateSoundPayload')({
  name: Schema.compose(Schema.NonEmpty, Schema.Trim),
  author: Schema.compose(Schema.NonEmpty, Schema.Trim),
  file: Schema.instanceOf(File),
}) {
  static decodeUnknown = Schema.decodeUnknown(CreateSoundPayload, { errors: 'all' });
}
