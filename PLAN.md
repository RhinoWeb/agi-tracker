# AGI Watch — agi.ryanshaw.xyz

**One-liner:** A public, auto-updating "are we on schedule for AGI?" tracker — the AI 2027 reality-check dashboard, grown into a living site under Ryan's brand.

**Why it wins:** AI 2027 has massive mindshare but no neutral, always-current scoreboard. `ai2027-tracker.com` exists but is bare. A polished, visual, weekly-updated tracker is highly shareable (X/LinkedIn/YouTube b-roll), ranks for "is AI 2027 accurate" searches, and funnels attention to Ryan's AI business.

---

## Positioning

- **Name:** AGI Watch (working title; alt: "The AGI Clock", "On Schedule?")
- **Audience:** AI-curious professionals, agency prospects, Ryan's content audience
- **Job:** Answer one question above the fold — *"Is AGI on schedule?"* — with a defensible number (current pace vs. AI 2027), then let visitors go deep.
- **Brand tie-in:** Same visual family as ai.ryanshaw.xyz; footer + soft CTA to Ryan's AI content/email list. The tracker is the lead magnet.

## Site map (v1)

```
/                 Hero verdict ("Running at ~0.7× the predicted pace")
                  + dual timeline + pace bars + scorecard  (port of the artifact)
/methodology      Where every number comes from; estimates flagged
/changelog        "What moved this week" — dated entries (this is the retention hook)
/about            Who runs it, why, disclaimer (tracker, not affiliated with AI Futures)
```

## Architecture

**Stack: plain static site** — HTML/CSS/vanilla JS + a single `data/tracker.json` that drives everything. No framework, no build step beyond a tiny render script. Matches the aios-site pattern (GitHub Pages, zero hosting cost, nothing to maintain).

```
RhinoWeb/agi-tracker
├── index.html            shell + templates
├── assets/               css (tokens from the artifact), js (render + tooltips)
├── data/tracker.json     ALL content: milestones, pace metrics, scorecard rows, changelog
├── scripts/refresh.mjs   (v0.3) pulls Metaculus forecasts, opens a PR with diffs
├── .github/workflows/    weekly cron → refresh.mjs; Pages deploy
└── CNAME                 agi.ryanshaw.xyz
```

Key principle: **content lives in JSON, not markup.** Weekly updates = edit one file (or merge the bot's PR); the page re-renders itself. Immutable render functions, no hand-editing HTML.

## Data sources

| Source | What | How |
|---|---|---|
| AI Futures scorecard (blog.aifutures.org) | Official pace multipliers | Manual, on publication (~quarterly) |
| Metaculus API (public, no key) | Crowd AGI date + probability | Automated weekly |
| METR time-horizon reports | Coding time-horizon trend | Manual, on release |
| Benchmark results (SWE-Bench etc.) | Predicted-vs-actual rows | Manual, monthly check |
| Our own estimates | Anything derived | Always flagged "~est." in UI |

## Phases

**v0.1 — Ship the port (1 session)**
- Repo `RhinoWeb/agi-tracker`, Pages enabled, CNAME + HTTPS
- Port the artifact into index.html + tokens.css + app.js, content moved to tracker.json
- Methodology + about pages; OG/social card so shares look good
- DoD: live at agi.ryanshaw.xyz, Lighthouse ≥ 95, renders both themes

**v0.2 — Make it ours (1 session)**
- Hero verdict block: big "0.7×" pace dial + one-sentence verdict + "last updated" stamp
- Changelog page seeded with first entry
- Email CTA (footer + post-scorecard): "Get the monthly AGI Watch update" → Ryan's list
- DoD: a stranger understands the verdict in 5 seconds; CTA wired

**v0.3 — Self-updating (1–2 sessions)**
- `refresh.mjs`: Metaculus fetch → rewrites the crowd-forecast section of tracker.json → opens PR (never auto-merges; human reviews numbers)
- Weekly GitHub Action cron; changelog entry generated from the diff
- DoD: bot PR arrives weekly with correct diffs; zero-touch deploy on merge

**v0.4 — Distribution (ongoing)**
- JSON feed endpoint (`/data/tracker.json` is already public — document it)
- Monthly "state of the schedule" content beat for Ryan's channels, screenshots from the site
- Optional: embed widget (iframe) other sites can use, linking back

## Quality gates

- Palette = validated dataviz reference palette (already CVD-checked)
- No dual axes, estimates always labeled, sources linked on every number — credibility is the product
- CI: HTML validate + link check + JSON schema check on tracker.json (fail the deploy on bad data)
- All characters entity-encoded or UTF-8 with explicit `<meta charset>` (lesson from the artifact)

## What Ryan must do (owner-gated)

1. **DNS:** add `CNAME agi → rhinoweb.github.io` on the ryanshaw.me registrar (one-time)
2. Approve repo creation under RhinoWeb
3. (v0.2) Provide the email-capture endpoint (existing list/provider)

## Risks

- **AI Futures publishes new gradings** → numbers go stale. Mitigation: "last updated" stamp everywhere + weekly cron forces a look.
- **Domain confusion:** ryanshaw.me vs ryanshaw.xyz split-brand. Flag to Ryan; either is fine technically.
- **Attribution:** we grade *their* scenario — link generously, add "not affiliated" disclaimer, invite correction.
