# nikaqil.com

Nik Aqil's portfolio and resume: a static Angular site that looks like a code editor around calm content. A visitor should learn who Nik is, what Nik does and see proof within about a minute.

- Design source: the "Portfolio screens" canvas (https://claude.ai/artifact/H4NyHhtT19TVbezuCWshTa).
- Design rules: [`.claude/skills/frontend-design/SKILL.md`](.claude/skills/frontend-design/SKILL.md). Read it before changing any UI.

## Stack

Angular 22 (zoneless, standalone, signals) with `outputMode: static` prerendering, GSAP for motion, Angular i18n with one build per language, JetBrains Mono as the only font. No backend. Planned host: Cloudflare Pages, with GitHub Pages in the meantime.

## Commands

```bash
npm install
npm start               # dev server, English only, http://localhost:4200
npm run build           # production build of all three languages into dist/portfolio/browser
npm run preview         # serve the production build at http://localhost:3000
npm run check           # format, lint, typecheck, unit tests and build: run before every commit
npm run i18n:extract    # refresh src/locale/messages.json after changing any text
npm run fonts           # rebuild public/fonts after adding a symbol to the copy
```

`npm run build` also runs `scripts/finalize-build.mjs`, which turns the prerendered `/404` page into `404.html` for each language. Static hosts serve that file for unknown URLs.

## Layout

```
src/styles/        tokens.css (all sizes, spacing, colour, motion), then base, frame and component styles
src/app/core/      theme, language, SEO titles and meta, page-enter motion, site settings, file tree model
src/app/shell/     the editor frame: tab bar, file tree, status bar, finder (Search, Ctrl K)
src/app/pages/     home, case study, stack, referrals, about, contact, resume, not found
src/locale/        messages.json (English source), messages.ms.json and messages.kel.json
public/            fonts, favicon, resume.pdf
```

## Rules that keep it consistent

- **Tokens only.** Components never type a pixel, hex or duration. Add a token to `src/styles/tokens.css` and keep `.claude/skills/frontend-design/tokens.css` identical.
- **One font.** JetBrains Mono, weights 400, 500 and 700, self-hosted and subset.
- **Light and dark, and a phone layout, on every page.** Dark follows the system until the visitor uses the toggle; the choice is saved in `localStorage` and applied by an inline script in `index.html` before first paint.
- **File names are never translated.** `home.md`, `stack.json` and the rest stay in English in every language. Everything else goes through i18n.
- **Placeholders stay in [brackets]** until Nik supplies real copy. Never invent quotes, numbers, employers or dates.
- **Content works without JavaScript.** Motion starts only after a client-side navigation, and only when the visitor allows motion.

## Languages

English lives at the root, Malay at `/ms/` and Kelantan at `/kel/`. The language switcher links to the same page in each language.

Translations are plain JSON: `{ "locale": ..., "review": ..., "translations": { "home.comment": "..." } }`. Each id names the page and the text, so the file reads top to bottom by page. `{$START_LINK}` and `{$CLOSE_LINK}` mark a link inside a sentence: keep every marker, and move them if the words move.

1. Change or add text in a template, using `i18n` with an `@@id`, or `$localize` in code.
2. Run `npm run i18n:extract`. It rewrites `src/locale/messages.json`, sorts all three files by id, and lists the ids to add to or delete from the other two.
3. Translate them in `messages.ms.json` and `messages.kel.json`. The production build fails on a missing translation, and `npm test` checks that the files match the source, including the link markers.

Review status lives in each file's `review.status` (`draft`, `not-reviewed` or `reviewed`):

- Bahasa Melayu is a draft written for review. Read it through before launch, then set its status to `reviewed`.
- Kelantan is **not reviewed**. Every translation is a copy of the Malay draft. A fluent Kelantan speaker must rewrite it, then set the status to `reviewed`. Do not present it as final.
- Kelantan has no registered language subtag, so its build uses the private-use tag `ms-x-kel` for `lang` and `hreflang`. The URL path is `/kel/`.

## Filling in the placeholders

- `src/app/core/site.ts`: GitHub, LinkedIn, public email and the contact form endpoint. While a value is `null` the page shows a bracketed placeholder instead of a dead link. The contact form reports "not sent" until `contactEndpoint` is set.
- `public/resume.pdf` is a placeholder file. Replace it with the real resume.
- The second and third projects need pages. Add a route in `src/app/app.routes.ts`, a file in `PROJECT_FILES` in `src/app/core/nav.ts`, and point the Stack page at it.
- The MoneyTracker sandbox and demo video go in the "Demo" section of the case study.

## Deploying to GitHub Pages (temporary)

While the site is in development, `.github/workflows/pages.yml` publishes it to GitHub Pages on every push to `main`, and on demand from the Actions tab (**Run workflow**). It is meant to be thrown away when the site moves to Cloudflare Pages.

One-time setup, in the repository on GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**. Until that is set, the workflow stops at its "Read the Pages address" step and says so. The site then lives at `https://<owner>.github.io/<repository>/`, with Malay at `/ms/` and Kelantan at `/kel/`.

The workflow:

1. Runs `format:check`, `lint`, `typecheck` and `test` on the unmodified sources.
2. Reads the site address from GitHub. A repository site lives under `/<repository>/`, but the sources link to `/fonts`, `/resume.pdf` and `/ms` as if the site sat at the root. `scripts/github-pages.mjs rebase` rewrites those links in the CI checkout (nothing is committed) and `ng build --base-href` sets the `<base>` of each language.
3. Builds the three languages, then runs `scripts/github-pages.mjs verify`, which fails the deploy if a root link or a wrong `<base>` is left in the output.
4. Uploads `dist/portfolio/browser` and deploys it.

Good to know:

- GitHub Pages serves one `404.html` (the English one at the root) for every unknown URL, so `/ms/` and `/kel/` do not get their own not-found pages here. Cloudflare Pages does.
- While the site is hosted there, canonical and `hreflang` links point at the GitHub Pages address, not `nikaqil.com`.
- A repository named `<owner>.github.io` is served from the root with no base path. The same workflow handles it.
- The `github-pages` environment only accepts deployments from `main` until another branch is allowed under **Settings > Environments**.
- To try the build by hand, use a throwaway clone, because `rebase` edits the sources:

```bash
node scripts/github-pages.mjs rebase https://example.github.io /Portfolio
npx ng build --base-href /Portfolio/ && node scripts/finalize-build.mjs
node scripts/github-pages.mjs verify /Portfolio
```

To remove it, delete `.github/workflows/pages.yml`, `scripts/github-pages.mjs` and this section, and turn Pages off in the repository settings. Nothing in `src/` or `angular.json` knows about GitHub Pages.

## Deploying to Cloudflare Pages

Build command `npm run build`, output directory `dist/portfolio/browser`. No server is needed. Cloudflare Pages serves the nearest `404.html`, so `/ms/` and `/kel/` get their own not-found pages (check this on the first deploy).
