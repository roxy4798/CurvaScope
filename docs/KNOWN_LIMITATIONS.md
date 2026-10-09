# Known limitations

- CurveProof is a free local analytical planner. It requests no wallet, private key, or mandatory paid API and submits no transactions.
- Curve charts, quote/migration quantities, and slippage are analytical estimates. CurveProof has no exact SDK or chain parity claim. Composite scorecards have been removed; trade-off descriptions remain qualitative.
- The recipe model now collects basic LP allocations and partner/creator vesting inputs, but does not capture every Invent field, including full fee unions, leftover, migration-specific DAMM v2 fee schedules, locked vesting, authority option, activation type, fee claimer/leftover receiver, and pool metadata. Invent export is disabled.
- No official Invent parser acceptance or serializer round trip has been performed. Invent schema compatibility is unverified.
- The audited Invent template documents LP allocations totaling 100% and a minimum locked/vested allocation condition. CurveProof applies installed SDK validators to the entered LP inputs; those checks do not prove full Invent parser acceptance or validate an entire export. The specific template comments are not treated as universal protocol rules.
- Local fee checks do not prove all combinations pass Invent or on-chain validation. The local migration fee ceiling follows audited Invent template 0–50%; installed SDK exposes broader generic numeric bounds.
- Public RPC inspection is optional and depends on endpoint availability/rate limits. Injected test data is labeled as test evidence, never live. RPC fault coverage is unit-level with injected fetch/account readers; it does not constitute end-to-end testing against a live RPC provider.
- Official Crypto World's Fair rules and the campaign FAQ were checked 2026-10-09. Competitor claims remain hypotheses; adoption, endorsements, and volume are not evidenced.

See [Protocol Audit](PROTOCOL_AUDIT.md) for the verified facts and evidence gaps.

