# CurveScope — Three-Minute Demo Runbook

## Recording status

The core Overview → wizard → LP validation → recipe synthesis → Recipe Lab → Comparison → Invent diagnostics → Methodology flow was exercised in a local browser. This is not a timed recording rehearsal. No RPC request, deployment, or video recording was performed.

Use a local development server. Avoid **On-Chain Proof** during this demo so the recording remains focused on the local workflow and does not depend on an RPC response. The site also references Google Fonts, so do not describe the whole application as offline.

## Runbook (target: 2:50–3:00)

### 0:00–0:15 — Overview

**Action:** Show Overview and click **Launch Requirements Wizard**.

**Narration:** “CurveScope helps DBC developers inspect candidate launch inputs and compare analytical recipes before completing configuration through Meteora Invent. It is a planning aid, not a deployment tool.”

### 0:15–0:55 — Five-step requirements wizard

**Action:** Show the wizard step labels in order: **Identity**, **Quote & Raise**, **Curve Mode**, **Fees**, **DAMM v2**. Briefly show token/asset fields, quote and target fields, the selected curve-mode inputs, fee preferences, and migration/LP inputs. On the final step, enter these illustrative LP shares: partner claimable 50%, creator claimable 40%, partner permanently locked 5%, creator permanently locked 0%.

**Observed validation:** At 50% partner claimable, 40% creator claimable, 5% partner permanently locked, and 0% creator permanently locked (95% total), the UI displayed `ERR_LP_DISTRIBUTION_SDK` with: **“LP allocations and vesting percentages must sum to 100% under the installed SDK validator.”** It also displayed the one-day minimum locked-liquidity helper error. Setting creator permanently locked LP to 5% (100% total) cleared both messages. This is selected SDK-helper validation, not Invent CLI validation.

**Narration:** “These are LP ownership inputs, separate from trading-fee sharing and migration-fee sharing. The example is intentionally invalid at 95%, and the selected SDK helper reports that the allocation does not sum to 100%. This is a local check, not proof that Invent accepts the full configuration.”

### 0:55–1:10 — Synthesize into Recipe Lab

**Action:** Click **Synthesize DBC Recipe** after the form is valid.

**Observed behavior:** Clicking the button generated a local recipe and opened Recipe Lab. The displayed recipe used Mode 2 and showed an analytical two-segment chart. No Invent configuration was produced.

**Narration:** “The requirements become a local analytical recipe. The recipe is not a deployable config.”

### 1:10–1:45 — Recipe Lab estimates

**Action:** Show the recipe chart, segment table, and trade-off panel. Point out that these are modeled values and explain one input difference without presenting a predicted outcome.

**Narration:** “The chart and segment values help inspect the assumptions encoded in the recipe. They use analytical calculations; they are not exact on-chain quotes or guarantees about a launched pool.”

### 1:45–2:20 — Three-scenario comparison

**Action:** Open **Comparison**. The three selectors, pairwise parameter-difference cards, comparative price chart, metric categories, and fill/slippage assumptions were observed. The first two default recipes had no differences in the comparison summary despite different names. Choose three distinct recipes before recording. A live selector mismatch was found and corrected: each scenario card and comparison column now follows its selected slot. The correction was visually rechecked with Mode 3 / SOL / 25 SOL in slot 2 and Mode 0 / USDC / 50,000 USDC in slot 3; the regression test covers this ordering.

**Narration:** “Here we can compare up to three candidate recipes. The page shows parameter differences and modeled trajectories. These charts and slippage simulations are assumption-dependent; they do not rank recipes or predict returns.”

### 2:20–2:45 — Invent readiness boundary

**Action:** In Recipe Lab, click **Invent Readiness & Diagnostics** to open **Configuration Diagnostics & Export**. Show the **Invent Readiness & Draft Diagnostics** tab and its readiness labels. Point to the notice **“Do not execute this draft with Meteora Invent.”**

**Observed:** The button opened diagnostics with required-inputs incomplete, local checks passed, official Invent validation not verified, and deployment unsupported. The warning identifies the output as an analytical draft, not an Invent configuration, and says not to use it to create pools. Copy was activated and its label changed to Copied!; clipboard contents were not read back. Download was not activated because the browser surface could not direct the file into the proposal workspace. Other tabs offer analytical report, segments CSV, and raw recipe JSON; none is a validated Invent config.

**Narration:** “CurveScope can show missing fields and local check status. It does not produce a schema-complete or officially validated Invent config. Configuration and pool creation remain in Meteora Invent.”

### 2:45–3:00 — Methodology and close

**Action:** Open **Methodology**. Review its distinction between formulas and estimates, graduation limits, local persistence, disabled Invent export, no-wallet/transaction scope, and optional RPC. The official formulas reference describes a 20% protocol / 80% non-protocol DBC trading-fee split; this concerns trading fees, not migrated LP ownership or migration-fee sharing. See the [official DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas).

**Narration:** “The methodology page documents the sources and limits. CurveScope is an early planning MVP; demand and distribution remain hypotheses.”

## Source and network boundaries

- Requirements, recipe generation, comparison, and methodology are implemented locally in the app. No RPC request is needed for these actions.
- index.html references Google Fonts; external font requests may occur during the demo.
- The **On-Chain Proof** route is optional and calls a selected RPC endpoint. Do not show a live result unless an actual request succeeds during the recording.
- Do not call SDK helper validation “Invent validation.” Do not call analytical chart values protocol-exact or contract-verified.

## Interaction verification matrix

| Demo item | Verified in code | Verified by actually running UI | Not verified |
|---|---|---|---|
| Overview and CTA into wizard | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | CTA opened wizard. |
| Five wizard steps / valid progression | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | All five steps displayed and advanced using existing defaults. |
| Invalid 95% allocation and error messages | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | Sum error and one-day locked-liquidity message appeared; both cleared at 100% with 10% locked. |
| Recipe generation and Recipe Lab navigation | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | Recipe generated and displayed with Mode 2 analytical chart. |
| Three-scenario comparison, chart, assumptions | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | All three slots and comparison output displayed. Default first/second recipes had no differences in the comparison summary. |
| Invent readiness and unsupported config export | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | `not-verified` and `unsupported` labels and warning displayed. Copy showed `Copied!`; clipboard text was not read back. Download not activated. |
| Recipe Library selection and navigation | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | Existing library recipes and user-created entries displayed; an illustrative recipe opened in Recipe Lab. No saved data was deleted. Persistence across reload was not tested. |
| On-Chain Proof route without wallet | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | Page opened with an empty address and disabled Verify button. No RPC call was initiated by this check. |
| Methodology page and stated network boundaries | VERIFIED IN SOURCE | VERIFIED IN LIVE UI | Local planning, localStorage, optional RPC, no wallet/transactions, and deployment limits displayed. No RPC request made. |
| Optional read-only RPC request | VERIFIED IN SOURCE | NOT TESTED | Inspector page was seen, but no address was entered and Verify was not clicked. |

**Before recording:** rehearse to the three-minute limit, choose three genuinely different scenarios, and avoid presenting any estimate as protocol output. Do not show the optional RPC inspector unless a safe test address and endpoint are available and the result is genuinely live.


The browser session used the Codex in-app browser because Chrome and Edge bindings were unavailable. Its viewport was narrow; rightmost navigation labels were partially clipped. Browser DevTools console and network logs were not exposed, so console errors and actual external requests were not independently inspected. No persistent screenshot files could be saved through the available browser surface; screenshots were observed inline during the session.
