# CurveProof — DBC Config-to-Outcome Intelligence

**Working product name:** CurveProof  
**Descriptor:** Meteora DBC Config-to-Outcome Lab  
**Status:** product specification; not a claim of complete implementation, official review, or uniqueness clearance.

## Product thesis

Token launch tooling is easy to build at the surface level. The valuable problem is deciding whether a proposed launch configuration is mechanically coherent, validating it against the live official contract, and then learning from what the configuration actually did on-chain.

CurveProof is intended to close that loop:

**Launch intent → candidate DBC configuration → SDK/Invent validation → reproducible dry-run → launch and migration evidence → comparable outcome cohorts → improved, versioned recipes.**

It is an independent builder tool intended to complement Meteora Invent, not replace the official CLI, and it is not affiliated with or endorsed by Meteora.

## The user problem

A builder can choose a curve mode, fee schedule, quote mint, graduation settings, migration target, and post-graduation liquidity distribution. These choices are conditional and interact. A visually plausible chart or an attractive preset is not proof that a full Invent config is accepted, that a graduation threshold will be reached, or that a particular launch outcome is likely.

Today’s prototype helps structure requirements and compare analytical recipes. The main product gap is that its curve visuals are estimates, its local checks are partial, and it cannot yet produce a complete official-compatible Invent configuration. CurveProof must close those gaps before it can claim configuration-level reliability.

## Core product modules

### 1. Launch Intent Studio
Capture the reason for the launch before exposing protocol knobs:
- Asset thesis/cohort: tokenized equity, RWA, AI/agent, meme, or custom.
- Quote mint and human-unit/decimal conventions.
- Price-discovery objective and target graduation conditions.
- Liquidity, creator/partner incentives, and vesting/locking constraints.
- Fees and post-graduation behavior.
- Risk and operational constraints, with each assumption made visible.

Asset class is a builder-supplied classification, not a legal judgment or investment recommendation.

### 2. Curve Lab: real SDK outputs, not invented parity
Support official DBC builder modes 0–5 as distinct parameter contracts. Use the currently pinned Meteora DBC SDK builder and pre-launch quote APIs for canonical computations where available. Any independent visualization must state the SDK version, input parameters, unit conversions, rounding limitations, and provenance. A chart must never be labeled “on-chain accurate” without a reproducible parity test.

### 3. Config Integrity Gate
Model the complete current Invent schema, including mode-specific unions and conditional fields. Generate one canonical versioned JSONC config only when its required fields are present. Validation should be layered and separately labeled:
1. local UX validation;
2. installed SDK builder/validation checks;
3. official Invent parser/CLI validation;
4. local-validator or devnet dry-run;
5. mainnet deployment review and explicit human approval.

A green local check must not be represented as official acceptance. Do not provide executable export until round-trip tests and official CLI acceptance tests pass against a pinned Invent revision. Keep private keys server/local-only; never collect them in the browser or send them to the analytics API.

### 4. Outcome Benchmarks: the differentiator
Build a reproducible public-data index of DBC configurations, curve events, swaps, graduation and migration, then correlate configurations with observed outcomes. Compare cohorts, not cherry-picked winners.

Potential cohort measures, subject to source coverage and rigorous definitions:
- time from pool creation to graduation; graduation / non-graduation status;
- quote-reserve and price progression with explicit units;
- swap count, volume and unique active traders where reliably attributable;
- actual migration destination and migrated DAMM v2 configuration;
- LP distribution / lock / vesting settings and claimable-fee observations;
- SDK-quoted estimated price impact at fixed trade sizes (label these as quotes/estimates, not realized execution);
- post-migration pool activity and compounding-fee configuration where available.

Every metric must expose sample count, observation window, missing-data rate, source slot/signature/account, indexer version and calculation version. Split results by meaningful controls (builder mode, quote mint, fee schedule, liquidity distribution, asset cohort and launch period). Do not use a single “best config” score, and do not imply causality or guarantee future results.

### 5. Recipe Registry / Preset Exchange
Store immutable, versioned recipe manifests with:
- exact source/schema/SDK version and content hash;
- target use case and assumptions;
- official validation evidence and timestamp;
- sample size and cohort evidence, when available;
- known trade-offs and failure modes;
- licensing / reuse terms and author attribution;
- optional on-chain config/pool addresses and migration state.

Only call a recipe **Verified** when its verification evidence is explicit and reproducible. “Community recipe”, “locally checked”, “Invent accepted”, and “devnet simulated” are different states. Paid distribution can be considered later; do not pretend a marketplace is useful before the catalog has quality and adoption.

