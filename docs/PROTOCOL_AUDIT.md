# Meteora DBC References and Validation Boundaries

This document summarizes the public protocol references consulted during development and states what CurveScope does—and does not—validate. It is not a security audit, official Meteora review, or guarantee of compatibility with future SDK/config versions.

## References consulted

- [Meteora DBC formulas](https://docs.meteora.ag/core-products/dbc/formulas)
- [Meteora DBC developer guide](https://docs.meteora.ag/developer-guides/dbc)
- [Meteora Invent DBC config template at inspected commit](https://github.com/MeteoraAg/meteora-invent/blob/dd77ef3d5aede3f0ff21d566d052097200417f5e/studio/config/dbc_config.jsonc)
- [Meteora Invent source at inspected commit](https://github.com/MeteoraAg/meteora-invent/tree/dd77ef3d5aede3f0ff21d566d052097200417f5e)
- [Meteora Dynamic Bonding Curve SDK](https://github.com/MeteoraAg/dynamic-bonding-curve-sdk)

The inspected local SDK version was `@meteora-ag/dynamic-bonding-curve-sdk@1.5.13`. Protocol documentation, config templates, and SDK APIs can change; verify current official tooling before using any real launch configuration.

## DBC concepts represented

- The formula documentation describes concentrated-liquidity segment equations and a graduation condition based on quote reserve reaching the configured migration quote threshold. This does not establish a universal raise minimum.
- The documented DBC trading-fee split assigns 20% to protocol and 80% to the non-protocol portion. Creator/partner allocation applies to the non-protocol portion. This trading-fee split is distinct from migration-fee sharing, migration liquidity deductions, surplus allocation, and migrated LP ownership.
- The inspected Invent template describes builder input modes 0–5 with different parameter requirements: migration percentage/quote threshold; initial and migration market caps; two-segment parameters; 16 liquidity weights; midpoint parameters; and custom ascending price checkpoints with optional weights.
- The inspected Invent template documents a migration fee range of 0–50%; a broader numeric bound exposed by a generic SDK constant should not be interpreted as Invent config acceptance.
- LP distribution, locking, vesting, activation type, token policy, fee claimer, leftover receiver, and migrated-pool fee settings are separate configuration concerns.

These notes summarize inspected sources and are not a substitute for checking the current official configuration and SDK contracts.

## What CurveScope implements

- Requirements-to-recipe workflow for DBC builder modes 0–5.
- Local mode-specific input checks and selected helper validation using the installed SDK.
- Analytical curve charts, estimated metrics, qualitative trade-off descriptions, and three-recipe comparisons.
- Readiness diagnostics that identify missing or incomplete configuration fields.
- Optional read-only SDK state inspection through an RPC endpoint.

## Important limits

- CurveScope uses floating-point analytical estimates. It does not reproduce all SDK integer rounding, derive every official parameter, or simulate on-chain state exactly.
- SDK builder tests using structurally valid examples do not prove that CurveScope's charts match SDK or on-chain outputs.
- Selected SDK helper checks are not full Invent parser/config validation.
- The current recipe model does not capture every Invent configuration field or conditional union.
- No complete serializer round-trip or reproducible official Invent parser-acceptance test has been established.
- Invent-compatible export remains disabled. CurveScope does not create executable Invent JSONC, sign transactions, or deploy pools.
- Optional RPC inspection depends on endpoint availability and may be rate-limited. Unit tests with injected dependencies do not prove end-to-end live-provider reliability.
- No user adoption, transaction volume, endorsement, market differentiation, or profitability claim is established by these technical checks.

## Fee terminology

Do not conflate:

1. DBC trading-fee protocol/non-protocol split;
2. creator/partner sharing of the non-protocol trading-fee portion;
3. configurable migration-fee sharing;
4. separate protocol migration-liquidity deduction;
5. surplus allocation; and
6. migrated-pool LP ownership, locks, and vesting.

The 20%/80% figure above refers to DBC trading fees, not migrated LP ownership.

## Verification status

Automated unit tests exercise selected local calculations, mode input rules, SDK builders, readiness behavior, and injected RPC failure cases. Passing tests support the tested code paths only. They do not establish complete protocol parity, official Invent acceptance, or safe launch readiness.

Before configuring or creating a real pool, review current Meteora documentation and use the official tooling's current validation and creation workflow independently.
