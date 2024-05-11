import { Effect, pipe } from 'effect';
import { validator } from 'hono/validator';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import { CreateSoundPayload } from '#app/sounds/schemas/create-sound-payload';
import { CreateSoundService } from '#app/sounds/services/create-sound-service';
import { createHandlers } from '#helpers/hono-helpers';
import { flashDecodeErrors } from '#providers/flash/helpers/flash-helpers';
import { Home } from '#views/pages/home-page';

export const get = createHandlers((context) => context.render(<Home />));

export const post = createHandlers(
  validator('form', (form, context) => {
    const validateForm = pipe(
      CreateSoundPayload.decodeUnknown(form),
      Effect.tapError((error) => Effect.succeed(flashDecodeErrors(error))),
      Effect.catchAll(() => Effect.succeed(context.render(<Home />))),
    );

    return Effect.runSync(validateForm);
  }),
  async (context) => {
    const form = context.req.valid('form');

    const createSound = pipe(
      Effect.flatMap(CreateSoundService, (service) => service.create(form)),
      Effect.provide(CreateSoundService.Live),
      Effect.provide(SoundRepository.live(context.var.drizzle)),
      Effect.provide(context.var.BucketLive),
    );

    await Effect.runPromise(createSound);

    return context.render(<Home />);
  },
);
