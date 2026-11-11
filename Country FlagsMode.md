# PRD: 100-Country Flags ModeBattle (Next.js)

Version 1.0 (Draft) · Based on a frame-by-frame review of the uploaded reference video (58 s, portrait 9:16) · November 11, 2026

## 1. Overview

**Product:** A web app that plays an automated, elimination-style “battle” between country flags. All remaining flags bounce around inside a rotating white ring that has a gap. Flags that fall through the gap are eliminated. The last flag inside wins the round and is added to a “Qualified for Final” leaderboard. Rounds repeat until the qualification list is complete or the session timer ends.

**Format:** Vertical (9:16) screen designed to look like a YouTube Shorts / TikTok-style video, but rendered live in the browser so it can be screen-recorded or streamed.

**Stack decision (from the requester):** Next.js application with a basic default login (user **admin**, password **123**) required before the battle screen can be opened.

**Database decision:** No third-party or cloud database. All stored data lives in one local SQLite file named `data.db` in the project folder.

**Goals**

- Reproduce the look, layout, and round flow of the reference video as closely as possible.
- Make every round fully automatic and visually satisfying (physics, glow, winner celebration).
- Gate the app behind a simple login so only the owner can start it.

**Non-goals (v1)**

- Public user registration, multi-user accounts, or any third-party or cloud database.
- Server-side video rendering or export (the page is meant to be screen-recorded).
- Betting, voting, or any viewer interaction.

## 2. What the Reference Video Shows

The video is a 58-second clip of a dark, neon-blue themed vertical screen. It starts in the middle of Round 2 and runs into the start of Round 4.

### 2.1 Screen anatomy (top to bottom)

