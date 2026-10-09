# Meteora integration status

## Sources and package

CurveProof uses installed `@meteora-ag/dynamic-bonding-curve-sdk@1.5.13` and Solana web3.js for optional read-only inspection. The SDK README lists DBC program ID `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`. The requested [DBC developer guide](https://docs.meteora.ag/developer-guides/dbc) was inaccessible to the audit reader; formulas were checked at [DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas). Invent source/config was inspected at commit `dd77ef3d5aede3f0ff21d566d052097200417f5e`.

## Invent builder modes

| Mode | Builder and required inputs in audited template |
|--|--|
| 0 | `buildCurve`: `percentageSupplyOnMigration`, `migrationQuoteThreshold` |
| 1 | `buildCurveWithMarketCap`: `initialMarketCap`, `migrationMarketCap` |
| 2 | `buildCurveWithTwoSegments`: market caps, migration percentage |
| 3 | `buildCurveWithLiquidityWeights`: market caps, 16 liquidity weights |
| 4 | `buildCurveWithMidPrice`: market caps, `midPrice`, migration percentage |
| 5 | `buildCurveWithCustomSqrtPrices`: ascending decimal `prices` (2+), optional weights count `prices.length - 1` |

CurveProof has mode-specific local inputs and validation. SDK builders are directly exercised in tests. CurveProof's own curve plots remain approximate for every mode and should not be described as SDK output. The analytical engine may draw a different number/shape of segments from the selected official builder contract.

## Fees and migration

Official formulas distinguish trading fees (20% protocol, 80% non-protocol; creator share configures creator/partner split of the latter), configured migration fee and its creator share, fixed 0.2% protocol migration-liquidity deduction, surplus allocation, pool creation fee, migrated DAMM v2 fee, and LP ownership/lock/vesting. The 20/80 rule concerns the trading fee only; it is not a migrated LP ownership split, and the creator/partner sharing configuration does not imply the protocol share. Do not conflate these. Invent template migration fee range is 0–50%; the SDK generic bound is wider.

The current workflow gathers LP allocations and vesting inputs and applies SDK helper validation locally. This is not a complete Invent field model or official parser result. Export is disabled, and no executable Invent config is produced.

## Invent export

Export is disabled. Readiness diagnostics list incomplete fields. Invent uses JSONC parsing and internal validation in its CLI workflow; no standalone offline parser was available in the inspected revision. CLI config/pool-creation flow was not run. No official parser acceptance or round-trip is claimed. See [audit](PROTOCOL_AUDIT.md).
