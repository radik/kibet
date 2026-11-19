# Kibet website

Static marketing site for kibet.eu, built with Astro and deployed to Cloudflare Workers static assets.

## Prerequisites

- Docker with Compose, and `make`

Do not run `npm` on the host. Every Node command runs inside the container
defined by `Dockerfile` and `compose.yaml`: only this folder is mounted, and
`node_modules` lives in a Docker volume, so third-party package code is never
written to or executed on the host. Node 22 comes from the image
(`.node-version` pins the same version for CI).

## Commands

| Command        | Action                                            |
| -------------- | ------------------------------------------------- |
| `make install` | Install dependencies from the lockfile (`npm ci`) |
| `make dev`     | Dev server on http://localhost:4321               |
| `make build`   | Build to `dist/`                                  |
| `make check`   | Type and template check                           |
| `make lint`    | ESLint                                            |
| `make format`  | Prettier write (`make format-check` to verify)    |
| `make verify`  | Everything CI runs: format, lint, check, build    |
| `make shell`   | Shell in the container, for any other npm command |
| `make clean`   | Remove containers and the dependency volumes      |

Deploys run only in GitHub Actions (`npm run deploy` there), never locally.

## Layout

- `src/layouts/` page layouts
- `src/pages/` routes
- `src/styles/tokens.css` design tokens and `@font-face`; `global.css` reset and base styles
- `public/fonts/` self-hosted brand fonts
- `wrangler.jsonc` Cloudflare static-assets config

## Fonts

All fonts are self-hosted; no third-party font hosts. The only third-party
script is Umami analytics, loaded solely after the visitor opts in.

- Kibet Serif and Kibet Serif Display: copied from `KibetSerif/web/` in the repo root, licence in `public/fonts/OFL.txt`.
- Inter: the `@fontsource-variable/inter` npm package (latin, latin-ext, cyrillic, cyrillic-ext, among others).

## Deploy

CI/CD lives in `.github/workflows/ci.yml`: every PR and push touching `website/**` runs format check, lint, type check and build. Pushes to `main` deploy to Cloudflare (Workers static assets, Worker name `kibet-website`); same-repo PRs get a preview version URL posted as a comment. One-time setup:

1. **API token.** Cloudflare dashboard, Manage Account, Account API Tokens, Create Token. Easiest: use the **Edit Cloudflare Workers** template and restrict the account (and zone) resources to this account and kibet.eu. If you build a custom token instead, it needs at least Account / Workers Scripts / Edit and Account / Account Settings / Read; the template adds more (routes, KV, etc.) that this site does not use. Copy the secret immediately, it is shown once.
2. **Account ID.** Dashboard home, the three-dot menu next to the account name, "Copy account ID" (also shown in the URL `dash.cloudflare.com/<account-id>/...` and on the Workers & Pages overview).
3. **GitHub secrets.** Repo, Settings, Secrets and variables, Actions, New repository secret: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Better: add them as **environment secrets** on `production` (step 4) and also as repository secrets, because the PR preview job does not use the environment and reads repository secrets.
4. **Environment.** Settings, Environments, New environment, name it exactly `production`. Optionally add required reviewers or restrict it to the `main` branch.
5. **First deploy.** Push to `main` once so the Worker `kibet-website` is created. Previews only work after this: a version can only be uploaded to an existing Worker.
6. **Custom domain.** Dashboard, Workers & Pages, `kibet-website`, Settings, Domains & Routes, Add, Custom Domain: `kibet.eu`. kibet.eu must be a zone in the same Cloudflare account and have no conflicting CNAME. Cloudflare creates the DNS record.
7. **www to apex redirect.** In the kibet.eu zone: DNS, add a proxied (orange cloud) record `www` as `A 192.0.2.0` (or `AAAA 100::`). Then Rules, Redirect Rules, create a rule: if hostname equals `www.kibet.eu`, dynamic redirect to `concat("https://kibet.eu", http.request.uri.path)` with status 301 and "preserve query string" on.
8. **Preview URLs.** Version (preview) URLs run on `workers.dev` and are on by default when the `workers.dev` route is enabled. Check Settings, Domains & Routes, that `workers.dev` and Version URLs are Enabled (or set `"preview_urls": true` in `wrangler.jsonc`). They are public; protect them with Cloudflare Access if the content is sensitive.
9. **Branch protection (optional).** Require the `Build` check. Note the workflow is path-filtered, so PRs that touch nothing under `website/` will not report it.

## Headers and CSP

`public/_headers` is read by Cloudflare Workers static assets ([docs](https://developers.cloudflare.com/workers/static-assets/headers/)): security headers on every path, immutable caching for `/_astro/*` and `/fonts/*`, revalidation for everything else. It is not served as a file. Max 100 rules and 2000 characters per line. A request inherits every matching rule and a repeated header is joined with a comma, which is why the long-cache rules detach `Cache-Control` (`! Cache-Control`) before setting it again.

The Content-Security-Policy is strict because the build emits no inline code: `build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0` in `astro.config.mjs` keep all CSS and JS in external files under `/_astro/`. The only relaxation is `style-src-attr 'unsafe-inline'`, for the `style="--swatch: …"` custom properties in `ModelCard.astro`; it covers style attributes only, not `<style>` blocks. Styles set from scripts through `element.style.x = …` are not affected by CSP.

When you change something, check the browser console for `Refused to …` messages on the home page, a model page, a legal page and the 404 page:

- **New third-party host** (analytics, embed, font CDN): add it to the one directive that needs it (`script-src` for scripts, `connect-src` for fetch/XHR, `img-src`, `font-src`, `frame-src`) and nowhere else. Umami currently uses `https://cloud.umami.is` (script) and `https://gateway.umami.is` (events, `connect-src`). If a tracker is configured with `data-host-url`, that host goes in `connect-src`.
- **Inline `<script>`** (including `is:inline`, `define:vars` and JSON-LD): avoid it. Put code in `src/scripts/` and import it from an Astro `<script>` tag. If it cannot be avoided, add its `'sha256-…'` hash to `script-src`; never `'unsafe-inline'`. A hash must be recomputed whenever the script changes.
- **Inline `<style>` or `style` attributes** set in markup: `<style>` blocks in components are fine (Astro emits them as files). Anything that needs an inline `<style>` element needs a hash in `style-src`.
- **Caching:** `/fonts/*` is cached for a year without content hashes, so give a changed font a new file name.
