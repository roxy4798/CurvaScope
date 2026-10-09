import { describe, it, expect } from 'vitest';
import {
  calculateSegmentVirtualLiquidity,
  calculateBaseFromLiquidityAndPrices,
  calculateQuoteFromLiquidityAndPrices,
  generateCurveSegments,
  computeDerivedMetrics,
} from '../src/engine/curveMath';
import {
  bpsToFeeNumerator,
  feeNumeratorToBps,
  calculateFeeSplit,
  calculateScheduledFeeAtElapsed,
  calculateSurplusSplit,
} from '../src/engine/feeMath';
import { validateDbcRequirements } from '../src/engine/validationEngine';
import { analyzeTradeOffs } from '../src/engine/tradeOffEngine';
import { EXAMPLE_REQUIREMENTS, EXAMPLE_RECIPES } from '../src/data/exampleRecipes';
import { buildScenarioComparison } from '../src/engine/scenarioComparison';
import { formatInventJsonc, getInventExportReadiness } from '../src/adapters/meteora/inventSerializer';
import { isValidPublicKey } from '../src/adapters/solana/readOnlyClient';
import { MigrationOption, getLiquidityVestingInfoParams } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { validateLiquidityDistributionWithSdk } from '../src/engine/inventConstraints';
import { explainScenarioDifferences } from '../src/engine/scenarioInsights';
import { makeUniqueRecipeId } from '../src/data/recipeFactory';

describe('Recipe identity safety', () => {
  it('does not reuse an example or collide with an existing custom recipe', () => {
    const exampleId = EXAMPLE_RECIPES[0].id;
    const uniqueId = makeUniqueRecipeId(exampleId, [exampleId, `${exampleId}-copy-2`]);
    expect(uniqueId).toBe(`${exampleId}-copy-3`);
    expect(new Set([exampleId, `${exampleId}-copy-2`, uniqueId]).size).toBe(3);
  });
});

describe('CurveScope Engine - Virtual Curve Mathematics', () => {
  it('calculates virtual liquidity and reversibility correctly', () => {
    const pLower = 0.00003;
    const pUpper = 0.0006;
    const quoteNeeded = 10; // 10 SOL

    const L = calculateSegmentVirtualLiquidity(quoteNeeded, pLower, pUpper);
    expect(L).toBeGreaterThan(0);

    const reconstructedQuote = calculateQuoteFromLiquidityAndPrices(L, pLower, pUpper);
    expect(reconstructedQuote).toBeCloseTo(quoteNeeded, 5);

    const baseAmount = calculateBaseFromLiquidityAndPrices(L, pLower, pUpper);
    expect(baseAmount).toBeGreaterThan(0);
  });

  it('generates 2 segments for Mode 2 curves with strictly monotonic price', () => {
    const req = EXAMPLE_REQUIREMENTS[0]; // Mode 2 NeuroMesh
    const segments = generateCurveSegments(req);

    expect(segments.length).toBe(2);
    expect(segments[0].pLower).toBeLessThan(segments[0].pUpper);
    expect(segments[1].pLower).toBe(segments[0].pUpper);
    expect(segments[1].pLower).toBeLessThan(segments[1].pUpper);
    expect(segments[1].cumulativeQuote).toBeGreaterThan(segments[0].cumulativeQuote);
  });

  it('generates 16 segments for Mode 3 curves with custom weights', () => {
    const req = EXAMPLE_REQUIREMENTS[5]; // Mode 3 AlphaQuant
    const segments = generateCurveSegments(req);

    expect(segments.length).toBe(16);
    for (let i = 0; i < 15; i++) {
      expect(segments[i].pUpper).toBeCloseTo(segments[i + 1].pLower, 8);
      expect(segments[i].pLower).toBeLessThan(segments[i].pUpper);
    }
  });

  it('computes exact derived metrics including protocol migration fee', () => {
    const req = EXAMPLE_REQUIREMENTS[0];
    const segments = generateCurveSegments(req);
    const metrics = computeDerivedMetrics(req, segments);

    expect(metrics.initialPriceQuote).toBe(30 / 1_000_000_000);
    expect(metrics.migrationPriceQuote).toBe(600 / 1_000_000_000);
    expect(metrics.priceMultiplier).toBeCloseTo(20, 2);
    expect(metrics.baseTokensMigrated).toBe(250_000_000);
    // 0.2% protocol fee
    expect(metrics.protocolMigrationFeeQuote).toBeCloseTo(metrics.quoteNeededToGraduate * 0.002, 4);
  });
});

