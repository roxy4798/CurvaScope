# CurveScope — Crypto World's Fair submission package

Prepared 2026-10-09. Submission deadline and portal fields must be rechecked before upload. This document is a draft; bracketed founder/team fields require owner input.

## Product description

**CurveScope is a free, local-first planning workbench for Meteora Dynamic Bonding Curve launches. It turns a developer's launch requirements into mode-aware analytical recipes, compares three candidate configurations, explains their parameter trade-offs, checks selected inputs against the installed DBC SDK, and identifies what remains before configuring through Meteora Invent. It does not create a verified Invent configuration or deploy pools.**

## Problem, users, and relationship to Meteora Invent

DBC builders must translate launch goals into distinct curve-builder inputs, fee settings, migration choices, and liquidity decisions. The current official Invent workflow is the place to configure and create DBC configurations/pools. CurveScope addresses the earlier planning step: it helps a builder state requirements, compare candidate settings, and see assumptions and missing inputs before switching to Invent.

Target users: developers and token teams evaluating Meteora DBC launch parameters. CurveScope complements Invent by providing requirements intake and comparative analysis; it does not replace Invent's complete configuration workflow, official validation, or pool creation. Curves and migration estimates are analytical, SDK parity is not claimed, export is disabled, and deployment is unsupported.

## Three-minute technical demo script

Use `npm run dev` with installed dependencies. Work offline; do not open On-Chain Proof. Use the clearly labeled example profile and no wallet.

| Time | Screen/action | Narration |
|---|---|---|
| 0:00–0:20 | Overview | “CurveScope helps DBC developers compare candidate launch settings before they configure a pool in Meteora Invent. It is a local analytical planner, not a deployment tool.” |
| 0:20–0:55 | Launch Profile: enter or review token requirement; choose Mode 2; show initial and graduation market cap and supply percentage | “Requirements map to the chosen builder's input shape. The chart and derived quantities are explanatory estimates, not SDK-exact output.” |
| 0:55–1:25 | Fee/migration steps: adjust base fee; open migration option; show LP allocation/vesting fields; enter complete illustrative allocation or briefly show missing-field feedback | “Trading-fee sharing, migration fees, and LP ownership are separate. Selected liquidity fields are checked locally using SDK helpers, not by Invent's parser.” |
| 1:25–1:55 | Synthesize and Recipe Lab | “The readiness panel separates recipe availability and local checks from missing fields, unverified Invent validation, and unsupported deployment.” Show export remains disabled. |
| 1:55–2:35 | Comparison: choose three recipes and show “What the parameter differences change,” then chart | “This compares inputs and direct consequences side by side. It does not rank launches or predict returns.” |
| 2:35–3:00 | Methodology or limitations | “The formulas, estimates, assumptions, and source links are documented. When ready to build, complete and validate the configuration through current Meteora tooling.” |

## Two-to-three-minute pitch script (draft)

**0:00–0:25 — Problem.** “A DBC launch starts with a set of goals—how much supply to put on the curve, where to target graduation, and how fees and post-migration liquidity should work. Those goals become several mode-specific configuration choices. Comparing the consequences before filling a full configuration can be difficult.”

**0:25–0:55 — Product.** “CurveScope is a free, local-first planning workbench for that step. A builder enters launch requirements, creates an analytical recipe, and compares three alternatives with their assumptions and missing decisions visible.”

**0:55–1:25 — Why it fits Meteora.** “Meteora Invent remains the configuration and pool-creation workflow. CurveScope complements it: selected input checks use the installed DBC SDK, while readiness diagnostics point out what the current recipe still does not represent. We do not label local checks as official Invent validation.”

**1:25–1:55 — Demonstration/evidence.** “The current implementation supports separate forms for the six documented builder modes, qualitative parameter trade-offs, LP allocation and vesting inputs, three-scenario comparisons, and read-only pool inspection. Automated checks currently cover [owner: insert the verified test/build results and date before recording].”

**1:55–2:25 — Honest boundary and direction.** “The charts are floating-point analytical models, not protocol-exact curves. Invent export is disabled because we have not established a complete serializer and reproducible official parser-validation path. We have no adoption or volume metrics to claim. Our next step is to validate the workflow with DBC developers and close the schema-validation gap before enabling export.”

**2:25–2:45 — Team.** “[Owner: add names, relevant experience, why this team understands the problem, and actual commitment. Do not record this placeholder.]”

Before recording, replace bracketed text with true owner/team facts. Do not imply live user feedback, performance improvements, or Meteora endorsement.

