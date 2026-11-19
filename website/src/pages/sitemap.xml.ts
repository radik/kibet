/**
 * /sitemap.xml, generated at build time. Every home and model page in all
 * locales, and the legal pages in the locales that have them, each with
 * `xhtml:link` alternates (hreflang) and an x-default. The alternates are the
 * same ones BaseLayout writes into <head>.
 */
import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from '../i18n/locales.ts';
import { LEGAL_LOCALES, localeLinks } from '../i18n/paths.ts';
import { MODELS, modelPath } from '../data/models.ts';

interface Entry {
  /** Locale-neutral path. */
  readonly path: string;
  readonly locales?: readonly Locale[];
}

const ENTRIES: readonly Entry[] = [
  { path: '/' },
  ...MODELS.map((model) => ({ path: modelPath(model.slug, DEFAULT_LOCALE) })),
  { path: '/impressum/', locales: LEGAL_LOCALES },
  { path: '/datenschutz/', locales: LEGAL_LOCALES },
];

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs must set `site`.');
  const absolute = (href: string) => escapeXml(new URL(href, site).href);

  const urls = ENTRIES.flatMap(({ path, locales }) => {
    const links = localeLinks(path, locales).filter((link) => link.available);
    const defaultLink =
      links.find((link) => link.locale === DEFAULT_LOCALE) ?? links[0];
    const alternates = [
      ...links.map(
        (link) =>
          `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[link.locale].htmlLang}" href="${absolute(link.href)}" />`,
      ),
      ...(defaultLink
        ? [
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(defaultLink.href)}" />`,
          ]
        : []),
    ].join('\n');
    return links.map(
      (link) =>
        `  <url>\n    <loc>${absolute(link.href)}</loc>\n${alternates}\n  </url>`,
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
