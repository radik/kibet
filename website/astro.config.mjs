import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kibet.eu',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Never emit <style> blocks into the HTML: public/_headers has no
    // 'unsafe-inline' for style-src.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline assets or small scripts into the HTML (or as data: URIs):
      // script-src and img-src in public/_headers allow 'self' only.
      assetsInlineLimit: 0,
    },
  },
  i18n: {
    locales: ['en', 'de', 'ru', 'fr', 'tt'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
