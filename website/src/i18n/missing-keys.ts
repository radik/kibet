/**
 * Lists the translations that still fall back to English:
 *
 *   node src/i18n/missing-keys.ts
 *
 * Node 22.18+ runs this TypeScript file directly (type stripping), which is
 * why the imports below carry `.ts` extensions. Reports, per locale, missing
 * dictionary keys, placeholder sets that differ from English, and model texts
 * (src/data/models.ts) without a translation. Sets exit code 1 if any of
 * those exist, so it can later gate a release.
 */
import { LOCALES } from './locales.ts';
import { FALLBACK_LOCALE, dictionaries, missingKeys } from './ui.ts';
import type { UIKey } from './ui.ts';
import { MODELS } from '../data/models.ts';

function placeholders(template: string): string {
  return [...template.matchAll(/\{(\w+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(', ');
}

const reference = dictionaries[FALLBACK_LOCALE];
let problems = 0;

for (const locale of LOCALES) {
  if (locale === FALLBACK_LOCALE) continue;
  const dictionary = dictionaries[locale];

  const missing = missingKeys(locale);
  const mismatched = (Object.keys(dictionary) as UIKey[]).filter(
    (key) =>
      placeholders(dictionary[key] ?? '') !==
      placeholders(reference[key] ?? ''),
  );
  const modelTexts = MODELS.flatMap((model) =>
    (['description', 'about'] as const)
      .filter((field) => model[field][locale] === undefined)
      .map((field) => `${model.slug}.${field}`),
  );

  problems += missing.length + mismatched.length + modelTexts.length;
  console.log(
    `${locale}: ${missing.length} UI keys and ${modelTexts.length} model texts fall back to ${FALLBACK_LOCALE}`,
  );
  for (const key of missing) console.log(`  ${key}`);
  for (const key of modelTexts) console.log(`  model: ${key}`);
  for (const key of mismatched) {
    console.log(`  placeholders differ from ${FALLBACK_LOCALE}: ${key}`);
  }
}

const runtime = (globalThis as { process?: { exitCode?: number } }).process;
if (problems > 0 && runtime) runtime.exitCode = 1;
