import type { LaunchRequirements, CurveSegment, DerivedRecipeMetrics } from '../domain/types';
import { PROTOCOL_LIMITS } from '../domain/constants';

/**
 * Floating-point analytical visualization based on the published DBC segment
 * equations. Mode geometry choices below are CurveScope assumptions; this is
 * not an SDK-equivalent curve constructor.
 */

export function calculateSegmentVirtualLiquidity(
  quoteAmount: number,
  pLower: number,
  pUpper: number
): number {
  const sqrtLower = Math.sqrt(pLower);
  const sqrtUpper = Math.sqrt(pUpper);
  if (sqrtUpper <= sqrtLower || quoteAmount <= 0) return 0;
  return quoteAmount / (sqrtUpper - sqrtLower);
}

export function calculateBaseFromLiquidityAndPrices(
  L: number,
  pLower: number,
  pUpper: number
): number {
  const sqrtLower = Math.sqrt(pLower);
  const sqrtUpper = Math.sqrt(pUpper);
  if (sqrtLower <= 0 || sqrtUpper <= sqrtLower) return 0;
  return L * (1 / sqrtLower - 1 / sqrtUpper);
}

export function calculateQuoteFromLiquidityAndPrices(
  L: number,
  pLower: number,
  pUpper: number
): number {
  const sqrtLower = Math.sqrt(pLower);
  const sqrtUpper = Math.sqrt(pUpper);
  if (sqrtUpper <= sqrtLower) return 0;
  return L * (sqrtUpper - sqrtLower);
}

export function generateCurveSegments(requirements: LaunchRequirements): CurveSegment[] {
  const {
    totalSupply,
    initialMarketCap,
    migrationMarketCap,
    percentageSupplyOnMigration,
    buildCurveMode,
    targetQuoteRaise,
    midPriceQuote,
    liquidityWeights,
  } = requirements;

  const initialPrice = initialMarketCap / totalSupply;
  const migrationPrice = migrationMarketCap / totalSupply;

  // Amount reserved for post-graduation DAMM v2 liquidity
  const baseForMigration = (totalSupply * percentageSupplyOnMigration) / 100;
  // Tokens available for trading during the DBC curve phase
  const baseForCurve = totalSupply - baseForMigration;

  const segments: CurveSegment[] = [];

  if (buildCurveMode === 5) {
    const prices = requirements.curvePrices;
    if (!prices || prices.length < 2 || prices.some((p, i) => !Number.isFinite(p) || p <= 0 || (i > 0 && p <= prices[i - 1]))) return [];
    const weights = requirements.liquidityWeights?.length === prices.length - 1
      ? requirements.liquidityWeights
      : Array(prices.length - 1).fill(1);
    return buildWeightedAnalyticalSegments(prices, weights, baseForCurve);
  }

  if (buildCurveMode === 0) {
    // Mode 0: Single Segment (Standard buildCurve)
    const pLower = initialPrice;
    const pUpper = migrationPrice;
    const quoteNeeded = targetQuoteRaise;
    const L = calculateSegmentVirtualLiquidity(quoteNeeded, pLower, pUpper);
    const baseSold = calculateBaseFromLiquidityAndPrices(L, pLower, pUpper);

    segments.push({
      segmentIndex: 0,
      pLower,
      pUpper,
      sqrtPLower: Math.sqrt(pLower).toExponential(8),
      sqrtPUpper: Math.sqrt(pUpper).toExponential(8),
      virtualLiquidity: L,
      baseTokenAmount: baseSold,
      quoteTokenAmount: quoteNeeded,
      cumulativeQuote: quoteNeeded,
      cumulativeBase: baseSold,
    });
  } else if (buildCurveMode === 2 || buildCurveMode === 4) {
    // Mode 2: Two Segments or Mode 4: Two Segments with specified Mid-Price
    const midPrice =
      buildCurveMode === 4 && midPriceQuote && midPriceQuote > initialPrice && midPriceQuote < migrationPrice
        ? midPriceQuote
        : initialPrice + (migrationPrice - initialPrice) * 0.35; // typical curve inflection

    // Segment 0: Initial Discovery Phase (60% of curve base supply)
    const baseSeg0 = baseForCurve * 0.6;
    const p0 = initialPrice;
    const p1 = midPrice;
    const L0 = baseSeg0 / (1 / Math.sqrt(p0) - 1 / Math.sqrt(p1));
    const quoteSeg0 = calculateQuoteFromLiquidityAndPrices(L0, p0, p1);

    // Segment 1: Acceleration & Graduation Phase (40% of curve base supply)
    const baseSeg1 = baseForCurve * 0.4;
    const p2 = migrationPrice;
    const L1 = baseSeg1 / (1 / Math.sqrt(p1) - 1 / Math.sqrt(p2));
    const quoteSeg1 = calculateQuoteFromLiquidityAndPrices(L1, p1, p2);

    segments.push({
      segmentIndex: 0,
      pLower: p0,
      pUpper: p1,
      sqrtPLower: Math.sqrt(p0).toExponential(8),
      sqrtPUpper: Math.sqrt(p1).toExponential(8),
      virtualLiquidity: L0,
      baseTokenAmount: baseSeg0,
      quoteTokenAmount: quoteSeg0,
      cumulativeQuote: quoteSeg0,
      cumulativeBase: baseSeg0,
    });

    segments.push({
      segmentIndex: 1,
      pLower: p1,
      pUpper: p2,
      sqrtPLower: Math.sqrt(p1).toExponential(8),
      sqrtPUpper: Math.sqrt(p2).toExponential(8),
      virtualLiquidity: L1,
      baseTokenAmount: baseSeg1,
      quoteTokenAmount: quoteSeg1,
      cumulativeQuote: quoteSeg0 + quoteSeg1,
      cumulativeBase: baseSeg0 + baseSeg1,
    });
  } else if (buildCurveMode === 3) {
    if (!liquidityWeights || liquidityWeights.length !== 16 || liquidityWeights.some((w) => !Number.isFinite(w) || w <= 0)) return [];
    const sqrtStart = Math.sqrt(initialPrice);
    const sqrtEnd = Math.sqrt(migrationPrice);
    const ratio = (sqrtEnd / sqrtStart) ** (1 / 16);
    const prices = Array.from({ length: 17 }, (_, i) => (sqrtStart * ratio ** i) ** 2);
    return buildWeightedAnalyticalSegments(prices, liquidityWeights, baseForCurve);
  } else {
    // Mode 1 (Market Cap single curve) or Mode 5
    const pLower = initialPrice;
    const pUpper = migrationPrice;
    const L = baseForCurve / (1 / Math.sqrt(pLower) - 1 / Math.sqrt(pUpper));
    const quoteNeeded = calculateQuoteFromLiquidityAndPrices(L, pLower, pUpper);

    segments.push({
      segmentIndex: 0,
      pLower,
      pUpper,
      sqrtPLower: Math.sqrt(pLower).toExponential(8),
      sqrtPUpper: Math.sqrt(pUpper).toExponential(8),
      virtualLiquidity: L,
      baseTokenAmount: baseForCurve,
      quoteTokenAmount: quoteNeeded,
      cumulativeQuote: quoteNeeded,
      cumulativeBase: baseForCurve,
    });
  }

  return segments;
}

