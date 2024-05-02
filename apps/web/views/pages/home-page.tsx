import { Effect, pipe } from 'effect';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import { SoundRepository } from '#app/sound/sound-repository';
import { SoundService } from '#app/sound/sound-service';

export const Home: FC = async () => {
  const context = useRequestContext();

  const getSounds = pipe(
    Effect.flatMap(SoundService, (service) => service.list()),
    Effect.provide(SoundService.Live),
    Effect.provide(SoundRepository.live(context.var.drizzle)),
    Effect.provide(context.var.BucketLive),
  );

  const sounds = await Effect.runPromise(getSounds);

  return (
    <div>
      {sounds.map((sound) => (
        <div key={sound.id}>{sound.fileUrl}</div>
      ))}
    </div>
  );
};
