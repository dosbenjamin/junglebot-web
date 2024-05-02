import { soundsTable } from '#app/sound/sound-models';

export const schema = {
  sounds: soundsTable,
};
export type DrizzleSchema = typeof schema;
