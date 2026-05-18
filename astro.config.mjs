// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://even-admin.github.io',
  base: '/Lumisis',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Inline every page's full CSS into a <style> block in <head>.
  // Eliminates the FOUC race during ClientRouter view-transition swaps
  // when the external stylesheet would otherwise load async.
  build: {
    inlineStylesheets: 'always',
  },

  integrations: [mdx(), sitemap(), react()],
});