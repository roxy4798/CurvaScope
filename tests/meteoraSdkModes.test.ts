import BN from 'bn.js';
import { describe, expect, it } from 'vitest';
import {
  buildCurve,
  buildCurveWithCustomSqrtPrices,
  buildCurveWithLiquidityWeights,
  buildCurveWithMarketCap,
  buildCurveWithMidPrice,
  buildCurveWithTwoSegments,
  getSqrtPriceFromPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

const common = {
  token: { totalTokenSupply: 1_000_000_000, tokenBaseDecimal: 6, tokenQuoteDecimal: 9, tokenType: 0, tokenAuthorityOption: 1, leftover: 0 },
  fee: { baseFeeParams: { baseFeeMode: 0 as const, feeSchedulerParam: { startingFeeBps: 100, endingFeeBps: 100, numberOfPeriod: 0, totalDuration: 0 } }, dynamicFeeEnabled: false, collectFeeMode: 0, creatorTradingFeePercentage: 50, poolCreationFee: 0, enableFirstSwapWithMinFee: false },
  migration: { migrationOption: 1, migrationFeeOption: 3, migrationFee: { feePercentage: 0, creatorFeePercentage: 0 } },
  liquidityDistribution: { partnerLiquidityPercentage: 50, creatorLiquidityPercentage: 40, partnerPermanentLockedLiquidityPercentage: 5, creatorPermanentLockedLiquidityPercentage: 5 },
  lockedVesting: { totalLockedVestingAmount: 0, numberOfVestingPeriod: 0, cliffUnlockAmount: 0, totalVestingDuration: 0, cliffDurationFromMigrationTime: 0 },
  activationType: 1,
};

describe('Meteora DBC SDK mode builders (installed SDK 1.5.13)', () => {
  it('accepts the official mode-specific inputs for all six builders', () => {
    const mode0 = buildCurve({ ...common, percentageSupplyOnMigration: 25, migrationQuoteThreshold: 100 });
    const mode1 = buildCurveWithMarketCap({ ...common, initialMarketCap: 30, migrationMarketCap: 600 });
    const mode2 = buildCurveWithTwoSegments({ ...common, token: { ...common.token, leftover: 100_000_000 }, initialMarketCap: 30, migrationMarketCap: 600, percentageSupplyOnMigration: 25 });
    const mode3 = buildCurveWithLiquidityWeights({ ...common, token: { ...common.token, leftover: 300_000_000 }, initialMarketCap: 30, migrationMarketCap: 600, liquidityWeights: Array(16).fill(1) });
    const mode4 = buildCurveWithMidPrice({ ...common, token: { ...common.token, leftover: 300_000_000 }, initialMarketCap: 30, migrationMarketCap: 600, midPrice: 0.0000002, percentageSupplyOnMigration: 25 });
    const mode5 = buildCurveWithCustomSqrtPrices({ ...common, token: { ...common.token, leftover: 300_000_000 }, sqrtPrices: [0.00000003, 0.0000001, 0.0000006].map((p) => getSqrtPriceFromPrice(String(p), 6, 9)), liquidityWeights: [1, 2] });

    for (const result of [mode0, mode1, mode2, mode3, mode4, mode5]) {
      expect(result.curve.length).toBeGreaterThan(0);
      expect(result.migrationQuoteThreshold.gt(new BN(0))).toBe(true);
    }
    expect(mode3.curve).toHaveLength(16);
    expect(mode5.curve).toHaveLength(2);
  });
});