## Defensible claims and evidence

| Claim | Evidence and boundary |
|---|---|
| CurveScope offers a requirements-to-recipe workflow and reusable examples. | Implemented in `src/pages/RequirementsWizardPage.tsx`, `src/data/exampleRecipes.ts`, and `src/data/recipeFactory.ts`; presets are illustrative. |
| The workflow distinguishes six DBC curve build modes. | `buildCurveMode`-specific UI/validation; SDK builder regression tests cover modes 0–5. This does not establish CurveScope chart parity. |
| It compares three recipes and explains parameter differences. | `src/pages/ComparisonPage.tsx`, `src/engine/scenarioInsights.ts`, and `tests/engine.test.ts`. No composite ranking or outcome prediction. |
| Some local LP checks call installed SDK validators. | `src/engine/inventConstraints.ts`; local helper checks are not full Invent CLI/parser acceptance. |
| Pool inspection is read-only and labels injected test evidence. | `src/adapters/solana/readOnlyClient.ts` and `tests/readOnlyClient.test.ts`; no live provider success is claimed here. |
| Invent export and deployment are unavailable. | Export is explicitly disabled in `src/adapters/meteora/inventSerializer.ts`; no wallet or transaction path is part of this MVP. |
| The MVP has no mandatory paid API or database. | `package.json`, `docs/COST_AND_DEPENDENCIES.md`; optional RPC uses a public endpoint and can fail or rate-limit. |

## Limitations statement

CurveScope is an analytical planning MVP. Curve and slippage visualizations use floating-point approximations and are not proven equivalent to SDK/on-chain results. The recipe model does not cover all Invent config unions/fields. SDK helper checks do not prove Invent parser acceptance. Export is disabled; no wallet signing, transaction submission, or deployment exists. Optional read-only RPC may be unavailable or rate-limited. There is no verified user research, adoption, TVL, volume, revenue, performance gain, or endorsement evidence. Presets are illustrative engineering examples, not financial advice.

## Official submission checklist

The Colosseum project FAQ and official rules are primary; inspect the live submission form because fields may change. English is required by the official rules. Do not upload until each owner-only item below is supplied and reviewed.

### Official portal requirements / requested information

- [ ] Each team member registers individually; each person may belong to one team; each team has one submission.
- [ ] Team leader completes and submits the project before **October 12, 2026, 11:59 p.m. Pacific Time**. In Jakarta (UTC+7), that is **October 13, 2026, 1:59 p.m.** Colosseum's clock and any announced deadline change control.
- [ ] Product name and brief description.
- [ ] Integrated blockchains and tools.
- [ ] Every teammate, background and previous experience.
- [ ] Team location.
- [ ] Product logo or graphic.
- [ ] GitHub repository link (private repositories require granting reviewer access to `hackathon@colosseum.com`; public repo link not yet created).
- [ ] Presentation video, **2–3 minutes**.
- [ ] Product demo video, **3 minutes maximum**.
- [ ] Go-to-market strategy, demand validation, and distribution plan.
- [ ] Disclose relevant development work completed before **September 14, 2026**. The current directory has a local Git repository, but its first recorded commit is not proof of the project start date; review [PROJECT_HISTORY_AND_DISCLOSURE.md](PROJECT_HISTORY_AND_DISCLOSURE.md) and resolve the owner questions before submitting.
- [ ] Check eligibility and accept current official rules in the portal.
- [ ] Review and disclose ownership/status of third-party code and IP as requested by the rules.

### Owner-supplied information still needed

- [ ] Team member names, roles, location, profile registrations, experience, and founder-market fit.
- [ ] Actual project start date and the complete list of relevant pre-September 14 work/code, if any; disclose this accurately in the portal.
- [ ] Confirmation whether any external work, assets, or code were used and rights/attribution are clear.
- [ ] Demand-validation evidence or an explicit statement that validation has not yet been performed.
- [ ] Credible business model/GTM hypotheses, labeled as hypotheses where unvalidated.
- [ ] Product logo approved for external use.
- [ ] Public GitHub remote/repository URL, after owner approval and publication.
- [ ] Final recorded pitch/demo videos.
- [ ] Final recheck of live official rules, form fields, deadline, eligibility, and applicable local restrictions.

## Sources

- [Crypto World's Fair Official Hackathon Rules (PDF)](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)
- [Crypto World's Fair official campaign page and FAQ](https://colosseum.com/hackathon?year=fall2026)
- [Crypto World's Fair official entry page](https://colosseum.com/worldsfair)
