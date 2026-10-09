import type { DbcRecipe } from '../../domain/types';

export interface InventReadinessItem {
  field: string;
  state: 'complete' | 'missing' | 'invalid' | 'conditional' | 'not-verified' | 'unsupported';
  reason: string;
  remedy: string;
}

export interface ConfigurationReadiness {
  analyticalRecipe: 'available';
  requiredInputs: 'incomplete' | 'complete';
  localValidation: 'passed' | 'issues';
  officialInventValidation: 'not-verified';
  onChainDeployment: 'unsupported';
  fields: InventReadinessItem[];
}

/** Audits the current analytical recipe against Invent's DBC config field groups. */
export function getInventExportReadiness(recipe: DbcRecipe): ConfigurationReadiness {
  const r = recipe.requirements;
  const modeParametersComplete = (() => {
    switch (r.buildCurveMode) {
      case 0: return Number.isFinite(r.percentageSupplyOnMigration) && r.percentageSupplyOnMigration > 0 && r.percentageSupplyOnMigration < 100 && Number.isFinite(r.targetQuoteRaise) && r.targetQuoteRaise > 0;
      case 1: return Number.isFinite(r.initialMarketCap) && r.initialMarketCap > 0 && Number.isFinite(r.migrationMarketCap) && r.migrationMarketCap > r.initialMarketCap;
      case 2: return Number.isFinite(r.initialMarketCap) && r.initialMarketCap > 0 && Number.isFinite(r.migrationMarketCap) && r.migrationMarketCap > r.initialMarketCap && Number.isFinite(r.percentageSupplyOnMigration) && r.percentageSupplyOnMigration > 0 && r.percentageSupplyOnMigration < 100;
      case 3: return Number.isFinite(r.initialMarketCap) && r.initialMarketCap > 0 && Number.isFinite(r.migrationMarketCap) && r.migrationMarketCap > r.initialMarketCap && r.liquidityWeights?.length === 16 && r.liquidityWeights.every((weight) => Number.isFinite(weight) && weight > 0);
      case 4: return Number.isFinite(r.initialMarketCap) && r.initialMarketCap > 0 && Number.isFinite(r.migrationMarketCap) && r.migrationMarketCap > r.initialMarketCap && Number.isFinite(r.midPriceQuote) && r.midPriceQuote! > 0 && Number.isFinite(r.percentageSupplyOnMigration) && r.percentageSupplyOnMigration > 0 && r.percentageSupplyOnMigration < 100;
      case 5: return Boolean(r.curvePrices && r.curvePrices.length >= 2 && r.curvePrices.every((price, index) => Number.isFinite(price) && price > 0 && (index === 0 || price > r.curvePrices![index - 1])) && (!r.liquidityWeights || (r.liquidityWeights.length === r.curvePrices.length - 1 && r.liquidityWeights.every((weight) => Number.isFinite(weight) && weight > 0))));
      default: return false;
    }
  })();
  const lp = r.liquidityDistribution;
  const lpKeys = ['partnerLiquidityPercentage', 'creatorLiquidityPercentage', 'partnerPermanentLockedLiquidityPercentage', 'creatorPermanentLockedLiquidityPercentage'] as const;
  const lpMissing = lpKeys.filter((key) => !Number.isFinite(lp?.[key]));
  const lpInvalid = recipe.validation.errors.some((error) => error.code.startsWith('ERR_LP_') || error.code.startsWith('ERR_VESTING_'));
  const lpState: InventReadinessItem['state'] = lpMissing.length ? 'missing' : lpInvalid ? 'invalid' : 'complete';
  const hasVestingInput = Boolean(lp?.partnerLiquidityVestingInfoParams || lp?.creatorLiquidityVestingInfoParams);
  const migrationModeInvalid = recipe.validation.errors.some((error) => error.code === 'ERR_DAMM_V1_DEPRECATED');
  const fields: InventReadinessItem[] = [
    { field: 'Quote mint', state: r.quoteMintAddress ? 'complete' : 'missing', reason: 'Invent uses this mint to denominate price and select the quote token.', remedy: 'Select a quote mint and verify its decimals for any external configuration.' },
    { field: 'Token supply and decimals', state: Number.isFinite(r.totalSupply) && r.totalSupply > 0 && [6, 7, 8, 9].includes(r.tokenDecimals) ? 'complete' : 'invalid', reason: 'The SDK builder uses supply and token decimals to derive curve amounts.', remedy: 'Set positive total supply and supported token decimals.' },
    { field: `Mode ${r.buildCurveMode} parameters`, state: modeParametersComplete ? 'complete' : 'invalid', reason: 'Each Invent builder mode accepts a distinct set of curve inputs.', remedy: 'Resolve the mode-specific validation messages in the wizard.' },
    { field: 'token.tokenType / tokenAuthorityOption / leftover', state: 'missing', reason: 'The analytical recipe does not represent the complete Invent token policy.', remedy: 'Choose SPL or Token-2022, authority behavior, and leftover amount in Invent.' },
    { field: 'fee.baseFeeParams', state: 'conditional', reason: 'CurveScope captures a simplified base fee preference; Invent requires a fee-mode discriminated structure and all scheduler or rate-limiter fields.', remedy: 'Select the exact Invent fee mode and complete its required parameter object.' },
    { field: 'fee.dynamicFeeEnabled / collectFeeMode / poolCreationFee', state: 'conditional', reason: 'Some fee preferences are modeled but not with Invent’s full fields or units.', remedy: 'Review each fee field against the current Invent config template.' },
    { field: 'migration option and migrated pool fee', state: migrationModeInvalid ? 'invalid' : 'conditional', reason: 'Migration option is selected, but the current form does not represent custom migratedPoolFee or market-cap scheduler combinations.', remedy: migrationModeInvalid ? 'Choose DAMM v2 for a new-pool configuration.' : 'Review dependent migratedPoolFee fields in the official config when using custom or scheduler-based fees.' },
    { field: 'LP allocations and permanent locks', state: lpState, reason: lpMissing.length ? 'Invent/SDK requires all four claimable and permanent-lock shares to evaluate total allocations.' : 'The entered LP shares were checked with installed SDK validators; this is not Invent CLI acceptance.', remedy: lpMissing.length ? `Enter the missing fields: ${lpMissing.join(', ')}.` : 'If using vesting, complete the applicable schedule and review the one-day locked-liquidity condition.' },
    { field: 'Creator/partner vesting schedules', state: lpInvalid && hasVestingInput ? 'invalid' : hasVestingInput ? 'complete' : 'conditional', reason: 'Vesting parameters are optional for DAMM v2 and unsupported with DAMM v1; configured schedules are checked locally by the installed SDK.', remedy: 'For each configured schedule, enter vesting %, BPS/period, period count, cliff, and total duration.' },
    { field: 'lockedVesting / activationType', state: 'missing', reason: 'Token locked vesting and slot/timestamp activation are distinct from LP position locking.', remedy: 'Choose activation type and complete lockedVesting fields in Invent.' },
    { field: 'feeClaimer / leftoverReceiver', state: 'missing', reason: 'Invent requires valid public keys for fee claims and leftover tokens.', remedy: 'Supply the intended addresses in the official workflow; CurveScope does not invent them.' },
    { field: 'dbcPool creator / token metadata', state: 'conditional', reason: 'Needed for pool creation, not for an analytical recipe or config-only action.', remedy: 'For pool creation, provide creator and metadata URI or the complete metadata upload fields.' },
    { field: 'Official Invent parser/config validation', state: 'not-verified', reason: 'The current Invent helper parses JSONC and checks selected addresses; its create action also builds a transaction.', remedy: 'No validation claim is made until an isolated official, non-transaction validation harness exists.' },
    { field: 'On-chain deployment', state: 'unsupported', reason: 'CurveScope is read-only and has no wallet or transaction path.', remedy: 'Deployment is outside this MVP; use official Meteora tooling separately.' },
  ];
  const requiredInputs = fields.some((item) => ['missing', 'invalid'].includes(item.state)) ? 'incomplete' : 'complete';
  return {
    analyticalRecipe: 'available',
    requiredInputs,
    localValidation: recipe.validation.isValid ? 'passed' : 'issues',
    officialInventValidation: 'not-verified',
    onChainDeployment: 'unsupported',
    fields,
  };
}

