import { Effect, pipe } from 'effect';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import { Vite } from '#providers/vite/vite-service';

export const useViteAssetPath = (path: string | undefined): Promise<string | undefined> => {
  const context = useRequestContext();

  const getAssetPath = pipe(
    Effect.flatMap(Vite, (vite) => vite.getAssetPath(path)),
    Effect.catchAll(() => Effect.succeed(path)),
    Effect.provide(context.var.ViteLive),
  );

  return Effect.runPromise(getAssetPath);
};

export const Stylesheet: FC<Hono.LinkHTMLAttributes> = async (props) => {
  const { href, ...rest } = props;
  const assetPath = await useViteAssetPath(href);

  return <link rel="stylesheet" type="text/css" href={assetPath} {...rest} />;
};

export const Script: FC<Hono.ScriptHTMLAttributes> = async (props) => {
  const { src, ...rest } = props;
  const assetPath = await useViteAssetPath(src);

  return <script src={assetPath} {...rest} />;
};

export const Image: FC<Hono.ImgHTMLAttributes> = async (props) => {
  const { src, ...rest } = props;
  const assetPath = await useViteAssetPath(src);

  return <img src={assetPath} {...rest} />;
};
