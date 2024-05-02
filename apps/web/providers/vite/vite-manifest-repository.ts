import { Context, Data, Effect, Layer, Request, RequestResolver } from 'effect';
import type { Manifest } from 'vite';

const MANIFEST_PATH = '/.vite/manifest.json';

class GetManifestError extends Data.TaggedError('GetManifestError') {}

interface GetManifest extends Request.Request<Manifest, GetManifestError> {
  readonly _tag: 'GetManifest';
}
const GetManifest = Request.tagged<GetManifest>('GetManifest');

export class ViteManifestRepository extends Context.Tag('ViteManifestRepository')<
  ViteManifestRepository,
  {
    readonly get: () => Effect.Effect<Manifest, GetManifestError>;
  }
>() {
  static live(assets: Fetcher, currentUrl: string): Layer.Layer<ViteManifestRepository> {
    const url = new URL(MANIFEST_PATH, currentUrl);

    const resolver = RequestResolver.fromEffect<never, GetManifest>(() => {
      return Effect.tryPromise({
        try: () => assets.fetch(url).then((response) => response.json<Manifest>()),
        catch: () => new GetManifestError(),
      });
    });

    return Layer.succeed(ViteManifestRepository, {
      get: () => Effect.request(GetManifest({}), resolver),
    });
  }
}