/** Floating point visualization only: SDK weights are normalized to fit CurveScope's assumed curve base. */
function buildWeightedAnalyticalSegments(prices: number[], weights: number[], assumedBaseSupply: number): CurveSegment[] {
  if (weights.length !== prices.length - 1 || weights.some((w) => !Number.isFinite(w) || w <= 0)) return [];
  const unitBase = weights.reduce((sum, weight, i) =>
    sum + calculateBaseFromLiquidityAndPrices(weight, prices[i], prices[i + 1]), 0);
  if (!(unitBase > 0) || !(assumedBaseSupply > 0)) return [];
  const scale = assumedBaseSupply / unitBase;
  let cumulativeQuote = 0;
  let cumulativeBase = 0;
  return weights.map((weight, i) => {
    const pLower = prices[i];
    const pUpper = prices[i + 1];
    const L = weight * scale;
    const baseTokenAmount = calculateBaseFromLiquidityAndPrices(L, pLower, pUpper);
    const quoteTokenAmount = calculateQuoteFromLiquidityAndPrices(L, pLower, pUpper);
    cumulativeBase += baseTokenAmount;
    cumulativeQuote += quoteTokenAmount;
    return {
      segmentIndex: i,
      pLower,
      pUpper,
      sqrtPLower: Math.sqrt(pLower).toExponential(8),
      sqrtPUpper: Math.sqrt(pUpper).toExponential(8),
      virtualLiquidity: L,
      baseTokenAmount,
      quoteTokenAmount,
      cumulativeQuote,
      cumulativeBase,
    };
  });
}

