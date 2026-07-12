# AGI Watch

**Live at [agi.ryanshaw.me](https://agi.ryanshaw.me)** — a public scoreboard for the [AI 2027](https://ai-2027.com/) scenario: is AGI on schedule?

## How it works

Plain static site, no build step. All content is driven by a single data file:

```
index.html            tracker page (renders from data/tracker.json)
methodology.html      where every number comes from
changelog.html        dated log of every data change
about.html            who runs it and why
data/tracker.json     ALL numbers, milestones, scorecard rows, changelog
assets/tokens.css     design tokens (CVD-validated palette), light + dark
assets/site.css       layout & components
assets/app.js         pure render functions (JSON in, DOM out)
assets/theme.js       theme toggle (system preference + localStorage)
```

## Updating the tracker

1. Edit `data/tracker.json` — never the HTML.
2. Add a `changelog` entry (date + what moved). No silent edits.
3. Bump `meta.lastUpdated`.
4. Commit and push; GitHub Pages redeploys automatically.

## Data provenance

Primary source: the AI Futures Project's own
[prediction gradings](https://blog.aifutures.org/p/grading-ai-2027s-2025-predictions).
Derived estimates are flagged `"estimated": true` in the JSON and rendered with a "~" prefix.
See [methodology](https://agi.ryanshaw.me/methodology.html).

## Roadmap

See `PLAN.md` — v0.2 adds the hero pace dial + email capture; v0.3 adds a weekly
GitHub Action that pulls Metaculus crowd forecasts and opens a data PR.

---

Independent project — not affiliated with the AI Futures Project.
