import type { LaunchRequirements, ValidationResult, ValidationError, ValidationWarning } from '../domain/types';
import { MigrationOption, getLiquidityVestingInfoParams } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { validateLiquidityDistributionWithSdk } from './inventConstraints';
import { PROTOCOL_LIMITS } from '../domain/constants';

/**
 * Validates candidate DBC configurations against official Meteora DBC SDK
 * and on-chain protocol rules.
 */
export function validateDbcRequirements(requirements: LaunchRequirements): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let rulesCheckedCount = 0;

  // 1. Fee bounds check
  rulesCheckedCount++;
  const { baseFeeBps } = requirements.feePreferences;
  if (!Number.isFinite(baseFeeBps) || baseFeeBps < PROTOCOL_LIMITS.MIN_FEE_BPS || baseFeeBps > PROTOCOL_LIMITS.MAX_FEE_BPS) {
    errors.push({
      field: 'feePreferences.baseFeeBps',
      code: 'ERR_FEE_OUT_OF_BOUNDS',
      message: `Base fee of ${baseFeeBps} bps is invalid. Meteora DBC enforces [${PROTOCOL_LIMITS.MIN_FEE_BPS}, ${PROTOCOL_LIMITS.MAX_FEE_BPS}] bps (0.25% to 99.00%).`,
      actualValue: baseFeeBps,
      allowedRange: `${PROTOCOL_LIMITS.MIN_FEE_BPS} - ${PROTOCOL_LIMITS.MAX_FEE_BPS} bps`,
      remedyAction: `Set base fee between ${PROTOCOL_LIMITS.MIN_FEE_BPS} bps and ${PROTOCOL_LIMITS.MAX_FEE_BPS} bps.`,
    });
  } else if (baseFeeBps > 500) {
    warnings.push({
      field: 'feePreferences.baseFeeBps',
      message: `High base-fee input (${(baseFeeBps / 100).toFixed(2)}%) increases modeled per-swap cost; actual demand response is not modeled.`,
      tradeOffImplication: 'The configured base fee is high relative to the local comparison range; this does not predict fee revenue or bot behavior.',
    });
  }

  // 2. Validate only market-cap inputs required by the selected official builder.
  rulesCheckedCount++;
  const usesMarketCaps = [1, 2, 3, 4].includes(requirements.buildCurveMode);
  if (usesMarketCaps && (!Number.isFinite(requirements.initialMarketCap) || requirements.initialMarketCap <= 0 || !Number.isFinite(requirements.migrationMarketCap) || requirements.migrationMarketCap <= requirements.initialMarketCap)) {
    errors.push({
      field: 'migrationMarketCap',
      code: 'ERR_MARKET_CAP_NON_MONOTONIC',
      message: `Graduation market cap (${requirements.migrationMarketCap}) must be strictly greater than initial market cap (${requirements.initialMarketCap}).`,
      actualValue: {
        initialMarketCap: requirements.initialMarketCap,
        migrationMarketCap: requirements.migrationMarketCap,
      },
      remedyAction: 'Increase migration market cap to establish an upward price discovery range.',
    });
  }

  // 3. Migration supply is a direct input only for modes 0, 2, and 4.
  rulesCheckedCount++;
  const { percentageSupplyOnMigration } = requirements;
  const hasDirectMigrationSupply = [0, 2, 4].includes(requirements.buildCurveMode);
  if (hasDirectMigrationSupply && (!Number.isFinite(percentageSupplyOnMigration) || percentageSupplyOnMigration <= 0 || percentageSupplyOnMigration >= 100)) {
    errors.push({
      field: 'percentageSupplyOnMigration',
      code: 'ERR_MIGRATION_SUPPLY_OUT_OF_BOUNDS',
      message: `Migration supply percentage of ${percentageSupplyOnMigration}% must be greater than 0% and less than 100%.`,
      actualValue: percentageSupplyOnMigration,
      allowedRange: '(0%, 100%)',
      remedyAction: 'Choose a value greater than 0% and less than 100%; any preferred range is an engineering choice, not a DBC protocol minimum.',
    });
  } else if (hasDirectMigrationSupply && percentageSupplyOnMigration < 15) {
    warnings.push({
      field: 'percentageSupplyOnMigration',
      message: `Low post-graduation liquidity (${percentageSupplyOnMigration}%). The DAMM v2 pool may suffer from excessive slippage after migration.`,
      tradeOffImplication: 'Leaves more tokens for curve trading, but makes post-graduation trading brittle.',
    });
  }

  // 4. Total Supply and Decimals
  rulesCheckedCount++;
  if (requirements.totalSupply <= 0) {
    errors.push({
      field: 'totalSupply',
      code: 'ERR_INVALID_TOTAL_SUPPLY',
      message: 'Total supply must be a positive integer.',
      actualValue: requirements.totalSupply,
      remedyAction: 'Provide a supply such as 1,000,000,000 tokens.',
    });
  }

  rulesCheckedCount++;
  if (![6, 7, 8, 9].includes(requirements.tokenDecimals)) {
    errors.push({
      field: 'tokenDecimals',
      code: 'ERR_INVALID_DECIMALS',
      message: `Token decimals ${requirements.tokenDecimals} is unsupported by DBC standard curves. Supported: 6, 7, 8, 9.`,
      actualValue: requirements.tokenDecimals,
      allowedRange: '6, 7, 8, or 9',
      remedyAction: 'Change token decimals to 6 (standard SPL) or 9 (Solana native precision).',
    });
  }

  // 5. Quote mint and migration inputs
  rulesCheckedCount++;
  // Automated migrator eligibility is external operational policy and may change;
  // no quote-token minimum is asserted here without a current protocol source.

  // Quote choice is a planning assumption. No asset-category keeper rule is asserted.

  // 7. Curve Mode Specific Constraints
  rulesCheckedCount++;
  if (requirements.buildCurveMode === 3) {
    // 16 liquidity weights check
    if (!requirements.liquidityWeights || requirements.liquidityWeights.length !== 16 || requirements.liquidityWeights.some((w) => !Number.isFinite(w) || w <= 0)) {
      errors.push({
        field: 'liquidityWeights',
        code: 'ERR_INVALID_LIQUIDITY_WEIGHTS_COUNT',
        message: `Mode 3 requires exactly 16 finite positive liquidity weights. Received ${requirements.liquidityWeights?.length || 0} values.`,
        actualValue: requirements.liquidityWeights,
        allowedRange: '16 numeric weights',
        remedyAction: 'Provide an array of 16 positive liquidity weights corresponding to the 16 curve segments.',
      });
    }
  } else if (requirements.buildCurveMode === 4) {
    // mid price check
    const p0 = requirements.initialMarketCap / requirements.totalSupply;
    const p1 = requirements.migrationMarketCap / requirements.totalSupply;
    if (!requirements.midPriceQuote || requirements.midPriceQuote <= p0 || requirements.midPriceQuote >= p1) {
      errors.push({
        field: 'midPriceQuote',
        code: 'ERR_INVALID_MID_PRICE',
        message: `Mid-price must be strictly between initial price (${p0.toExponential(4)}) and migration price (${p1.toExponential(4)}).`,
        actualValue: requirements.midPriceQuote,
        remedyAction: `Select a mid-price between ${p0.toExponential(4)} and ${p1.toExponential(4)}.`,
      });
    }
  } else if (requirements.buildCurveMode === 5) {
    const prices = requirements.curvePrices;
    if (!prices || prices.length < 2 || prices.some((price, i) => !Number.isFinite(price) || price <= 0 || (i > 0 && price <= prices[i - 1]))) errors.push({
      field: 'buildCurveMode',
      code: 'ERR_MODE_5_PRICES',
      message: 'Mode 5 requires at least two finite, positive, strictly ascending decimal prices.',
      actualValue: prices,
      remedyAction: 'Enter two or more ascending decimal prices.',
    });
    if (requirements.liquidityWeights && (requirements.liquidityWeights.length !== (prices?.length ?? 0) - 1 || requirements.liquidityWeights.some((w) => !Number.isFinite(w) || w <= 0))) errors.push({
      field: 'liquidityWeights', code: 'ERR_MODE_5_WEIGHTS', message: 'When supplied, mode 5 liquidity weights must be finite, positive, and one fewer than the price count.', actualValue: requirements.liquidityWeights, remedyAction: 'Provide prices.length - 1 positive weights or leave the optional weights blank.',
    });
  }

  if (![0, 1, 2, 3, 4, 5].includes(requirements.buildCurveMode)) {
    errors.push({ field: 'buildCurveMode', code: 'ERR_UNSUPPORTED_CURVE_MODE', message: 'Curve mode is not one of the official Invent modes 0–5.', actualValue: requirements.buildCurveMode, remedyAction: 'Select a supported mode.' });
  }

  if (requirements.buildCurveMode === 0 && (!Number.isFinite(requirements.targetQuoteRaise) || requirements.targetQuoteRaise <= 0)) errors.push({
    field: 'targetQuoteRaise', code: 'ERR_MODE_0_THRESHOLD', message: 'Mode 0 requires a positive migrationQuoteThreshold.', actualValue: requirements.targetQuoteRaise, remedyAction: 'Enter a positive quote threshold.',
  });

  // 8. Migration Fees
  rulesCheckedCount++;
  const { migrationFeePercent, creatorMigrationFeeSharePercent } = requirements.migrationPreferences;
  // Invent's current config contract documents 0–50%. The installed SDK's
  // generic constant is broader (99) and does not supersede this export contract.
  if (!Number.isFinite(migrationFeePercent) || migrationFeePercent < 0 || migrationFeePercent > PROTOCOL_LIMITS.MAX_INVENT_MIGRATION_FEE_PERCENTAGE) {
    errors.push({
      field: 'migrationPreferences.migrationFeePercent',
      code: 'ERR_MIGRATION_FEE_OUT_OF_BOUNDS',
      message: `Configured migration fee of ${migrationFeePercent}% must be between 0% and ${PROTOCOL_LIMITS.MAX_INVENT_MIGRATION_FEE_PERCENTAGE}% in the audited Invent config contract.`,
      actualValue: migrationFeePercent,
      allowedRange: `0% - ${PROTOCOL_LIMITS.MAX_INVENT_MIGRATION_FEE_PERCENTAGE}%`,
      remedyAction: `Set migration fee percentage between 0% and ${PROTOCOL_LIMITS.MAX_INVENT_MIGRATION_FEE_PERCENTAGE}% for the audited Invent config format.`,
    });
  }
  if (!Number.isFinite(creatorMigrationFeeSharePercent) || creatorMigrationFeeSharePercent < 0 || creatorMigrationFeeSharePercent > 100) errors.push({
    field: 'migrationPreferences.creatorMigrationFeeSharePercent', code: 'ERR_CREATOR_MIGRATION_SHARE', message: 'Creator migration-fee share must be between 0% and 100%.', actualValue: creatorMigrationFeeSharePercent, allowedRange: '0% - 100%', remedyAction: 'Choose a creator share from 0 to 100 percent.',
  });

  if (requirements.migrationPreferences.migrationOption === MigrationOption.MET_DAMM) errors.push({
    field: 'migrationPreferences.migrationOption', code: 'ERR_DAMM_V1_DEPRECATED', message: 'The installed SDK marks DAMM v1 migration deprecated for new configs and pools.', actualValue: MigrationOption.MET_DAMM, remedyAction: 'Choose DAMM v2 for a new-pool configuration.'
  });

  const distribution = requirements.liquidityDistribution;
  if (distribution) {
    const allocationKeys = ['partnerLiquidityPercentage', 'creatorLiquidityPercentage', 'partnerPermanentLockedLiquidityPercentage', 'creatorPermanentLockedLiquidityPercentage'] as const;
    const missingAllocations = allocationKeys.filter((key) => !Number.isFinite(distribution[key]));
    if (missingAllocations.length) errors.push({
      field: 'liquidityDistribution', code: 'ERR_LP_ALLOCATION_INCOMPLETE', message: `Enter every LP allocation bucket. Missing: ${missingAllocations.join(', ')}.`, actualValue: distribution, remedyAction: 'Specify partner and creator claimable shares and permanent locks; these are separate from fee-sharing percentages.'
    });
    const vestingByRole = (role: 'partner' | 'creator') => {
      const draft = distribution[`${role}LiquidityVestingInfoParams`];
      if (!draft) return { state: 'none' as const };
      const names = ['vestingPercentage', 'bpsPerPeriod', 'numberOfPeriods', 'cliffDurationFromMigrationTime', 'totalDuration'] as const;
      const values = names.map((key) => draft[key]);
      if (values.every((value) => value === undefined)) return { state: 'none' as const };
      if (values.some((value) => !Number.isFinite(value))) return { state: 'incomplete' as const };
      try {
        return { state: 'configured' as const, value: getLiquidityVestingInfoParams(draft.vestingPercentage!, draft.bpsPerPeriod!, draft.numberOfPeriods!, draft.cliffDurationFromMigrationTime!, draft.totalDuration!) };
      } catch (error) {
        return { state: 'invalid' as const, message: error instanceof Error ? error.message : 'Invalid vesting parameters.' };
      }
    };
    const partnerVesting = vestingByRole('partner');
    const creatorVesting = vestingByRole('creator');
    if (partnerVesting.state === 'incomplete' || creatorVesting.state === 'incomplete') errors.push({
      field: 'liquidityDistribution.vesting', code: 'ERR_VESTING_INCOMPLETE', message: 'A vesting schedule has some fields entered but is incomplete.', actualValue: distribution, remedyAction: 'Enter vesting %, BPS per period, number of periods, cliff seconds, and total duration, or clear the schedule.'
    });
    for (const [role, schedule] of [['partner', partnerVesting], ['creator', creatorVesting]] as const) if (schedule.state === 'invalid') errors.push({
      field: `liquidityDistribution.${role}Vesting`, code: 'ERR_VESTING_INVALID', message: schedule.message, actualValue: distribution, remedyAction: 'Correct the schedule using the SDK constraint message.'
    });
    if (!missingAllocations.length && partnerVesting.state !== 'incomplete' && creatorVesting.state !== 'incomplete' && partnerVesting.state !== 'invalid' && creatorVesting.state !== 'invalid') {
      const sdkErrors = validateLiquidityDistributionWithSdk({
        migrationOption: requirements.migrationPreferences.migrationOption,
        partnerLiquidityPercentage: distribution.partnerLiquidityPercentage!,
        creatorLiquidityPercentage: distribution.creatorLiquidityPercentage!,
        partnerPermanentLockedLiquidityPercentage: distribution.partnerPermanentLockedLiquidityPercentage!,
        creatorPermanentLockedLiquidityPercentage: distribution.creatorPermanentLockedLiquidityPercentage!,
        partnerVesting: partnerVesting.state === 'configured' ? { vestingPercentage: partnerVesting.value.vestingPercentage, bpsPerPeriod: partnerVesting.value.bpsPerPeriod, numberOfPeriods: partnerVesting.value.numberOfPeriods, cliffDurationFromMigrationTime: partnerVesting.value.cliffDurationFromMigrationTime, totalDuration: distribution.partnerLiquidityVestingInfoParams!.totalDuration! } : undefined,
        creatorVesting: creatorVesting.state === 'configured' ? { vestingPercentage: creatorVesting.value.vestingPercentage, bpsPerPeriod: creatorVesting.value.bpsPerPeriod, numberOfPeriods: creatorVesting.value.numberOfPeriods, cliffDurationFromMigrationTime: creatorVesting.value.cliffDurationFromMigrationTime, totalDuration: distribution.creatorLiquidityVestingInfoParams!.totalDuration! } : undefined,
      });
      for (const message of sdkErrors) errors.push({ field: 'liquidityDistribution', code: 'ERR_LP_DISTRIBUTION_SDK', message, actualValue: distribution, remedyAction: 'Adjust LP allocation and vesting values to satisfy the installed DBC SDK validator. This still does not establish Invent CLI acceptance.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    protocolVersion: 'CurveScope local checks; fee limits cross-checked with DBC SDK 1.5.13',
    rulesCheckedCount,
  };
}