/**
 * Returns an analytical configuration gap report and diagnostics summary.
 * NOT an official Invent configuration. Export remains disabled.
 */
export function formatInventJsonc(recipe: DbcRecipe): string {
  const readiness = getInventExportReadiness(recipe);
  const unrepresentedFields = readiness.fields.filter((f) =>
    ['missing', 'invalid', 'conditional', 'not-verified', 'unsupported'].includes(f.state)
  );

  return `// ============================================================================
// CURVESCOPE ANALYTICAL CONFIGURATION GAP REPORT — NOT AN INVENT CONFIGURATION
// ============================================================================
// Recipe: ${recipe.title} (ID: ${recipe.id})
// Selected Builder Mode: Mode ${recipe.requirements.buildCurveMode}
//
// CRITICAL BOUNDARY NOTICE:
// 1. Export is EXPLICITLY DISABLED. Schema completeness and official Meteora Invent
//    parser acceptance are UNVERIFIED.
// 2. DO NOT copy this draft into studio/config/dbc_config.jsonc or execute pool creation.
// 3. Local consistency checks and selected SDK helper checks DO NOT equal official
//    Invent CLI validation or on-chain transaction deployment.
// 4. Official configurations must be authored and validated independently using current
//    Meteora Invent tooling: https://docs.meteora.ag/developer-guides/dbc
// ============================================================================

// READINESS DIAGNOSTICS:
// - Analytical Recipe:            ${readiness.analyticalRecipe.toUpperCase()}
// - Required Inputs:              ${readiness.requiredInputs.toUpperCase()}
// - Local Consistency Checks:     ${readiness.localValidation.toUpperCase()}
// - Official Invent Validation:   NOT-VERIFIED
// - On-Chain Deployment:          UNSUPPORTED

// UNRESOLVED / MISSING / CONDITIONAL INVENT SCHEMA FIELDS (${unrepresentedFields.length} items):
${unrepresentedFields
  .map(
    (item) => `// [${item.state.toUpperCase()}] ${item.field}
//   Reason: ${item.reason}
//   Action: ${item.remedy}`
  )
  .join('\n\n')}

