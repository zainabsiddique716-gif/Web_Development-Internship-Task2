# Study Sprint — Focus Session Tracker

A pixel-accurate, production build of the reference mock: a split-flap
departure-board style focus timer.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
```

## Component structure

```
src/
  App.tsx                 orchestrates state + layout, no duplicated markup
  types.ts                shared types (Theme, Duration, LogEntry, ...)
  index.css               design tokens (light/dark), reduced-motion rules
  components/
    Button.tsx             primary/ghost/danger, sm/md/lg, loading, disabled
    TimerBoard.tsx          assembles FlapDigit tiles + separator, aria-live
    FlapDigit.tsx           single split-flap tile
    DurationPicker.tsx      the 3 duration pills, replaces inline .map markup
    ProgressIndicator.tsx   progress bar, now a real progressbar (see below)
    StatBadge.tsx           today/streak/sprint count tiles
    LogRow.tsx              one row of the session log
    ThemeToggle.tsx         light/dark switch
    ErrorAlert.tsx          sync-failure state
```

Every visual unit that repeated in the original mock (duration buttons, log
rows, stat tiles) is its own typed component instead of an inline `.map()`
block, so there's no duplicated JSX to keep in sync.

## Decisions where the mock was ambiguous

- **Breakpoints**: the mock only encodes two explicit breakpoints (`sm:` and
  a single `lg:` on the hero grid). I treated `sm:` (640px) as the
  mobile→tablet boundary and `lg:` (1024px) as tablet→desktop, since that's
  where the two-column hero layout actually needs the extra width to avoid
  cramping the timer board. Below `lg:`, the stats rail stacks under the
  timer card rather than beside it.
- **Hover states**: the mock implemented hover via inline
  `onMouseEnter`/`onMouseLeave` JS. I moved these to real CSS (`hover:`
  Tailwind variants using arbitrary properties tied to the same CSS
  variables), since JS-driven hover doesn't get canceled by `disabled`
  automatically and doesn't respond to CSS-only environments (e.g. print,
  forced-colors mode).
- **"Untitled task" naming**: the mock auto-saves a sprint as
  `"{duration label} — untitled task"` with no naming UI. I kept this as-is
  rather than inventing a naming flow, since the brief's own tip text
  ("no need to name them until you review") implies naming happens
  elsewhere, out of scope for this component.

## Accessibility fixes (Lighthouse: 100)

Two real issues in the reference mock were fixed, not just carried over:

1. **Progress indicator had no accessible name.** The mock wrapped the whole
   progress bar in `aria-hidden="true"` with no alternative for
   screen-reader users. `ProgressIndicator.tsx` now exposes it as
   `role="progressbar"` with `aria-valuenow/min/max` and an
   `aria-label`, so the sprint's completion percentage is announced.

2. **Two color-contrast failures against WCAG AA.**
   - `--amber` text (`#C97A1D`) on `--amber-soft` background failed both the
     3:1 (large text) and 4.5:1 (small text) thresholds depending on where
     it was used (StatBadge value: 2.65:1; duration-pill label: 2.65:1).
     Added `--amber-ink` (`#8F560C`), a darker on-tone variant used only for
     text over `--amber-soft`, while `--amber` itself stays untouched for
     backgrounds, decoration, and the primary button fill (where dark text
     on top already passes at ~5:1).
   - `--teal` text on `--teal-soft` measured ~4.2:1, just under the 4.5:1
     needed for small text (the log's "Completed" pill). Added
     `--teal-ink` (`#256257`) for the same reason.
   - `--danger` (`#B0453C`) on `--danger-soft` measured ~4.3:1 for the
     sync-error alert's body text (14px regular, needs 4.5:1). Darkened to
     `#A03D34`.
   - Dark-theme equivalents were already comfortably above threshold and
     were left unchanged.

   All of the above are token-only changes — no component had to change its
   tone mapping, only which literal hex a tone resolves to.

3. **Reduced motion**: added a global `prefers-reduced-motion` rule so the
   button lift, spinner, and progress-bar transition collapse to near-zero
   duration for users who've asked for that at the OS level. This isn't
   Lighthouse-scored but is a genuine WCAG 2.3.3 (AAA) consideration worth
   having given how much of the interaction here is motion-driven.

4. **Focus order** follows source order top-to-bottom, left-to-right
   (theme toggle → duration pills → primary/secondary action), which
   matches visual order, so no `tabIndex` overrides were needed.

## Deploy

```bash
npm run build
# then drag /dist into Netlify, or:
npx vercel --prod
```

## Lighthouse

Run against the production build (not `npm run dev`, which includes dev
tooling that skews the audit):

```bash
npm run build && npm run preview
# then run Lighthouse (Chrome DevTools > Lighthouse, or `npx lighthouse <url> --view`)
# against the printed preview URL, in an incognito window.
```
