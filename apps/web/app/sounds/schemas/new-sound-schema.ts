import { Schema } from '@effect/schema';

export class NewSound extends Schema.Class<NewSound>('NewSound')({
  name: Schema.String,
  author: Schema.String,
  stream: Schema.instanceOf(ReadableStream),
}) {}
