import { Data } from 'effect';

export class SoundNotFoundError extends Data.TaggedError('SoundNotFoundError') {}