### 6. Builder Data Stream / API
Expose documented read-only endpoints or a stream for launchpads and terminals: config metadata, pool lifecycle state, graduation/migration events, outcome cohort summaries and recipe manifests. Publish schemas, versioning, source provenance, rate limits, and example clients. Do not expose private user launch intents unless explicitly shared.

## Official-source alignment

The current official Meteora Invent template documents DBC builder modes 0–5, fee configurations, DAMM v2 migration, migrated-pool fee options (including compounding), and LP distribution / lock or vesting constraints. These fields must be read from the current official template and validated against the pinned official CLI/SDK—not re-created from memory.

Official references:
- DBC builder and lifecycle guide: https://docs.meteora.ag/developer-guides/dbc
- DBC formulas: https://docs.meteora.ag/core-products/dbc/formulas
- DAMM v2 guide: https://docs.meteora.ag/developer-guides/damm-v2
- Official Invent config: https://github.com/MeteoraAg/meteora-invent/blob/main/studio/config/dbc_config.jsonc
- Official Invent action reference: https://github.com/MeteoraAg/meteora-invent/blob/main/skills/meteora/references/studio-actions.md
- DBC SDK: https://github.com/MeteoraAg/dynamic-bonding-curve-sdk
- DAMM v2 SDK: https://github.com/MeteoraAg/cp-amm-sdk

Pin the inspected Git commit and package versions in evidence records; current upstream docs can change.

## Challenge alignment

| Judging criterion | Concrete evidence this project should deliver |
|---|---|
| Depth of Meteora integration | Official DBC SDK calculations; complete Invent serializer/validation; DBC event/account index; DAMM v2 migration outcome tracking |
| Technical execution | Pinned schemas, unit tests, round-trip fixtures, official CLI validation, test-validator/devnet rehearsal, fault handling, reproducible indexer |
| Originality and taste | Config-to-outcome loop and quality-labeled cohort evidence rather than another token tracker or generic launch form |
| Impact potential | Reusable launch recipes and read-only API that other launchpads, AI/RWA builders, and terminals can embed |
| Traction/volume | A few publicly verifiable launches, active external users, usage metrics, and documented user feedback; never fabricate traction |

## Delivery plan

### P0 — integrity foundation
- Pin the exact Invent commit and DBC SDK version used.
- Map the full config schema and every conditional field.
- Replace approximate outputs with official SDK builder/quote outputs where the SDK supports them.
- Build a complete serializer and strict round-trip fixtures.
- Run the actual official parser/CLI and devnet/local-validator checks in CI.
- Keep mainnet transaction signing disabled in the web app.

### P1 — one credible end-to-end builder flow
- Requirements → one of the six supported builder modes → versioned config → official CLI validation → dry-run output and downloadable evidence report.
- Surface exact remediation for every failed check.
- Use testnet/localnet evidence only where it is actually collected; distinguish fixtures from live evidence.

### P2 — outcome evidence
- Implement versioned DBC lifecycle ingestion and data-quality accounting.
- Track graduation and DAMM v2 state from chain evidence.
- Publish cohort comparisons only after minimum coverage and reproducibility gates pass.

### P3 — reuse and distribution
- Release a read-only API, launchpad integration example, and a small curated recipe registry.
- Add user-submitted presets with moderation and evidence requirements.
- Consider a paid preset marketplace only after repeat demand is demonstrated.

## Non-negotiable trust principles

- Never call an analytical estimate an on-chain result.
- Never say an untested config passes official validation.
- Never imply that a preset is profitable, optimal, or guaranteed to graduate.
- Never combine DBC trading-fee sharing with migration fees or post-graduation LP ownership.
- Show missing coverage and sample sizes, including for negative outcomes.
- Do not deploy, sign, or transfer funds automatically from the planning interface.
- Do not imply Meteora endorsement; use the Meteora name only to describe compatibility.

## Current evidence and gaps

The existing repository already contains a requirements wizard, six mode-aware inputs, approximate charts, qualitative trade-off descriptions, comparison, local validation, an optional read-only RPC page, and readiness diagnostics. Its own protocol audit records these important gaps: incomplete Invent field coverage, no full serializer round trip, no official parser-acceptance test, no SDK/on-chain curve parity test, and no end-to-end live RPC/indexer proof.

This specification is a delivery contract, not evidence that these items are implemented. Update the implementation status only after a corresponding test, official-tool run, or verifiable chain observation exists.
