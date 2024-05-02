import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./views/**/*.tsx'],
  outExtension: 'js',
  theme: {
    extend: {
      tokens: {
        fonts: {
          inconsolata: {
            value: 'var(--font-inconsolata), sans-serif',
          },
        },
      },
      textStyles: {
        title: {
          value: {
            fontSize: '3xl',
            lineHeight: '1',
            fontVariationSettings: '"wght" 500',
          },
        },
        subtitle: {
          value: {
            fontSize: '2xl',
            lineHeight: '1',
            fontVariationSettings: '"wght" 500',
          },
        },
      },
      layerStyles: {
        cell: {
          value: {
            padding: '10',
            backgroundColor: 'zinc.900',
          },
        },
      },
    },
  },
});
