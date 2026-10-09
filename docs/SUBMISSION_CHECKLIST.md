# Submission evidence checklist

Official Crypto World's Fair judging dimensions are published in the [official rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf): Functionality, Potential Impact, Novelty, UX, Open-source, and Business Plan. The Colosseum campaign FAQ also describes seven broader evaluation areas, including Founder + Market Fit, Insight, Product + Execution, Potential Market Size, Founder Communication, Viability, and Traction. Use the official submission form and rules if wording differs. Do not present judge scores or guarantees.

| Judging area | Observable evidence in MVP | Remaining gap |
|---|---|---|
| Meteora integration depth | DBC SDK 1.5.13 dependency; six SDK builder fixture test; read-only SDK state inspection; protocol-aware input checks | No Invent-validated export, exact chart parity, or transaction flow |
| Technical execution | 33 unit tests, TypeScript production build, lint (see audit results); route-level lazy loading separates page and chart code | Main entry remains above Vite's 500 kB warning threshold; RPC fault tests use injected dependencies rather than a live provider |
| Originality and taste | Requirements intake, explanatory recipes, pairwise scenario consequences, local readiness checklist | Differentiation vs other tools is not independently established; no user study |
| Impact potential | Free offline developer workflow, reusable illustrative presets, mode-aware local validation, readiness diagnostics | No adoption or ecosystem impact data; export gap limits interoperability |
| Traction / volume | No fabricated metrics; no paid dependency in core workflow | No user/volume evidence; no mainnet deployment feature |

## Submission package

See [SUBMISSION_PACKAGE.md](SUBMISSION_PACKAGE.md) for a ready-to-review product description, demo/pitch scripts, claim evidence, limitations, owner-input checklist, deadline conversion, official source links, and prior-work disclosure requirement. Team history and all portal fields are not inferable from this repository and remain owner-supplied.

## Demo boundaries

Describe curve charts as estimates; show the three scenarios and trade-offs; demonstrate the mode-specific validation; open Invent readiness to show missing config fields. Do not call the artifact Invent-ready or run it through creation commands. Public RPC inspection is read-only and may be unavailable.

See [DEMO_GUIDE.md](DEMO_GUIDE.md) for a reproducible local scenario, including incomplete/invalid input feedback, comparative consequences, and export boundaries.
