import { Effect, pipe } from 'effect';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import { SoundRepository } from '#app/sounds/repositories/sound-repository';
import { GetSoundService } from '#app/sounds/services/get-sound-service';

export const Home: FC = async () => {
  const context = useRequestContext();

  const getSounds = pipe(
    Effect.flatMap(GetSoundService, (sound) => sound.getAll()),
    Effect.provide(GetSoundService.Live),
    Effect.provide(SoundRepository.live(context.var.drizzle)),
    Effect.provide(context.var.BucketLive),
  );

  const sounds = await Effect.runPromise(getSounds);

  return (
    <div>
      <div>
        {sounds.map((sound) => (
          <div key={sound.id}>
            {sound.name} ajouté par {sound.fileUrl}
          </div>
        ))}
      </div>
    </div>
  );
};
