import { Schema } from '@effect/schema';

export const ViteManifestChunk = Schema.Struct({
  src: Schema.String,
  file: Schema.String,
});
export type ViteManifestChunk = Schema.Schema.Type<typeof ViteManifestChunk>;

export const ViteManifest = Schema.Record(Schema.String, ViteManifestChunk);
export type ViteManifest = Schema.Schema.Type<typeof ViteManifest>;
