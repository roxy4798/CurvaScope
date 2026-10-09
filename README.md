# CurveProof — Meteora DBC Config-to-Outcome Lab

**Plan with evidence. Verify configuration. Learn from on-chain outcomes.**

CurveProof is an independent builder-tooling project focused on Meteora Dynamic Bonding Curve (DBC) launches and the migration path into DAMM v2. The goal is to connect a builder's launch intent to a reproducible configuration, validation evidence, and eventually cohort-level outcomes from public on-chain data.

CurveProof is not affiliated with or endorsed by Meteora. It complements the official Meteora Invent tooling rather than replacing it.

## Current implementation status

This repository is a planning MVP, not a production launch service. It currently provides:

- A requirements-first workflow with distinct input forms for DBC builder modes 0–5.
- Analytical curve visualizations, selected local checks, and three-recipe comparisons.
- A local preset library and field-level Invent readiness diagnostics.
- Optional read-only RPC inspection using the Meteora DBC SDK.
- A documented protocol audit, methodology, known limitations, and product roadmap.

Important limitations: charts still use approximate floating-point calculations; the application does not yet establish full SDK/on-chain curve parity, does not cover every Invent config field, has not demonstrated official Invent parser acceptance or serializer round-trips, does not yet provide a complete executable Invent configuration, and has no proven mainnet outcome-indexing or adoption metrics. **Invent config export remains disabled.** Presets are illustrative engineering examples, not Meteora-endorsed settings or performance recommendations.

## Product direction

The core differentiator is a **configuration-to-outcome evidence loop**, not another generic token tracker:

1. Capture the launch intent and constraints.
2. Build candidate configurations using official DBC SDK builders.
3. Generate a complete, versioned config and validate it against the current official Invent contract.
4. Prove the validation path with reproducible tests and localnet/devnet dry-runs.
5. Index public DBC lifecycle events and DAMM v2 migration outcomes with data provenance.
6. Compare genuinely comparable launch cohorts and publish sample sizes, missing-data rates, assumptions, and calculation versions.
7. Reuse recipes only with explicit validation status, version, and evidence.

See [the CurveProof product specification](docs/CURVEPROOF_PRODUCT_SPEC.md), [protocol audit](docs/PROTOCOL_AUDIT.md), [methodology](docs/METHODOLOGY.md), [known limitations](docs/KNOWN_LIMITATIONS.md), and [competitor audit](docs/COMPETITOR_AUDIT.md).

## Local development

Requirements: Node.js compatible with the Vite toolchain and npm.

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

## Official protocol references

- [Meteora DBC developer guide](https://docs.meteora.ag/developer-guides/dbc)
- [DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas)
- [Meteora DAMM v2 developer guide](https://docs.meteora.ag/developer-guides/damm-v2)
- [Meteora Invent CLI and Studio](https://github.com/MeteoraAg/meteora-invent)
- [Official Invent DBC configuration](https://github.com/MeteoraAg/meteora-invent/blob/main/studio/config/dbc_config.jsonc)
- [Official Invent DBC actions](https://github.com/MeteoraAg/meteora-invent/blob/main/skills/meteora/references/studio-actions.md)
- [Meteora DBC TypeScript SDK](https://github.com/MeteoraAg/dynamic-bonding-curve-sdk)
- [Meteora DAMM v2 / CP-AMM SDK](https://github.com/MeteoraAg/cp-amm-sdk)

The official docs and schema evolve. Reproducible evidence must pin the exact upstream commit and SDK package version used, then re-run compatibility tests when they change.

## Trust and safety boundaries

- Local validation is not official Invent validation.
- An SDK quote is not a realized execution.
- An illustrative curve is not an on-chain result.
- A configuration preset does not predict profit, graduation, or future performance.
- DBC trading fees, migration fees, surplus allocation, and migrated LP ownership are separate mechanisms.
- The browser must never request or store a wallet private key. Transaction creation/signing/deployment stays out of scope until the validation and consent model is explicitly reviewed.

## Naming note

“CurveProof” is a preliminary product name selected after an initial public search did not surface a directly matching Meteora DBC product. This is not trademark, domain, social-handle, or global uniqueness clearance. The GitHub repository URL has not been renamed.