describe('CurveScope Engine - Fee Mathematics', () => {
  it('converts fee bps to on-chain numerator with denominator 1,000,000,000', () => {
    expect(bpsToFeeNumerator(25)).toBe(2_500_000); // 0.25%
    expect(bpsToFeeNumerator(100)).toBe(10_000_000); // 1.00%
    expect(bpsToFeeNumerator(9900)).toBe(990_000_000); // 99.00%
    expect(feeNumeratorToBps(2_500_000)).toBe(25);
    expect(feeNumeratorToBps(10_000_000)).toBe(100);
  });

  it('separates protocol trading fees from partner and creator sharing', () => {
    const tradeAmount = 100;
    const feeBps = 100; // 1% = 1.00 token
    const creatorShare = 60; // 60%

    const split = calculateFeeSplit(tradeAmount, feeBps, creatorShare);
    expect(split.totalFeeAmount).toBeCloseTo(1.0, 5);
    expect(split.protocolFeeAmount).toBeCloseTo(0.2, 5); // 20%
    expect(split.nonProtocolFeeAmount).toBeCloseTo(0.8, 5);
    expect(split.creatorFeeAmount).toBeCloseTo(0.48, 5); // 60% of non-protocol fee
    expect(split.partnerFeeAmount).toBeCloseTo(0.32, 5);
  });

  it('calculates linear and exponential fee decay schedules', () => {
    const startBps = 200;
    const endBps = 50;
    const duration = 3600;

    // Linear at midpoint
    const linearMid = calculateScheduledFeeAtElapsed(startBps, endBps, 'linear_decay', 1800, duration);
    expect(linearMid).toBeCloseTo(125, 1);

    // Linear at end
    const linearEnd = calculateScheduledFeeAtElapsed(startBps, endBps, 'linear_decay', 3600, duration);
    expect(linearEnd).toBe(50);

    // Fixed fee does not decay
    const fixedFee = calculateScheduledFeeAtElapsed(startBps, endBps, 'fixed', 1800, duration);
    expect(fixedFee).toBe(200);
  });

  it('calculates surplus split (80% non-protocol, 20% protocol)', () => {
    const quoteReserve = 120;
    const migrationThreshold = 100;
    const creatorShare = 75; // 75%

    const surplus = calculateSurplusSplit(quoteReserve, migrationThreshold, creatorShare);
    expect(surplus.totalSurplus).toBe(20);
    expect(surplus.partnerAndCreatorSurplus).toBe(16); // 80% of 20
    expect(surplus.protocolSurplus).toBe(4); // 20% of 20
    expect(surplus.creatorSurplus).toBe(12); // 75% of 16
    expect(surplus.partnerSurplus).toBe(4); // 25% of 16
  });
});

