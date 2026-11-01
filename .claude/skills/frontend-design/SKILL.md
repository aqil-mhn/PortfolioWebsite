---
name: frontend-design
description: Use when designing or building any visible UI or visitor flow for the Portfolio site, including pages, the editor-style frame, navigation, layout, typography, colour, light and dark mode, motion, GSAP effects, the language switcher, the MoneyTracker sandbox, or when a result looks generic, templated or AI-made.
---

# Frontend design for Nik's portfolio

The site is a public resume for hiring managers and recruiters, in Malaysia and abroad. A visitor should learn who Nik is, what Nik does and see proof within about a minute. Design serves that skim first and personality second.

**Direction: an editor frame around calm content.** The site looks like a code editor. A file tree is the menu, tabs show where the visitor is, and a status bar holds language and theme. Inside the frame, content is quiet and typographic. The home page is one large sentence whose highlighted words are links. Nik chose this on 2026-10-31 from five directions, approved light and dark versions of every page plus phone layouts, and rejected the usual header with a big title on the left and navigation on the right.

Stack facts: Angular with `outputMode: static` prerendering, GSAP for motion (Three.js for at most one lazy scene), Angular i18n with one URL path per language (English at the root, then Malay, then Kelantan), Cloudflare static hosting, no backend. The repo is new; where existing code differs from this guide, follow the code and update this file.

## Nik's rules

1. **One font only: JetBrains Mono** (weights 400, 500, 700). No serif and no second family.
2. **Everything is consistent across every page and screen.** Padding, margin, spacing, type and colour come from `tokens.css` in this folder. Never type a one-off pixel or hex value; change or add a token, then check every screen that uses it.
3. **Light and dark mode on every screen, and a phone layout for every page.**
4. Placeholder text stays in [brackets] until Nik supplies real copy. Never invent quotes, numbers, employers or dates.

The reference designs are the "Portfolio screens" canvas: https://claude.ai/artifact/H4NyHhtT19TVbezuCWshTa (tokens board, eight desktop pages and four phone screens, each in light and dark). When the code and the canvas disagree, ask Nik which one is right.

## Before building

State the design intent in two or three sentences: which step of the visitor flow (see User flow and UX) the screen serves, which page pattern below it follows, and which tokens it reuses. Import `tokens.css`, use its custom properties and add a token before hardcoding a value.

## The frame (identical on every page)

- **Tab bar, 48px.** `home.md` first, then the current page as the active tab (home shows only itself). A Search button sits on the right; Ctrl K is only a shortcut, and the button works by touch and keyboard. Build the finder last; the file tree is the fallback.
- **File tree, 288px sidebar, the only menu.** `nikaqil.com` containing `home.md`, `projects/` (`moneytracker.md`, then the other projects), `stack.json`, `referrals.md`, `about.md`, `resume.pdf`, `contact.md`. Same order and labels on every page; the current page has `aria-current="page"` and a left accent bar. File names are part of the visual idea and stay in English in every language; Nik decided this on 2026-10-31, so do not put them through i18n.
- **Status bar, 48px, accent background.** `<Section> · <file> · UTF-8`, then "Open from [date]", then the EN, BM and KEL links and the Light and Dark toggle.
- **Phone.** The tree moves behind a "Files" button in the top bar and opens as a full-screen list; the status bar keeps only language and theme. Content is a single column.
- **404** is `not-found.md`: title, one line, and links to home.md, the case study and contact.md.

## Page patterns

| Page       | Pattern                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home       | Breadcrumb and a `//` comment line, then the display sentence (the `h1`) with links on the key words and a static accent block cursor at the end, then three cards: stack.json, the featured project, one referral |
| Case study | Title, lead, then `##` sections (the problem, decisions, what I would change); a side panel with the screenshot or video, the sandbox button, the stack used and the next project                                  |
| Stack      | Three cards (frontend, backend, data and tools); every tool is paired with a link to the project that shows it                                                                                                     |
| Referrals  | Quote cards with name, role, organisation and year, plus a card "References available on request"                                                                                                                  |
| About      | First-person lead, dated experience and education lists, a resume card and a contact card                                                                                                                          |
| Contact    | Name, email and message form with visible labels and sending, sent and failed states; a side list with email, resume, GitHub and LinkedIn                                                                          |
| Resume     | A preview, a Download PDF button and file details (pages, date, size)                                                                                                                                              |

Every page starts with the breadcrumb (`nikaqil.com / page`) and a `//` comment line in the meta style, then the title (or the display sentence on the home page).

## Typography, spacing and layout

Type scale (size/line height, weight). The values live in `tokens.css`.

