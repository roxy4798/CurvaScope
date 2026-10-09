import {
  MigrationOption,
  getLiquidityVestingInfoParams,
  validateLiquidityVestingInfo,
  validateLPPercentages,
  validateMinimumLockedLiquidity,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

export interface LiquidityVestingDraft {
  vestingPercentage: number;
  bpsPerPeriod: number;
  numberOfPeriods: number;
  cliffDurationFromMigrationTime: number;
  totalDuration: number;
}

export interface InventLiquidityDistributionCheck {
  migrationOption: MigrationOption;
  partnerLiquidityPercentage: number;
  creatorLiquidityPercentage: number;
  partnerPermanentLockedLiquidityPercentage: number;
  creatorPermanentLockedLiquidityPercentage: number;
  partnerVesting?: LiquidityVestingDraft;
  creatorVesting?: LiquidityVestingDraft;
}

/** Runs the installed DBC SDK's LP share and vesting checks; not Invent CLI validation. */
export function validateLiquidityDistributionWithSdk(input: InventLiquidityDistributionCheck): string[] {
  const errors: string[] = [];
  const percentages = [
    input.partnerLiquidityPercentage,
    input.creatorLiquidityPercentage,
    input.partnerPermanentLockedLiquidityPercentage,
    input.creatorPermanentLockedLiquidityPercentage,
    input.partnerVesting?.vestingPercentage ?? 0,
    input.creatorVesting?.vestingPercentage ?? 0,
  ];
  if (percentages.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
    return ['Each LP and vesting percentage must be finite and between 0 and 100.'];
  }

  const vesting = (draft?: LiquidityVestingDraft) => {
    if (!draft) return undefined;
    const parsed = getLiquidityVestingInfoParams(
      draft.vestingPercentage,
      draft.bpsPerPeriod,
      draft.numberOfPeriods,
      draft.cliffDurationFromMigrationTime,
      draft.totalDuration,
    );
    return parsed.vestingPercentage === 0 ? undefined : parsed;
  };
  let partnerVesting;
  let creatorVesting;
  try {
    partnerVesting = vesting(input.partnerVesting);
    creatorVesting = vesting(input.creatorVesting);
  } catch (error) {
    return [error instanceof Error ? error.message : 'Invalid vesting parameters.'];
  }

  if (input.migrationOption === MigrationOption.MET_DAMM && (partnerVesting || creatorVesting)) {
    errors.push('Vesting schedules are unsupported for DAMM v1 migration; the SDK marks new DAMM v1 configs and pools deprecated.');
    return errors;
  }
  if (!validateLPPercentages(
    input.partnerLiquidityPercentage,
    input.partnerPermanentLockedLiquidityPercentage,
    input.creatorLiquidityPercentage,
    input.creatorPermanentLockedLiquidityPercentage,
    partnerVesting?.vestingPercentage ?? 0,
    creatorVesting?.vestingPercentage ?? 0,
  )) errors.push('LP allocations and vesting percentages must sum to 100% under the installed SDK validator.');

  if (input.migrationOption === MigrationOption.MET_DAMM_V2) {
    if (partnerVesting && !validateLiquidityVestingInfo(partnerVesting)) errors.push('Partner vesting schedule is rejected by the installed SDK validator.');
    if (creatorVesting && !validateLiquidityVestingInfo(creatorVesting)) errors.push('Creator vesting schedule is rejected by the installed SDK validator.');
  }
  if (!validateMinimumLockedLiquidity(
    input.partnerPermanentLockedLiquidityPercentage,
    input.creatorPermanentLockedLiquidityPercentage,
    partnerVesting,
    creatorVesting,
  )) errors.push('The SDK minimum locked-liquidity check fails at the one-day point.');
  return errors;
}
