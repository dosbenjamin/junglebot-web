import type { FC, PropsWithChildren } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import { Script, Stylesheet } from '#providers/vite/helpers/vite-helpers';
import { css } from '#styled-system/css';

export const Base: FC<PropsWithChildren> = (props) => {
  const context = useRequestContext();

  return (
    <html lang="en">
      <head>
        <Stylesheet href="/static/css/index.css" />
        <Script defer src="/static/ts/index.ts" />
      </head>
      <body
        class={css({
          fontFamily: 'inconsolata',
          display: 'grid',
          placeContent: 'center',
          h: 'screen',
          bg: 'zinc.800',
          color: 'white',
        })}
      >
        <main
          class={css({
            w: '4xl',
            h: '2xl',
            display: 'grid',
            gap: '2',
            gridTemplate: 'repeat(6, 1fr) / repeat(2, 1fr)',
          })}
        >
          <header
            class={css({
              display: 'flex',
              alignItems: 'center',
              layerStyle: 'cell',
              gridArea: '1 / span 2',
            })}
          >
            <h1 class={css({ textStyle: 'title' })}>Jungle Soundbot</h1>
          </header>
          <section class={css({ layerStyle: 'cell', gridRow: '2 / -1' })}>
            <h2 class={css({ textStyle: 'subtitle' })}>Derniers sons ajoutés</h2>
            {props.children}
          </section>
          <section class={css({ layerStyle: 'cell', gridRow: '2 / -1' })}>
            <h2 class={css({ textStyle: 'subtitle' })}>Ajouter un son</h2>
            <form method="post" enctype="multipart/form-data">
              <input name="name" placeholder="Nom du son" />
              <p>{context.var.flash.get('errors.name')}</p>
              <input name="author" placeholder="Ton nom/pseudo" />
              <p>{context.var.flash.get('errors.author')}</p>
              <input name="file" placeholder="Fichier" type="file" />
              <p>{context.var.flash.get('errors.file')}</p>
              <button type="submit">Valider</button>
            </form>
          </section>
        </main>
      </body>
    </html>
  );
};