1. **Header.** A hamburger menu icon at the top left. Centered title: **“100-COUNTRY FLAGS BATTLE”**. Under the title, three small pills: round number (**ROUND 3**, blue), a countdown clock (**28:42**, amber), and a status label (**QUALIFYING**, green).
2. **Leaderboard panel.** A glowing blue rounded card titled **“QUALIFIED FOR FINAL 2 / 100”**. It lists five ranked rows. Filled rows show a rank badge (#1 gold, #2 silver, #3 bronze), the flag, the country name, and a green **“✓ QUALIFIED”** tag. Empty rows are greyed out and read **“Waiting…”**. The first row seen is UAE, the second is Jamaica, and Denmark joins as #3 at the end of Round 3.
3. **Arena.** A large white circular ring, drawn as an arc with a gap. The ring slowly rotates so the gap travels around the circle. Flags move inside it.
4. **Progress bar and counter.** A thin yellow bar with a label such as **“2 / 99 FLAGS”**, showing how many flags are still inside the ring.
5. **Eliminated tray.** Flags that fall out of the ring land at the bottom of the screen and stack into a compact grid of tiny flags.
6. **Promo banner.** A YouTube-style red **“SUBSCRIBE”** badge with a channel name and handle. It appears briefly and repeats (seen around 0–4 s and again around 32–34 s).
7. **Footer button.** A glowing pill reading **“TIMER · 30 MIN”**.

### 2.2 Round timeline (observed)

| Stage | What happens | Approx. duration |
| --- | --- | --- |
| Round intro | Overlay text in the center of the ring: “ROUND 4”, a mode label “CLASSIC”, and the flag count (“97 FLAGS”). All remaining flags are packed densely inside the ring. | 2–3 s |
| Elimination | Flags bounce and collide. The gap in the rotating ring lets them fall out one by one, then in larger numbers. The counter and progress bar shrink. | about 35–40 s |
| Final duel | Two to three flags remain and wander the nearly empty ring until one escapes. | 5–10 s |
| Round winner | Overlay: the word **“ROUND WINNER”** in gold, a large framed flag with a golden glow, rotating sun-ray burst behind it, and the country name below. | about 4 s |
| Next round | The winner is added to the leaderboard. Every other flag returns to the ring. The count is one lower each round (99, 98, 97 and so on). | immediate |

### 2.3 Visual style

- Near-black navy background with neon blue glowing borders and soft shadows.
- White, thick ring line for the arena. Gold accents for the round winner and the progress bar.
- Bold, uppercase, condensed sans-serif headings.
- Real flag artwork (rectangular, slightly rotated while tumbling).

### 2.4 Things I could not verify from the video

- The audio track (music or sound effects) was not analyzed.
- The hamburger menu is never opened in the clip.
- Whether the “CLASSIC” label means there are other round modes.
- What happens when the leaderboard fills or when the 30-minute timer reaches zero (the “Final” stage).

These are listed as open questions in Section 12, with proposed defaults.

## 3. Users and Use Cases

| User | Need |
| --- | --- |
| **Owner / content creator (admin)** | Log in, start a battle, let it run hands-free, and screen-record it for Shorts / Reels / TikTok. |
| **Viewer (indirect)** | Watches the recording. Does not use the app. |

**Primary use case:** Admin opens the site, logs in, presses Start, and the battle plays round after round with no further input until the timer ends or the leaderboard is full.

## 4. Scope

**In scope (v1)**

- Login page with default admin credentials and a protected session.
- Battle screen that matches the reference layout.
- Physics-based ring, bouncing flags, elimination, round winner overlay, and automatic next round.
- Leaderboard, progress counter, eliminated tray, timers, and promo banner.
- Basic menu: start, pause, restart, settings, logout.

**Out of scope (v1)**

- Multiple user roles, password reset, or sign-up.
- Cloud or third-party storage, analytics, or sharing links.
- Built-in screen recording or MP4 export.

## 5. Screens

### 5.1 Login (`/login`)

- Centered card on the same dark neon theme, with the app title.
- Fields: **Username** and **Password**. Button: **Log in**.
- Inline error message on wrong credentials (“Invalid username or password”).
- On success, redirect to `/battle`.
- If already logged in, visiting `/login` redirects to `/battle`.

### 5.2 Battle Screen (`/battle`, protected)

A single 9:16 stage centered on the page (letterboxed with black on wider screens). Contains every element in Section 2.1: header, leaderboard, arena canvas, progress bar, eliminated tray, promo banner, and footer button.

### 5.3 Menu drawer (opened from the hamburger icon)

*Assumed, since the video never opens it.*

- Start / Pause / Resume
- Restart battle
- Settings (see 5.4)
- Logout

### 5.4 Settings panel

*Assumed.*

- Session timer length (default 30 min, matches the footer pill).
- Number of flags (default 100).
- Number of qualifiers to collect (default 5 visible slots, see Open Questions).
- Sound on/off.
- Promo banner on/off, with editable channel name and handle.

## 6. Functional Requirements

### 6.1 Authentication

| ID | Requirement |
| --- | --- |
| FR-A1 | All routes except `/login` and static assets require an authenticated session. Unauthenticated users are redirected to `/login`. |
| FR-A2 | Login users are stored in the `users` table of the local `data.db`. On first start, if the table is empty, the app creates it and adds one user: **admin** with password **123** (or the values of `ADMIN_USER` and `ADMIN_PASS` if they are set). Changing those variables later only affects a fresh `data.db`; v1 has no change-password screen. |
| FR-A3 | Passwords are stored as bcrypt hashes, never as plain text. Credentials are checked on the server only (Route Handler or Server Action) and never shipped in client-side JavaScript. |
| FR-A4 | A successful login sets an `httpOnly`, `sameSite=lax` cookie containing a signed token that expires after 12 hours. |
| FR-A5 | Logout clears the cookie and returns to `/login`. |
| FR-A6 | Basic brute-force protection: after 5 failed attempts from one IP, block further attempts for 1 minute. |

### 6.2 Battle engine

| ID | Requirement |
| --- | --- |
| FR-B1 | The arena is a circle with a visible gap. The ring rotates at a constant angular speed. The gap size and rotation speed are configurable. |
| FR-B2 | Each remaining flag is a rigid body that moves under physics: it bounces off the ring wall and off other flags, tumbles slightly, and is affected by gravity once it leaves the ring. |
| FR-B3 | A flag that passes fully through the gap is eliminated. It falls to the bottom of the screen and joins the eliminated tray. |
| FR-B4 | When exactly one flag is left inside the ring, it is declared the round winner. |
| FR-B5 | A round starts with all flags that are not yet qualified, placed at random positions inside the ring with random initial velocity. |
| FR-B6 | The flag counter and progress bar update live as flags leave the ring (for example “56 / 98 FLAGS”). |
| FR-B7 | Stalemate guard: if no flag has been eliminated for 8 seconds, gently widen the gap or nudge flags toward it so a round never stalls. |
| FR-B8 | The battle is deterministic only if a seed is provided. Without a seed, every run is random. |

### 6.3 Round flow and leaderboard

| ID | Requirement |
| --- | --- |
| FR-R1 | Round intro overlay shows the round number, mode label (“CLASSIC”), and the flag count for about 2–3 seconds before the flags are released. |
| FR-R2 | Round winner overlay shows “ROUND WINNER”, the large flag with a golden glow and rotating rays, and the country name for about 4 seconds. |
| FR-R3 | The winner is added to the leaderboard as the next rank. Rank badges: #1 gold, #2 silver, #3 bronze, then neutral for #4 and #5. |
| FR-R4 | The leaderboard title shows qualified count out of the total, for example “QUALIFIED FOR FINAL 2 / 100”. Empty slots show “Waiting…” in a dimmed style. |
| FR-R5 | A qualified country never re-enters the ring in later rounds. |
| FR-R6 | The next round starts automatically right after the winner overlay. The flag count drops by one each round. |
| FR-R7 | The header round pill increments each round. The status pill reads **QUALIFYING** until the final stage begins. |

### 6.4 Timer and chrome

| ID | Requirement |
| --- | --- |
| FR-T1 | A session countdown (default 30:00) runs in the header pill, in mm:ss format, and starts when the admin presses Start. |
| FR-T2 | The footer pill shows the configured duration (“TIMER · 30 MIN”). Tapping it opens the duration setting. |
| FR-T3 | The promo banner slides in for about 4 seconds roughly every 30 seconds, with configurable text. |
| FR-T4 | The hamburger menu opens the drawer described in 5.3. |

### 6.5 Audio (optional, v1.1)

- Soft ticks or pops when flags exit the ring, a short fanfare on round winner, and optional background music. All toggled by a sound setting.

## 7. Game Logic Summary

```
state: qualified = [], remaining = ALL_FLAGS (100)
loop until qualified.length == TARGET or timer == 0:
  roundFlags = remaining minus qualified
  show intro(round, roundFlags.length)
  spawn roundFlags inside ring
  run physics until exactly 1 flag is inside the ring
  winner = last flag inside
  show winner overlay (4 s)
  qualified.push(winner)
  round += 1
```

The flag counter in the video starts a round at “98 / 98” after two qualifiers, which matches `100 - qualified.length`.

## 8. Data Model

All saved data lives in one local SQLite file, \`data.db\`, with no third-party database. The 100-country list stays a static file in the code, and live battle state stays in memory while the page runs.

```ts
type Country = { code: string; name: string; flagUrl: string }; // 100 entries

type BattleState = {
  status: "idle" | "intro" | "running" | "winner" | "paused" | "finished";
  round: number;
  secondsLeft: number;
  qualified: Country[];       // ordered by rank
  inRing: string[];           // country codes still inside
  eliminated: string[];       // country codes in the tray this round
};

type Settings = {
  durationMin: number;        // default 30
  flagCount: number;          // default 100
  qualifierTarget: number;    // default 5 visible slots
  gapDegrees: number;
  ringSpeed: number;
  sound: boolean;
  promo: { enabled: boolean; name: string; handle: string };
};
```

`data.db` holds three small tables and is created automatically on first start. The `Settings` type above is read from and written to the `settings` table, so settings survive reloads and restarts.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,      -- durationMin, flagCount, gapDegrees, promoName ...
  value TEXT NOT NULL
);

CREATE TABLE round_results (
  id INTEGER PRIMARY KEY,
  battle_id TEXT NOT NULL,
  round INTEGER NOT NULL,
  winner_code TEXT NOT NULL,
  played_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

`round_results` keeps a simple history of round winners. It is not shown on screen in v1.

## 9. Technical Approach (Next.js)

| Area | Recommendation |
| --- | --- |
| Framework | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS plus a small custom CSS file for the neon glow effects |
| Rendering | HTML Canvas 2D for the arena and flags (best performance for 100 moving sprites); React components for header, leaderboard, overlays, and menus |
| Physics | Matter.js (circle boundary built from a segmented arc, rectangular flag bodies) or a small custom engine with circle-versus-rectangle collisions |
| Game loop | `requestAnimationFrame` with a fixed physics timestep (60 Hz) |
| State | Zustand or React `useReducer` for round and leaderboard state |
| Flags | Local SVG/PNG assets for 100 countries (for example from the open-source `flag-icons` set), preloaded into canvas image bitmaps before the first round |
| Database | Local SQLite file `data.db` through `better-sqlite3`. Only server code (Route Handlers, Server Actions) opens it, in the Node.js runtime, never in Edge middleware or the browser. No third-party or cloud database. |
| Auth | Route Handler `POST /api/login` checks the username and the bcrypt hash (`bcryptjs`) in `data.db`; signed JWT (library `jose`) in an httpOnly cookie; `middleware.ts` only verifies the JWT, so it needs no database access, and protects all routes except `/login` |
| Animation | CSS keyframes for the rotating sun-ray burst and glow pulses; canvas drawing for flags |
| Deployment | Your own machine or any Node server with a writable disk (`next build`, then `next start`). Avoid serverless hosts such as Vercel, where the disk is not persistent and `data.db` would be lost. |

**Suggested folder layout**

```
app/
  login/page.tsx
  battle/page.tsx
  api/login/route.ts
  api/logout/route.ts
  api/settings/route.ts
  api/results/route.ts
components/
  Header.tsx  Leaderboard.tsx  Arena.tsx  ProgressBar.tsx
  EliminatedTray.tsx  RoundIntro.tsx  WinnerOverlay.tsx  PromoBanner.tsx  MenuDrawer.tsx
lib/
  countries.ts  engine.ts  auth.ts  db.ts
middleware.ts
data.db            (created on first start; add to .gitignore)
public/flags/*.svg
```

## 10. Non-Functional Requirements

- **Performance:** Hold 60 FPS on a mid-range laptop with 100 flags in the ring. Preload all flag images before the first round to avoid pop-in.
- **Responsiveness:** The stage keeps a fixed 9:16 ratio and scales to fit the window height. Desktop shows it centered with black side bars.
- **Visual fidelity:** Match the reference colors, glow, rounded corners, and typography closely enough that the two are hard to tell apart side by side.
- **Reliability:** The loop must never dead-lock (see FR-B7). Pausing and resuming keeps the exact state.
- **Security:** Credentials checked only on the server; passwords stored as bcrypt hashes in data.db; httpOnly signed cookie; no sensitive data in logs. **admin / 123 is a convenience default for local use or a prototype. Before any public deployment, set strong values in `ADMIN_USER` and `ADMIN_PASS`.**
- **Browser support:** Latest Chrome, Edge, Safari, and Firefox.
- **Accessibility:** Keyboard-operable login form and menu; sufficient contrast for text on the dark background.

## 11. Milestones

| # | Milestone | Outcome |
| --- | --- | --- |
| 1 | Project setup, local database, and login | Next.js app, `data.db` created on first start with a seeded admin user, `/login`, middleware, admin / 123 working, logout |
| 2 | Static battle screen | Header, leaderboard, progress bar, tray, footer, all styled to match the video |
| 3 | Physics arena | Rotating ring with gap, bouncing flags, elimination into the tray |
| 4 | Round loop | Intro, winner overlay, leaderboard updates, automatic next round, winners saved to `round_results` |
| 5 | Timer, menu, settings, promo banner | Full chrome and configuration, settings saved in `data.db` |
| 6 | Polish | Sound, performance tuning, stalemate guard, QA against the reference video |

## 12. Open Questions and Proposed Defaults

| Question | Proposed default |
| --- | --- |
| What is the “Final” stage after qualification? The leaderboard has five visible slots but the counter reads “x / 100”. | Collect 5 qualifiers (configurable), then run a final round among them and crown a champion. |
| What does the “CLASSIC” label mean, and are there other round modes? | Treat it as the default mode. Add other modes later (for example a smaller gap or faster ring). |
| What happens when the 30-minute timer hits zero? | Stop the battle, show the current leaderboard with “TIME UP”. |
| Does the ring gap change size during a round? It looked wider late in the rounds. | Gap widens slowly over each round to guarantee the round ends. |
| Should the app include the “SUBSCRIBE” banner and the channel name? | Yes, but editable in Settings so it can show your own channel. |
| What does the hamburger menu contain? | Start / Pause, Restart, Settings, Logout. |
| Sound? | Optional effects and music, off by default. |
| Where do flag images come from, and is the country list exactly the same 100 as the video? | Use an open flag set and a 100-country list you can edit. |
| Is data.db a SQLite file? | Assumed yes (SQLite through better-sqlite3). Tell me if you want another local format, such as a JSON file. |

## 13. Acceptance Criteria

1. Opening any page while logged out sends the user to `/login`.
2. Logging in with **admin / 123** (or the configured values) opens `/battle`. Wrong credentials show an error and do not log in.
3. Pressing Start runs a full round: intro, flags bouncing in the rotating ring, flags dropping out through the gap, a single winner, the winner overlay, and the winner appearing at the next rank in the leaderboard.
4. The next round starts automatically with one fewer flag, and a qualified country never returns.
5. The counter, progress bar, round pill, and countdown update correctly throughout.
6. A round always finishes, even with a stalled last flag.
7. Side by side with the reference video, the layout, colors, and effects match closely.
8. Logout clears the session and blocks `/battle` again.