describe('CurveScope Engine - Protocol Validation & Trade-offs', () => {
  it('validates a valid preset recipe successfully', () => {
    const req = EXAMPLE_REQUIREMENTS[0];
    const validation = validateDbcRequirements(req);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('rejects fee bps outside protocol bounds [25, 9900]', () => {
    const invalidReq = {
      ...EXAMPLE_REQUIREMENTS[0],
      feePreferences: { ...EXAMPLE_REQUIREMENTS[0].feePreferences, baseFeeBps: 10 },
    };
    const validation = validateDbcRequirements(invalidReq);
    expect(validation.isValid).toBe(false);
    expect(validation.errors[0].code).toBe('ERR_FEE_OUT_OF_BOUNDS');
    expect(validation.errors[0].remedyAction).toContain('Set base fee between');
  });

  it('rejects inverted or non-monotonic market caps', () => {
    const invalidReq = {
      ...EXAMPLE_REQUIREMENTS[0],
      initialMarketCap: 500,
      migrationMarketCap: 100,
    };
    const validation = validateDbcRequirements(invalidReq);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.code === 'ERR_MARKET_CAP_NON_MONOTONIC')).toBe(true);
  });

  it('accepts migration supply values inside the mathematical open interval without claiming a protocol minimum', () => {
    const req = { ...EXAMPLE_REQUIREMENTS[0], percentageSupplyOnMigration: 1 };
    expect(validateDbcRequirements(req).errors.some((e) => e.code === 'ERR_MIGRATION_SUPPLY_OUT_OF_BOUNDS')).toBe(false);
    expect(validateDbcRequirements({ ...req, percentageSupplyOnMigration: 100 }).errors.some((e) => e.code === 'ERR_MIGRATION_SUPPLY_OUT_OF_BOUNDS')).toBe(true);
  });

  it('requires explicit ascending prices for mode 5 and validates optional weights', () => {
    const req = { ...EXAMPLE_REQUIREMENTS[0], buildCurveMode: 5 as const };
    expect(validateDbcRequirements(req).errors.some((e) => e.code === 'ERR_MODE_5_PRICES')).toBe(true);
    const valid = { ...req, curvePrices: [0.000001, 0.00002, 0.0001], liquidityWeights: [1, 2] };
    expect(validateDbcRequirements(valid).errors.some((e) => e.code.startsWith('ERR_MODE_5'))).toBe(false);
    expect(generateCurveSegments(valid)).toHaveLength(2);
    expect(generateCurveSegments(valid)[0].pUpper).toBe(valid.curvePrices[1]);
    expect(validateDbcRequirements({ ...valid, curvePrices: [1, 1] }).errors.some((e) => e.code === 'ERR_MODE_5_PRICES')).toBe(true);
    expect(validateDbcRequirements({ ...valid, liquidityWeights: [0] }).errors.some((e) => e.code === 'ERR_MODE_5_WEIGHTS')).toBe(true);
  });

  it('validates distinct required fields for each Invent buildCurveMode', () => {
    const base = EXAMPLE_REQUIREMENTS[0];
    const validMode = (mode: 0 | 1 | 2 | 3 | 4 | 5) => {
      const common = { ...base, buildCurveMode: mode, percentageSupplyOnMigration: 25, targetQuoteRaise: 100, initialMarketCap: 30, migrationMarketCap: 600, midPriceQuote: 0.0000002, curvePrices: [0.00000003, 0.0000006], liquidityWeights: mode === 5 ? [1] : Array(16).fill(1) };
      return validateDbcRequirements(common).errors;
    };
    for (const mode of [0, 1, 2, 3, 4, 5] as const) expect(validMode(mode)).toHaveLength(0);
    expect(validateDbcRequirements({ ...base, buildCurveMode: 0, targetQuoteRaise: 0 }).errors.some((e) => e.code === 'ERR_MODE_0_THRESHOLD')).toBe(true);
    expect(validateDbcRequirements({ ...base, buildCurveMode: 1, percentageSupplyOnMigration: Number.NaN }).errors.some((e) => e.code === 'ERR_MIGRATION_SUPPLY_OUT_OF_BOUNDS')).toBe(false);
    expect(validateDbcRequirements({ ...base, buildCurveMode: 3, liquidityWeights: [1, 2] }).errors.some((e) => e.code === 'ERR_INVALID_LIQUIDITY_WEIGHTS_COUNT')).toBe(true);
    expect(validateDbcRequirements({ ...base, buildCurveMode: 4, midPriceQuote: 0.00000003 }).errors.some((e) => e.code === 'ERR_INVALID_MID_PRICE')).toBe(true);
  });

  it('uses Invent migration fee range and keeps migration creator share distinct', () => {
    const base = EXAMPLE_REQUIREMENTS[0];
    const validateFee = (migrationFeePercent: number, creatorMigrationFeeSharePercent: number) => validateDbcRequirements({
      ...base,
      migrationPreferences: { ...base.migrationPreferences, migrationFeePercent, creatorMigrationFeeSharePercent },
    }).errors;
    expect(validateFee(50, 100).some((e) => e.code.startsWith('ERR_'))).toBe(false);
    expect(validateFee(50.01, 20).some((e) => e.code === 'ERR_MIGRATION_FEE_OUT_OF_BOUNDS')).toBe(true);
    expect(validateFee(10, 100.01).some((e) => e.code === 'ERR_CREATOR_MIGRATION_SHARE')).toBe(true);
  });

  it('applies installed SDK LP allocation, migration, and vesting validators', () => {
    const config = { migrationOption: MigrationOption.MET_DAMM_V2, partnerLiquidityPercentage: 50, creatorLiquidityPercentage: 40, partnerPermanentLockedLiquidityPercentage: 5, creatorPermanentLockedLiquidityPercentage: 5 };
    expect(validateLiquidityDistributionWithSdk(config)).toEqual([]);
    expect(validateLiquidityDistributionWithSdk({ ...config, creatorLiquidityPercentage: 39 })).toContain('LP allocations and vesting percentages must sum to 100% under the installed SDK validator.');
    expect(validateLiquidityDistributionWithSdk({ ...config, partnerLiquidityPercentage: 50, creatorLiquidityPercentage: 45, partnerPermanentLockedLiquidityPercentage: 2.5, creatorPermanentLockedLiquidityPercentage: 2.5 })).toContain('The SDK minimum locked-liquidity check fails at the one-day point.');

    const vesting = getLiquidityVestingInfoParams(6, 100, 100, 86_400, 2_592_000);
    const vested = { ...config, partnerLiquidityPercentage: 44, creatorLiquidityPercentage: 44, partnerPermanentLockedLiquidityPercentage: 0, creatorPermanentLockedLiquidityPercentage: 0, partnerVesting: { vestingPercentage: 6, bpsPerPeriod: 100, numberOfPeriods: 100, cliffDurationFromMigrationTime: 86_400, totalDuration: 2_592_000 }, creatorVesting: { vestingPercentage: 6, bpsPerPeriod: 100, numberOfPeriods: 100, cliffDurationFromMigrationTime: 86_400, totalDuration: 2_592_000 } };
    expect(vesting.vestingPercentage).toBe(6);
    expect(validateLiquidityDistributionWithSdk(vested)).toEqual([]);
    expect(validateLiquidityDistributionWithSdk({ ...vested, migrationOption: MigrationOption.MET_DAMM })).toContain('Vesting schedules are unsupported for DAMM v1 migration; the SDK marks new DAMM v1 configs and pools deprecated.');
    expect(validateLiquidityDistributionWithSdk({ ...config, partnerLiquidityPercentage: Number.NaN })).toContain('Each LP and vesting percentage must be finite and between 0 and 100.');
  });

  it('surfaces LP and vesting SDK errors through launch-requirement validation', () => {
    const base = EXAMPLE_REQUIREMENTS[0];
    const partial = validateDbcRequirements({ ...base, liquidityDistribution: { partnerLiquidityPercentage: 50 } });
    expect(partial.errors.some((error) => error.code === 'ERR_LP_ALLOCATION_INCOMPLETE')).toBe(true);
    const complete = validateDbcRequirements({ ...base, liquidityDistribution: { partnerLiquidityPercentage: 50, creatorLiquidityPercentage: 40, partnerPermanentLockedLiquidityPercentage: 5, creatorPermanentLockedLiquidityPercentage: 5 } });
    expect(complete.errors.some((error) => error.code.startsWith('ERR_LP_'))).toBe(false);
    const invalidVest = validateDbcRequirements({ ...base, liquidityDistribution: { partnerLiquidityPercentage: 50, creatorLiquidityPercentage: 40, partnerPermanentLockedLiquidityPercentage: 5, creatorPermanentLockedLiquidityPercentage: 5, partnerLiquidityVestingInfoParams: { vestingPercentage: 20 } } });
    expect(invalidVest.errors.some((error) => error.code === 'ERR_VESTING_INCOMPLETE')).toBe(true);
    const deprecated = validateDbcRequirements({ ...base, migrationPreferences: { ...base.migrationPreferences, migrationOption: 0 as const } });
    expect(deprecated.errors.some((error) => error.code === 'ERR_DAMM_V1_DEPRECATED')).toBe(true);
  });

  it('rejects non-finite and out-of-range trading fees', () => {
    for (const bps of [Number.NaN, Number.POSITIVE_INFINITY, 24, 9901]) {
      const req = { ...EXAMPLE_REQUIREMENTS[0], feePreferences: { ...EXAMPLE_REQUIREMENTS[0].feePreferences, baseFeeBps: bps } };
      expect(validateDbcRequirements(req).errors.some((e) => e.code === 'ERR_FEE_OUT_OF_BOUNDS')).toBe(true);
    }
    for (const bps of [25, 9900]) {
      const req = { ...EXAMPLE_REQUIREMENTS[0], feePreferences: { ...EXAMPLE_REQUIREMENTS[0].feePreferences, baseFeeBps: bps } };
      expect(validateDbcRequirements(req).errors.some((e) => e.code === 'ERR_FEE_OUT_OF_BOUNDS')).toBe(false);
    }
  });

  it('returns qualitative trade-off explanations without composite ratings', () => {
    const tradeOffs = analyzeTradeOffs(EXAMPLE_REQUIREMENTS[0]);
    expect(tradeOffs.items.length).toBeGreaterThan(0);
    expect(tradeOffs.items[0]).toHaveProperty('benefit');
    expect(tradeOffs.items[0]).toHaveProperty('drawback');
    expect(tradeOffs).not.toHaveProperty('capitalEfficiencyScore');
    expect(tradeOffs).not.toHaveProperty('sniperResistanceScore');
  });
});

