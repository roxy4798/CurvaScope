# CurveScope — Meteora DBC Asset Launch Recipe Lab

CurveScope is a local-first analytical planning MVP for developers comparing candidate Meteora Dynamic Bonding Curve (DBC) launch recipes. It provides requirements intake, mode-aware local checks, estimated curve visualizations, reusable examples, three-scenario comparisons, optional read-only SDK account inspection, and an Invent readiness checklist.

CurveScope does **not** produce a complete Invent configuration. Config export remains disabled. Charts are analytical estimates, and qualitative trade-offs do not predict outcomes or constitute financial advice. Presets are illustrative engineering starting points, not Meteora-endorsed or optimal settings. See the [protocol audit](docs/PROTOCOL_AUDIT.md) and [known limitations](docs/KNOWN_LIMITATIONS.md).

## Features

- Requirements-to-recipe workflow with DBC builder modes 0–5 and distinct input forms.
- Approximate concentrated-liquidity charts; not protocol parity.
- Local mode and selected fee input checks; not official parser acceptance.
- Three-recipe analytical comparison and local preset library.
- Invent readiness diagnostics; no executable config is emitted.
- Optional read-only SDK state inspection; no wallet signing, transactions, or deployment.

## Local development

Requires Node.js and npm.

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

## Scope

CurveScope is a planning MVP. Complete Invent schema collection, export serialization, official parser validation, live-provider RPC reliability, and exact curve parity are incomplete. RPC failure states are tested with injected dependencies; this is not a claim of successful live-provider integration. No adoption, transaction volume, endorsements, or judging result is claimed.

## Demo

Follow the [demo runbook](docs/DEMO_GUIDE.md) to show recipe synthesis, comparison, validation, methodology, and Invent readiness. Select three genuinely distinct recipes in Comparison; default recipes can share the same parameter values.

## License

This repository does not currently include a project-wide `LICENSE` file. Third-party dependency licenses do not grant a license to CurveScope's own code or assets. No project-wide reuse permission is implied.