// ============================================================================
// Official Meteora Invent Repository & Schema:
// https://github.com/MeteoraAg/meteora-invent
// ============================================================================`;
}

/**
 * Returns human-readable markdown configuration report
 */
export function formatHumanReadableReport(recipe: DbcRecipe): string {
  const { requirements, derivedMetrics, tradeOffs, validation } = recipe;

  return `# CurveScope Launch Recipe Report: ${recipe.title}

- **ID**: \`${recipe.id}\`
- **Category**: \`${recipe.category}\`
- **Generated**: ${recipe.createdAt}
- **Local Consistency Checks**: ${validation.isValid ? 'PASSED (not protocol validated)' : 'INPUT ERRORS'}

---

## 1. Executive Summary
${recipe.description}

- **Token**: ${requirements.tokenName} (\`${requirements.tokenSymbol}\`)
- **Total Supply**: ${requirements.totalSupply.toLocaleString()}
- **Decimals**: ${requirements.tokenDecimals}
- **Quote Asset**: ${requirements.quoteSymbol} (\`${requirements.quoteMintAddress}\`)
- **Target Quote Raise**: ${requirements.targetQuoteRaise.toLocaleString()} ${requirements.quoteSymbol}

---

## 2. Bonding Curve Economics
- **Initial Valuation**: ${requirements.initialMarketCap.toLocaleString()} ${requirements.quoteSymbol}
- **Graduation Valuation**: ${requirements.migrationMarketCap.toLocaleString()} ${requirements.quoteSymbol}
- **Starting Price**: ${derivedMetrics.initialPriceQuote.toExponential(6)} ${requirements.quoteSymbol}
- **Migration Price**: ${derivedMetrics.migrationPriceQuote.toExponential(6)} ${requirements.quoteSymbol}
- **Price Multiplier**: ${derivedMetrics.priceMultiplier.toFixed(2)}x
- **Tokens Migrated to DAMM v2**: ${derivedMetrics.baseTokensMigrated.toLocaleString()} (${requirements.percentageSupplyOnMigration}%)
- **Tokens Sold During Curve Phase**: ${derivedMetrics.baseTokensSoldOnCurve.toLocaleString()}
- **Leftover Base Tokens**: ${derivedMetrics.leftoverTokens.toLocaleString()}

---

## 3. Dynamic Fee Architecture
- **Base Fee**: ${(requirements.feePreferences.baseFeeBps / 100).toFixed(2)}% (${requirements.feePreferences.baseFeeBps} bps)
- **Fee Mode**: ${requirements.feePreferences.feeMode}
- **Decay Duration**: ${requirements.feePreferences.decayDurationSeconds / 60} minutes
- **Creator Fee Share**: ${requirements.feePreferences.creatorFeeSharePercent}% of non-protocol fees
- **Partner Fee Share**: ${100 - requirements.feePreferences.creatorFeeSharePercent}% of non-protocol fees
- **DAMM v2 Pool Fee**: ${(requirements.migrationPreferences.dammPoolFeeBps / 100).toFixed(2)}%

---

## 4. Quantitative Trade-Off Assessment

### Key Trade-Off Points:
${tradeOffs.items.map((it) => `- **${it.dimension}** (${it.choice}):\n  - Benefit: ${it.benefit}\n  - Drawback: ${it.drawback}\n  - Risk Level: ${it.riskSeverity.toUpperCase()}`).join('\n')}

---

## 5. Invent Configuration Readiness & Boundary Notice
This report is an analytical planning draft, not a deployable Meteora Invent configuration.
- Schema completeness: UNVERIFIED. The official schema requires token policy, full fee unions, migration fee schedules, complete LP allocation & vesting structures, locked token vesting, activation type, feeClaimer, leftoverReceiver, and dbcPool metadata which CurveScope does not fully represent.
- Official Invent parser acceptance: UNVERIFIED.
- On-chain deployment: UNSUPPORTED. Do NOT attempt to use this draft directly to create on-chain pools.

For official Meteora Invent configuration templates and documentation, see:
- Official guide: https://docs.meteora.ag/developer-guides/dbc
- Official schema: https://github.com/MeteoraAg/meteora-invent/blob/main/studio/config/dbc_config.jsonc

Configurations must be independently authored, completed, and validated using current official Meteora tooling.
`;
}

/**
 * Returns CSV string representing segment table
 */
export function formatSegmentsCsv(recipe: DbcRecipe): string {
  const headers = [
    'Segment',
    'Price_Lower_Quote',
    'Price_Upper_Quote',
    'Virtual_Liquidity',
    'Base_Tokens_Sold',
    'Quote_Tokens_Required',
    'Cumulative_Quote',
    'Cumulative_Base',
  ];

  const rows = recipe.segments.map((seg) => [
    seg.segmentIndex + 1,
    seg.pLower.toExponential(6),
    seg.pUpper.toExponential(6),
    seg.virtualLiquidity.toFixed(2),
    seg.baseTokenAmount.toFixed(2),
    seg.quoteTokenAmount.toFixed(4),
    seg.cumulativeQuote.toFixed(4),
    seg.cumulativeBase.toFixed(2),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
