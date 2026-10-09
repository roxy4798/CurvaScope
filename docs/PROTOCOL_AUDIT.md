# CurveScope protocol audit and readiness

Audit date: 2026-10-09. This audit checked the official [DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas), [DBC developer guide](https://docs.meteora.ag/developer-guides/dbc) (not accessible to the web reader), the [Invent config template at audited commit dd77ef3](https://github.com/MeteoraAg/meteora-invent/blob/dd77ef3d5aede3f0ff21d566d052097200417f5e/studio/config/dbc_config.jsonc), [Invent source at that commit](https://github.com/MeteoraAg/meteora-invent/tree/dd77ef3d5aede3f0ff21d566d052097200417f5e), [DBC SDK repository](https://github.com/MeteoraAg/dynamic-bonding-curve-sdk), and installed `@meteora-ag/dynamic-bonding-curve-sdk@1.5.13`.

## Verified facts

- Formula documentation gives the concentrated-liquidity segment equations and graduation test `quote reserve >= migration quote threshold`; it does not establish a universal raise minimum.
- DBC trading fee: protocol receives 20% of total; the remaining 80% is divided between creator and partner according to `creatorTradingFeePercentage`. A referral, if supplied, may receive a share of the protocol portion. This is distinct from LP ownership.
- At migration, the configurable migration fee is taken from quote reserve and can be split between creator and partner with a separate creator percentage. A separate fixed 0.2% protocol liquidity migration deduction reduces pool liquidity. Surplus has its own 80/20 partner+creator/protocol allocation. Post-migration LP shares, locks, and vesting are separate configuration.
- The audited Invent template documents configured migration fee `0–50%`; the installed SDK has a generic maximum constant of 99. CurveScope validation adopts 0–50% for Invent config compatibility; SDK numeric permissiveness must not be represented as Invent config acceptance.
- Formula docs state fee numerators use denominator 1,000,000,000 (25 bps = 2,500,000; 99% = 990,000,000) and total trading fee cap 99%.
- Audited Invent config modes: 0 `buildCurve`: migration supply percentage + quote threshold; 1 market-cap builder: initial/migration MC; 2 two-segment builder: MCs + migration supply percentage; 3 weighted builder: MCs + 16 weights; 4 mid-price builder: MCs + midpoint + migration supply percentage; 5 custom sqrt-price builder: ascending decimal `prices` (2+) and optional weights (`prices.length - 1`). These are builder input contracts, not CurveScope curve-parity assertions.
- Audited Invent DBC common sections include `token`, `fee`, `migration`, `liquidityDistribution`, `lockedVesting`, `activationType`, `leftoverReceiver`, and `feeClaimer`. The template describes LP distribution totaling 100% and at least 10% locked/vesting for at least one day. DAMM v2 migrated-pool fee options have dependencies on the selected migration fee option and related scheduler fields.
- Installed SDK version resolves to 1.5.13. The SDK README/declarations identify DBC program `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`; read-only state method `StateService.getPool(PublicKey|string)` is exposed. This report does not certify deployed IDs beyond these inspected references.

## Corrections made

- Removed unsupported 750 USD stock-pair keeper threshold claims and quote whitelist implications from validation/preset wording. Quote threshold is a user input; no keeper guarantee is encoded.
- Distinguished protocol/non-protocol trading fees, configured creator/partner trading-fee shares, migration-fee sharing, the fixed migration deduction, surplus allocation, and migrated LP ownership.
- Corrected Invent migration fee validation to the audited template's 0–50% range; documented the SDK's broader 99% bound separately.
- Added explicit mode-5 ascending price checkpoints in the analytical wizard and mode-specific validation. Modes 1 and 3 do not require a direct migration percentage; mode 0 requires quote threshold; mode 3 requires 16 positive weights; mode 4 requires midpoint; mode 5 accepts optional segment weights.
- Corrected labels that called locally checked recipes “Meteora validated”. They remain local input checks, not protocol validation.
- Kept Invent config generation disabled. Readiness diagnostics identify missing fields; output remains an explanatory note, not JSONC presented as executable.
- Removed unsupported migration-keeper identities and 10 SOL threshold language from the public-facing proposal copy; no keeper qualification or automatic migration guarantee is claimed.
- Removed four unsupported composite `/100` ratings from the recipe UI, comparison metrics, type contract, and report generation. Trade-off explanations remain qualitative and input-specific.
- Added requirement-flow collection for LP distribution/vesting, SDK-backed local checks, mode-aware migration selection, RPC evidence-source labeling and injected fault coverage, side-by-side parameter consequences, and lazy page loading.

## Curve calculation fidelity

All CurveScope segment charts and derived outputs are analytical approximations. They use floating point and do not reproduce SDK integer rounding, full SDK parameter derivation, or on-chain state. Mode 2's midpoint/allocation, mode 3's segment weighting interpretation, and mode 5's weighted segment construction are visual assumptions. The SDK-builder regression invokes installed official SDK builders directly for six structurally valid examples; it does not prove CurveScope chart equality with those outputs.

## Export validation state

Invent source at `dd77ef3d5aede3f0ff21d566d052097200417f5e` uses a JSONC parser and internal config validation. No standalone offline schema/validation command was found. The relevant CLI flow dispatches into config/pool creation and transaction construction; it was not run. There is no official-parser acceptance evidence, no serializer round-trip, and no “Invent-validated” artifact. Full export remains unimplemented and unsafe to claim.

## Implemented / tested / planned

**Implemented:** local requirements-to-recipe wizard; analytical chart; recipe library; three-recipe comparison and parameter consequence explanations; local mode-specific validation; LP allocation and vesting inputs; SDK-backed local LP checks; read-only SDK state inspection; injected RPC evidence labeling; Invent readiness checklist; export disabled; lazy page loading; free local workflow.

**Tested in this run:** 34 unit tests across 3 test files, including mode-required parameters, fee boundaries/shares, mode 5 structure, LP total/lock constraints, export-disabled readiness, SDK builders for modes 0–5, RPC invalid keys/missing/wrong-owner/undecodable accounts, injected 429/timeout/unavailable cases, recipe ID collision prevention, and trade-off behavior; lint; TypeScript and production build.

**Not implemented or not verified:** complete Invent configuration draft UI/serializer, official parser acceptance, JSONC round trip, full collection of DBC/DAMM fee unions, locked token vesting and all conditional fields, live-provider RPC reliability, CurveScope-vs-SDK curve parity, project development history before September 14, 2026, demonstrated competitor differentiation, user adoption or volume.

## Crypto World's Fair judging evidence (official rules checked 2026-10-09)

The official rules list Functionality, Potential Impact, Novelty, UX, Open-source, and Business Plan. The campaign FAQ also describes Founder + Market Fit, Insight, Product + Execution, Potential Market Size, Founder Communication, Viability, and Traction. These are distinct official source presentations; use the final portal's current instructions if anything changes.

- **Functionality:** requirements wizard, recipe synthesis, comparison and readiness panel were manually exercised; the recorded test run reports 34 automated tests. Invent configuration validation/export and deployment are absent.
- **Potential Impact:** a local planner could help developers reason about DBC inputs; no market sizing or ecosystem impact evidence exists.
- **Novelty:** requirements intake and direct scenario consequences are implemented; unique differentiation is unproven.
- **UX:** mode-specific inputs, local validation messages, and estimate/readiness distinctions are visible; no independent usability testing exists.
- **Open-source:** source is locally committed, but there is no public repository URL and no license file. Public open-source readiness is incomplete pending owner approval, license choice, and third-party asset/code review.
- **Business Plan:** the product description and cost/dependency notes exist; no validated demand, GTM, revenue, or scalable business model is established.

**Readiness: CONDITIONALLY READY for a demo explicitly framed as an analytical planning MVP; NOT READY for claims of official Invent compatibility, protocol-exact simulation, public open-source readiness, or deployment readiness.** Portal registration, team details, pre-sprint work disclosure, repository publication/license, and both videos remain outstanding owner-controlled steps.

## Final command results (2026-10-09)

- `npm test`: exit 0; 3 test files passed, 34 tests passed.
- `npm run lint`: exit 0; oxlint produced no diagnostics.
- `npm run build`: exit 0; `tsc -b` and Vite production build passed. Route/page, chart, and SDK chunks are split. Vite emitted the >500 kB chunk warning for the Solana/Meteora SDK chunk at 768.03 kB (198.97 kB gzip); main JS is 251.22 kB (78.90 kB gzip), chart chunk is 329.91 kB (95.95 kB gzip), CSS 49.99 kB (8.48 kB gzip).
- SDK builder test scope: tests invoke all six installed builder functions with distinct valid inputs. They do not check CurveScope math parity.
- RPC tests inject transport/account behavior; no live provider integration was run. Not run: Invent parser/CLI validation, JSONC round trip, or live state integration cases. No successful result is claimed for these.