export function computeDerivedMetrics(
  requirements: LaunchRequirements,
  segments: CurveSegment[]
): DerivedRecipeMetrics {
  const { totalSupply, initialMarketCap, migrationMarketCap, percentageSupplyOnMigration } = requirements;

  const initialPriceQuote = initialMarketCap / totalSupply;
  const migrationPriceQuote = migrationMarketCap / totalSupply;
  const priceMultiplier = migrationPriceQuote / (initialPriceQuote || 0.000000001);

  const totalQuoteInCurve = segments.length > 0 ? segments[segments.length - 1].cumulativeQuote : 0;
  const totalBaseSoldInCurve = segments.length > 0 ? segments[segments.length - 1].cumulativeBase : 0;

  const baseTokensMigrated = (totalSupply * percentageSupplyOnMigration) / 100;
  const leftoverTokens = Math.max(0, totalSupply - baseTokensMigrated - totalBaseSoldInCurve);

  // Migration fees
  // 0.2% fixed protocol LP migration fee
  const protocolMigrationFeeQuote = (totalQuoteInCurve * PROTOCOL_LIMITS.PROTOCOL_MIGRATION_FEE_PERCENT) / 100;
  const configuredMigrationFeeQuote = totalQuoteInCurve * (requirements.migrationPreferences.migrationFeePercent / 100);
  const creatorMigrationFeeQuote = configuredMigrationFeeQuote * (requirements.migrationPreferences.creatorMigrationFeeSharePercent / 100);
  const partnerMigrationFeeQuote = configuredMigrationFeeQuote - creatorMigrationFeeQuote;

  const quoteReserveToDammV2 = Math.max(
    0,
    totalQuoteInCurve - protocolMigrationFeeQuote - configuredMigrationFeeQuote
  );

  // Effective fee bounds
  const minEffectiveFeePercent = requirements.feePreferences.baseFeeBps / 100;
  const maxEffectiveFeePercent = requirements.feePreferences.dynamicFeeEnabled
    ? minEffectiveFeePercent * 3.5
    : minEffectiveFeePercent;

  return {
    initialPriceQuote,
    migrationPriceQuote,
    priceMultiplier,
    quoteNeededToGraduate: totalQuoteInCurve,
    baseTokensMigrated,
    baseTokensSoldOnCurve: totalBaseSoldInCurve,
    leftoverTokens,
    maxEffectiveFeePercent,
    minEffectiveFeePercent,
    postMigrationDammPriceQuote: migrationPriceQuote,
    protocolMigrationFeeQuote,
    creatorMigrationFeeQuote,
    partnerMigrationFeeQuote,
    quoteReserveToDammV2,
    graduationFillProgressPercent: 100,
  };
}

/**
 * Simulates curve price and cumulative quote spent at 25%, 50%, 75%, and 100% curve progression.
 */
export function simulateCurveSlippageProgression(
  segments: CurveSegment[],
  checkpoints: number[] = [0.25, 0.5, 0.75, 1.0]
): { progressPercent: number; currentPriceQuote: number; quoteSpent: number; effectiveAveragePrice: number }[] {
  if (segments.length === 0) return [];

  const totalQuote = segments[segments.length - 1].cumulativeQuote;

  return checkpoints.map((pct) => {
    const targetQuote = totalQuote * pct;
    // Find matching segment
    let currentPrice = segments[0].pLower;
    let accumulatedQuote = 0;
    let accumulatedBase = 0;

    for (const seg of segments) {
      if (accumulatedQuote + seg.quoteTokenAmount >= targetQuote || seg === segments[segments.length - 1]) {
        const segProgress = seg.quoteTokenAmount > 0 ? (targetQuote - accumulatedQuote) / seg.quoteTokenAmount : 1;
        const sqrtL = Math.sqrt(seg.pLower);
        const sqrtU = Math.sqrt(seg.pUpper);
        const currentSqrt = sqrtL + (sqrtU - sqrtL) * Math.min(1, Math.max(0, segProgress));
        currentPrice = currentSqrt * currentSqrt;
        accumulatedBase += seg.baseTokenAmount * Math.min(1, Math.max(0, segProgress));
        break;
      } else {
        accumulatedQuote += seg.quoteTokenAmount;
        accumulatedBase += seg.baseTokenAmount;
      }
    }

    const effectiveAveragePrice = accumulatedBase > 0 ? targetQuote / accumulatedBase : currentPrice;

    return {
      progressPercent: pct * 100,
      currentPriceQuote: currentPrice,
      quoteSpent: targetQuote,
      effectiveAveragePrice,
    };
  });
}
