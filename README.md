# CurveScope — Meteora DBC Asset Launch Recipe Lab

CurveScope is a free local analytical planning MVP for developers comparing candidate Meteora DBC launch recipes. It provides requirements intake, mode-aware local checks, estimated curve visualizations, reusable examples, three-scenario comparisons, optional read-only SDK account inspection, and an Invent readiness checklist.

CurveScope does **not** produce a complete Invent configuration. Config export remains disabled. Charts are analytical estimates, and qualitative trade-offs do not predict outcomes or constitute financial advice. Presets are illustrative engineering starting points, not Meteora-endorsed or optimal settings. See [protocol audit](docs/PROTOCOL_AUDIT.md).

## Features

- Requirements-to-recipe workflow with DBC builder modes 0–5 and distinct input forms.
- Approximate concentrated-liquidity charts; not protocol parity.
- Local mode and selected fee input checks; not official parser acceptance.
- Three-recipe analytical comparison and local preset library.
- Export readiness diagnostics; no executable config is emitted.
- Optional read-only SDK state inspection; no wallet, signing, paid service, or transactions.

## Local development

Requires Node.js and npm.

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

## Scope and submission evidence

The feature set is a planning MVP only. Complete Invent schema collection, export serialization, parser validation, live-provider RPC reliability, and exact curve parity are incomplete. RPC failure states are tested using injected dependencies. No adoption, transaction volume, endorsements, or judging result is claimed. See [submission evidence checklist](docs/SUBMISSION_CHECKLIST.md) and [known limitations](docs/KNOWN_LIMITATIONS.md).


## Demo

Follow the offline [demo runbook](docs/DEMO_GUIDE.md) to show recipe synthesis, comparison, validation, methodology, and Invent readiness without RPC access or transactions.