| Role       | Size                     | Use                                        |
| ---------- | ------------------------ | ------------------------------------------ |
| Display    | 44/56, 500 (phone 26/34) | The home sentence only                     |
| Title      | 64/64, 700 (phone 36/40) | Page title, one per page                   |
| Card title | 24/32, 700               | Titles inside cards                        |
| Lead       | 24/36, 400 (phone 18/28) | The sentence under a title                 |
| Heading    | 16/24, 700               | `##` section headings with an amber prefix |
| Body       | 15/24, 400               | Paragraphs and code lines                  |
| UI         | 14/20, 500               | Links, buttons, rows, file tree            |
| Meta       | 13/20, 400               | Breadcrumbs, comments, hints               |
| Label      | 12/16, 500, uppercase    | Card labels and the tree heading           |

- Negative letter spacing only on display, title, card title and lead.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64. Page padding 48 sides and 32 top and bottom (phone 16 and 24). Card padding and the gap between cards are 24; the gap between sections is 32. Radius 8, small controls 4.
- Self-host the three font files, subset to the characters in use, `font-display: swap`, and preload only the 500 weight. Use `font-variant-numeric: tabular-nums` for figures, since MoneyTracker makes numbers a motif.
- Body text is 15px or larger and lines stay under about 75 characters.

## Colour and theme

- Ten colour tokens per theme (bg, panel, bar, text, mute, accent, amber, line, select, focus). Accent green is for links, the active tab and the status bar. Amber is only for syntax-like details (`## ` prefixes, code values). Focus is a 3px blue ring, in every theme.
- Text contrast at least 4.5:1 in both themes. Check dark as carefully as light.
- Links are accent coloured and underlined; in the display sentence they are also bold.
- The theme follows `prefers-color-scheme` until the visitor uses the toggle. The toggle sets `data-theme` on `<html>` and is remembered in `localStorage` inside `try/catch`. Apply the saved choice with a tiny inline script in `index.html` before first paint, so prerendered pages never flash the wrong theme.

| Generic default                                              | Do this instead                                                               |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| A header with a big title on the left and links on the right | The editor frame: file-tree menu, tabs, status bar                            |
| Purple-to-blue gradient, gradient text, glowing blobs        | Flat neutrals plus one accent; contrast comes from scale and weight           |
| Inter or system sans, or a second display face               | JetBrains Mono only                                                           |
| Three identical icon cards under a centered hero             | The display sentence, then three cards with different content                 |
| Glass cards, heavy shadows, rounded everything               | Hairlines, spacing and type hierarchy; the radius tokens                      |
| Emoji, stock illustration, "passionate developer" copy       | Screenshots, diagrams and specific sentences about what Nik built and decided |
| Eight to twelve small projects                               | Three or four strong ones with a case study; never a dead demo link           |

## Content

- The home sentence carries name, role (Full Stack Developer; data skills are a secondary strength shown in one case study), location, availability and the stack keywords. Write the whole sentence as one i18n message with the links inside it, so Malay and Kelantan can reorder the words.
- Case study order: motivation, stack with one architecture picture, two or three decisions with the trade-off, demo, challenges, what Nik would improve. Impact claims need real numbers.
- The MoneyTracker sandbox is read-only, runs in the browser on bundled sample data and makes no network calls. It has a visible "sample data" label, works by keyboard, and every chart has a text alternative (a summary or data table) and never relies on colour alone. Format currency as RM with the locale pipes. Sample figures are labelled as sample data and never imply real accounts.
- Ask Nik for personal or cultural references; do not invent motifs or stereotypes.

## User flow and UX

Design the flow before the screen. Every screen answers one visitor question; cut what answers none. The visitors are a recruiter skimming for fit, a hiring manager or engineer checking depth, and a Malay-speaking visitor who wants the same site in their language.

| Step      | Visitor asks                                 | The page answers                                                                                                                                         |
| --------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Land      | Who is this, and is the work relevant to me? | The home sentence and the availability line, without scrolling                                                                                           |
| Verify    | Is there proof?                              | Three kinds, in this order: projects with a one-line outcome, a tech stack whose tools link to the projects that used them, and referrals and background |
| Go deeper | How are decisions made?                      | Case study, demo and code links, then the next project                                                                                                   |
| Act       | How do I get in touch or save the resume?    | Email link, resume PDF, GitHub and LinkedIn on the contact page, the home cards and the end of each case study                                           |

