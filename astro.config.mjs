// @ts-check
import { defineConfig } from 'astro/config';

// Publicado em https://valantien.github.io/cemef/ (decisão P1 / D8).
export default defineConfig({
  site: 'https://valantien.github.io',
  base: '/cemef',
  trailingSlash: 'always',
  output: 'static',
});
