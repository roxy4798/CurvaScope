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

## Relationship to Meteora Invent

CurveScope is an upstream planning aid; Meteora Invent remains the official configuration and pool-creation workflow. CurveScope does not replace Invent's configuration, validation, or transaction behavior. Invent-compatible export is unsupported in this MVP. The diagnostics modal displays an analytical draft and gap report; it is not an executable or officially validated Invent configuration.

## What the calculations and checks mean

- Curve charts and price/slippage progressions are floating-point analytical estimates. They are not protocol-exact quotes and do not reproduce every builder mode or on-chain rounding.
- Some input bounds and mode-specific validation are implemented locally. Selected liquidity allocation and vesting validations call installed SDK helpers. Neither establishes full SDK parity or Invent CLI acceptance.
- Documentation references the official DBC developer guide and formulas. The audit did not inspect or establish parity with deployed program code for every displayed calculation.
- Optional account inspection uses a user-selected RPC endpoint and may fail or be rate-limited. It is read-only; no wallet, signing, or transaction submission is implemented.

## Cost and network boundary

The local requirements, recipe, and comparison workflow does not require a paid API or service after the app and dependencies are available. This is not a guarantee of zero cost in every environment. `index.html` requests Inter and JetBrains Mono from Google Fonts, and optional RPC inspection requires a network endpoint. Installing dependencies also ordinarily requires package registry access.

## Local development

Requires Node.js (Node 20.19+ or 22.12+) and npm.

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

## Documentation

- [Protocol references and validation boundaries](docs/PROTOCOL_AUDIT.md)
- [System architecture](docs/ARCHITECTURE.md)
- [Cost and dependency notes](docs/COST_AND_DEPENDENCIES.md)
- [Calculation methodology](docs/METHODOLOGY.md)
- [Known limitations](docs/KNOWN_LIMITATIONS.md)
- [Meteora integration notes](docs/METEORA_INTEGRATION.md)
- [Competitor analysis](docs/COMPETITOR_AUDIT.md)
- [Demo runbook](docs/DEMO_GUIDE.md)

## License

This repository does not currently include a project-wide `LICENSE` file. Third-party dependency licenses do not grant a license to CurveScope's own code or assets. No project-wide reuse permission is implied.