- Tech stack: group by area (frontend, backend, data and tools) and show each tool with the project that uses it. No skill bars, percentages or star ratings. List only tools Nik confirms.
- Referrals: show a quote only with the person's permission, with name, role, organisation and year. If there are none yet, show "References available on request" and an email link. Never invent a quote.
- Experience and education sit in About as a short dated list, with "Full list in the resume".
- One primary action per screen (the display sentence's contact link on home, "Try the sandbox" on a case study). Secondary links are visually quieter.
- No dead ends. Every page ends with a next step (next project or contact), and the 404 offers home, the case study and contact in the visitor's language.
- Every page has its own shareable URL. The back button restores scroll position, and the language switcher keeps the visitor on the same page.
- Label links by destination ("Live demo", "Resume, PDF") and mark downloads. Buttons are verbs. Error text says what to do next. All of this copy goes through i18n.
- The sandbox has an obvious entry ("Try the sandbox"), needs no sign-up, shows loading, empty and error states, and offers a reset and a way back to the case study. On a phone where it is too cramped, lead with the demo video.
- No arrival modals, autoplay media or scroll-jacking.
- Optional: privacy-friendly analytics on resume downloads and GitHub or LinkedIn clicks show whether the flow works.

## Motion (GSAP)

- Content must be readable with no JavaScript and no animation: view-source shows real text, and nothing is hidden in CSS waiting for a script. Start from the final state and animate toward it, or add the hidden state from JS.
- The home cursor block is static by default; it may blink only under `(prefers-reduced-motion: no-preference)`, and it is `aria-hidden`.
- Run browser-only code in `afterNextRender`. Wrap setups in `gsap.context()` and call `revert()` on destroy.
- Gate all effects with `gsap.matchMedia()` and `(prefers-reduced-motion: no-preference)`. Under reduced motion show the end state at once.
- Animate `transform` and `opacity` only. Short, purposeful, eased; one easing and duration set in tokens. Refresh ScrollTrigger after fonts and images load.
- Heavy scenes (Three.js, large sequences) load with `@defer` or dynamic `import()`, with a static fallback shown first. They must not delay the first screen. Target Lighthouse performance 90 or higher with effects on, and a page that loads in under 2 seconds.
- Split text (SplitText) must keep one accessible name on the parent; verify with a screen reader or the accessibility tree.
- Hover-only effects need a tap and keyboard equivalent.

## Languages (English, Malay, Kelantan)

- The only strings that are not translated are the file names in the tree, tabs, breadcrumb and status bar (`home.md`, `stack.json`, `contact.md`). Everything else goes through Angular i18n.
- Every visible string goes through Angular i18n: `i18n` attributes, `$localize`, and the `i18n-alt`, `i18n-aria-label` and `i18n-title` variants. This includes page titles, meta descriptions and Open Graph text. Never concatenate translated fragments; use ICU expressions for plurals and the locale pipes for dates and numbers.
- Layouts must not depend on English length. Budget roughly a third more width for Malay and Kelantan, and use no fixed-width buttons or truncated labels. The display sentence must still fit when it grows.
- The language switcher is a set of real links to the same page in each language, with `lang` and `hreflang` set and each name written in its own language. Static output does not redirect by browser language.
- Kelantan copy is a draft until a fluent speaker reviews it. Mark unreviewed strings in the translation file and the pull request, and do not present them as final.
- Every route has a prerendered 404 per language. Enable `withI18nSupport()` so translated components still hydrate.

## Accessibility and responsiveness

- One `h1` per page, logical heading order, landmarks (the file tree is `nav` with an accessible name), a skip-to-content link, visible focus styles, everything reachable by keyboard, labelled form fields, alt text on meaningful images.
- Links inside the display sentence need descriptive accessible names ("Angular projects", not just "Angular"), because screen readers list links out of context. The file tree stays the complete, plain way to navigate.
- Touch targets at least 44 by 44 CSS pixels (WCAG 2.2 AA minimum is 24 by 24).
- Mobile first. Design at 360px wide first, no horizontal scroll, `dvh` for full-height areas. Images in WebP or AVIF with intrinsic dimensions, responsive sizes and lazy loading below the fold (`NgOptimizedImage`).

## Done check

Before calling UI work finished, confirm each item and say which were not checked:

1. View-source shows the text for the page in each built language.
2. Reduced motion on: page is complete and nothing moves.
3. Keyboard-only pass with focus visible; contrast at least 4.5:1 in light and in dark.
4. 360px viewport with the longest (Malay) strings: no overflow or clipped text, and the Files menu works.
5. Lighthouse and axe run on the built output, not just the dev server.
6. No literal colours, sizes, spacing or durations: everything comes from `tokens.css`, and JetBrains Mono is the only font.
7. The page matches the frame and its pattern in the "Portfolio screens" canvas, in both themes.
8. Each flow step works end to end on a phone in every language, and someone unfamiliar with Nik can say in one sentence what Nik does.
