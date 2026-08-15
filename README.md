# Study Sprint — Focus Session Tracker

A focus timer app built for the Web Dev Internship task — rebuilding a Figma-style mock into a real, working, responsive page with dark mode, accessibility support, and interactive states.

**Live site:** https://web-development-internship-task2.vercel.app/

## What it does

- Pick a sprint length (25 min sprint, 50 min deep work, or a 5 min break)
- Start, pause, and reset the timer — shown on a split-flap style board
- When a sprint finishes, a small chime plays and you can name the session before saving it to today's log (or leave it blank and it saves as "untitled task")
- Toggle between light and dark mode — colors are driven by CSS variables, not hardcoded
- Works on mobile, tablet, and desktop with a real layout reflow, not just shrinking things down

## How to run it locally

npm install
npm run dev

Then open the local link it prints (usually http://localhost:5173).

To build for production:

npm run build

## Project structure

src/
  App.tsx                 all the state + layout logic
  types.ts                shared TypeScript types
  index.css               design tokens for light/dark mode
  components/
    Button.tsx             button with hover/focus/loading/disabled states
    TimerBoard.tsx          the digit display
    FlapDigit.tsx           a single digit tile
    DurationPicker.tsx      the duration selector buttons
    ProgressIndicator.tsx   progress bar
    StatBadge.tsx           the Today/Streak/Sprints tiles
    LogRow.tsx              one row in the session log
    ThemeToggle.tsx         light/dark switch
    ErrorAlert.tsx          shows up if saving fails

Repeating pieces (duration buttons, log rows, stat tiles) are each their own component instead of copy-pasted markup, so there's one place to update each one.

## Decisions I made where the design wasn't 100% clear

- **Breakpoints**: the design only really called out two screen sizes, so I used 640px as the mobile and tablet cutoff and 1024px as tablet to desktop — that's where the two-column layout actually needed the extra room.
- **Hover effects**: these were originally going to be handled with JS mouse events, but I switched to plain CSS hover states instead, since that also respects disabled buttons automatically and works better across devices.
- **Naming a sprint**: the original mock didn't have a way to name a session before saving it, so I added a simple text input that shows up once a sprint finishes.
- **End-of-sprint sound**: added a short two-tone chime (generated in the browser, no audio file needed) so you know when time's up without watching the screen.

## Bugs I found and fixed along the way

- **Dark mode wasn't switching.** The CSS was scoped to `:root`, which only ever refers to the actual `<html>` tag — but the theme attribute was being set on a `<div>` inside the app, so the dark mode styles never matched. Fixed by targeting the attribute directly instead of through `:root`.
- **Missing `<main>` landmark.** Lighthouse flagged that the page had no main content region for screen readers. Wrapped the core content in a `<main>` tag.
- **Mismatched button label.** The dark mode toggle had both a visible text label ("Light"/"Dark") and a separate `aria-label` that said something different — confusing for screen readers. Removed the duplicate label so the visible text is the accessible name.
- **Contrast failures.** A few text/background color combinations (amber and teal text on their tinted backgrounds, and the error message color) didn't meet WCAG AA contrast minimums. Added slightly darker "ink" versions of those colors used only for text, while keeping the original brighter colors for backgrounds and decoration.
- **Progress bar had no accessible info.** It was marked `aria-hidden` with nothing to replace it for screen reader users. Gave it a proper `role="progressbar"` with a live percentage value instead.

## Lighthouse results

Final scores on the deployed site (incognito, production build):
- **Accessibility: 100**
- Best Practices: 100
- SEO: 100
- Performance: ~80s (varies a bit per run — not required by the task, but solid)

Run it yourself:

npm run build && npm run preview
# then run Lighthouse in Chrome DevTools against the printed URL, in an incognito window

## Deploying

npm run build
npx vercel --prod

Or connect the GitHub repo to Vercel for automatic deploys on every push.
