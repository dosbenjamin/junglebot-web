import { Schema } from '@effect/schema';

export const BucketObjectKey = Schema.UUID.pipe(Schema.brand('BucketObjectKey'));
export type BucketObjectKey = Schema.Schema.Type<typeof BucketObjectKey>;

export class BucketObject extends Schema.Class<BucketObject>('BucketObject')({
  key: BucketObjectKey,
  body: Schema.instanceOf(ReadableStream),
}) {}
