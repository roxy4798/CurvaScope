# CurveProof methodology

> CurveProof outputs are analytical estimates, not Meteora SDK/on-chain parity. The official formulas are documented in the [DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas). Mode inputs below follow the audited Invent discriminated types; charts do not claim to reproduce those builders.

## Curve math

For a concentrated-liquidity price interval, the explanatory formulas are `base = L(1/√P_lower − 1/√P_upper)` and `quote = L(√P_upper − √P_lower)`. Migration threshold is the sum of quote across segments and graduation is quote reserve at least the threshold. CurveProof uses floating-point calculations for visualization and approximate slippage comparisons. It does not perform SDK fixed-point rounding.

## Mode inputs

Modes 0–5 use their documented mode-specific parameters: mode 0 migration percentage and quote threshold; mode 1 initial/migration MC; mode 2 MCs and migration percentage; mode 3 MCs and 16 weights; mode 4 MCs, midPrice, and migration percentage; mode 5 ascending prices with optional weights. Mode 2 midpoint, weighted-liquidity interpretation, and chart segment allocation are analytical assumptions. The six SDK builders have smoke/regression coverage using the installed package, but no chart parity test.

## Fee semantics

Trading-fee sharing, configurable migration-fee sharing, protocol migration deductions, surplus allocation, pool-creation charges, migrated-pool fees, and post-migration LP ownership/locks are distinct mechanisms. See the protocol audit for the exact verified distinctions. CurveProof does not collapse these into an overall rating. Trade-off cards are qualitative descriptions of chosen inputs and do not predict outcomes or constitute financial advice.

Presets are illustrative engineering starting points. They are not Meteora-endorsed, optimal, guaranteed to graduate, or financial advice. See [audit](PROTOCOL_AUDIT.md) and [limitations](KNOWN_LIMITATIONS.md).