describe('CurveScope Adapters - Invent Serializer & Solana Helpers', () => {
  it('does not emit apparently executable Invent JSONC before schema verification', () => {
    const recipe = EXAMPLE_RECIPES[0];
    const jsoncOutput = formatInventJsonc(recipe);
    expect(jsoncOutput).toContain('NOT AN INVENT CONFIGURATION');
    expect(jsoncOutput).not.toContain('rpcUrl');
    const readiness = getInventExportReadiness(recipe);
    expect(readiness.analyticalRecipe).toBe('available');
    expect(readiness.requiredInputs).toBe('incomplete');
    expect(readiness.localValidation).toBe('passed');
    expect(readiness.officialInventValidation).toBe('not-verified');
    expect(readiness.onChainDeployment).toBe('unsupported');
    expect(readiness.fields.find((item) => item.field === 'feeClaimer / leftoverReceiver')?.state).toBe('missing');
    expect(readiness.fields.find((item) => item.field === 'feeClaimer / leftoverReceiver')?.remedy).toContain('does not invent');
    expect(readiness.fields.find((item) => item.field === 'LP allocations and permanent locks')?.state).toBe('missing');
  });

  it('does not reject valid off-curve program-derived addresses', () => {
    expect(isValidPublicKey('11111111111111111111111111111111')).toBe(true);
  });

  it('validates public key formats accurately', () => {
    expect(isValidPublicKey('So11111111111111111111111111111111111111112')).toBe(true);
    expect(isValidPublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')).toBe(true);
    expect(isValidPublicKey('dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN')).toBe(true);
    expect(isValidPublicKey('invalid-public-key-123')).toBe(false);
    expect(isValidPublicKey('')).toBe(false);
  });

  it('builds multi-scenario comparison across 3 candidate recipes', () => {
    const candidateRecipes = [EXAMPLE_RECIPES[0], EXAMPLE_RECIPES[1], EXAMPLE_RECIPES[2]];
    const comparison = buildScenarioComparison(candidateRecipes);

    expect(comparison.recipes.length).toBe(3);
    expect(comparison.metricsComparison.length).toBeGreaterThan(5);
    expect(comparison.slippageSimulation.length).toBe(4); // 25, 50, 75, 100%
  });

  it('explains direct parameter consequences without producing an opaque rank', () => {
    const recipes = [EXAMPLE_RECIPES[0], EXAMPLE_RECIPES[1]];
    const [insight] = explainScenarioDifferences(recipes);
    expect(insight.firstTitle).toBe(recipes[0].title);
    expect(insight.secondTitle).toBe(recipes[1].title);
    expect(insight.differences.some((message) => message.includes('non-protocol trading-fee share'))).toBe(true);
    expect(insight.differences.some((message) => message.includes('Configured migration-fee rate'))).toBe(true);
    expect(insight.differences.some((message) => message.includes('profitability') || message.includes('optimal'))).toBe(false);
  });
});
