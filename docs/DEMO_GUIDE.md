# CurveProof demo runbook (offline)

This demo uses the repository's illustrative example recipes only. It makes no network calls, deployment, wallet connection, adoption, or performance claim.

## Start

1. Install the documented local dependencies with `npm install` once.
2. Run `npm run dev` and open the local URL printed by Vite.
3. Start on **Overview**. Explain the boundary banner: curve charts are estimates; SDK checks are local; Invent parser validation and deployment are unavailable.

## Requirements → recipe

1. Open **Launch Profile**. Keep the example AI-agent profile or enter a demo name/symbol and supply.
2. Select **Mode 2** and enter an initial market cap below the graduation market cap, plus the migration-supply percentage.
3. On the fee step, adjust the starting base fee or creator share. Explain that creator share only allocates the non-protocol part of DBC trading fees.
4. On migration, leave LP fields blank once to show that an analytical recipe can exist while Invent readiness is incomplete. Then enter all four LP buckets (example: partner 50%, creator 40%, permanent locks 5% + 5%). This example uses the SDK's LP validators and is not an endorsed setting. Leave optional vesting blank.
5. To show actionable validation, temporarily set one LP bucket so the total is not 100%, or enter mismatched market caps. Read the local error and remedy, correct it, then synthesize.

## Compare three recipes

1. Open **Comparison**.
2. Select three entries such as AI Agent Compute Launch, Tokenized Treasury Bill (RWA), and Viral Meme Fair Launch.
3. Review **What the parameter differences change** before reading the charts. Point out the different fee shares, migration-fee assumptions, price anchors, and builder modes.
4. Explain chart/metric limitations: floating-point analytical model; no SDK parity; the comparison reports input differences and direct consequences, with no composite outcome score or profitability/graduation guarantee.

## Readiness and methodology

1. Open **Recipe Lab** and select the **Invent Export Status** tab / **Full Export Hub**.
2. Show the five readiness states and field-by-field actions. Distinguish local validation from official Invent validation, which is not verified, and deployment, which is unsupported.
3. Open **Methodology** for source-derived formula summaries, SDK fee/vesting checks, estimates, and assumptions.

The demo does not require **On-Chain Proof**. If that page is shown, it makes an optional public-RPC read and can be rate-limited; never present test fixtures as live evidence.

## Expected boundary statement

“CurveProof helps compare and review analytical DBC recipes. It does not generate an Invent-compatible configuration or deploy a pool. Verify any actual configuration with current Meteora tooling.”
