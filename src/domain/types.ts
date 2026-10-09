/**
 * CurveScope Domain Types
 * Precise type definitions mirroring Meteora Dynamic Bonding Curve (DBC)
 * and DAMM v2 protocol specifications.
 */

export type AssetCategory =
  | 'ai_agent'
  | 'rwa'
  | 'tokenized_stock'
  | 'meme_fair_launch'
  | 'community_dao'
  | 'custom';

export type BuildCurveMode = 0 | 1 | 2 | 3 | 4 | 5;
export interface LiquidityVestingDraft {
  vestingPercentage: number;
  bpsPerPeriod: number;
  numberOfPeriods: number;
  cliffDurationFromMigrationTime: number;
  totalDuration: number;
}
export interface LiquidityDistributionDraft {
  partnerLiquidityPercentage?: number;
  creatorLiquidityPercentage?: number;
  partnerPermanentLockedLiquidityPercentage?: number;
  creatorPermanentLockedLiquidityPercentage?: number;
  partnerLiquidityVestingInfoParams?: Partial<LiquidityVestingDraft>;
  creatorLiquidityVestingInfoParams?: Partial<LiquidityVestingDraft>;
}
// 0: buildCurve (percentageSupplyOnMigration, migrationQuoteThreshold)
// 1: buildCurveWithMarketCap (initialMarketCap, migrationMarketCap)
// 2: buildCurveWithTwoSegments (initialMarketCap, migrationMarketCap, percentageSupplyOnMigration)
// 3: buildCurveWithLiquidityWeights (initialMarketCap, migrationMarketCap, liquidityWeights[16])
// 4: buildCurveWithMidPrice (initialMarketCap, migrationMarketCap, midPrice, percentageSupplyOnMigration)
// 5: buildCurveWithCustomSqrtPrices (decimal prices[], optional liquidityWeights[])

export type QuoteMintPreset = {
  symbol: string;
  name: string;
  mintAddress: string;
  decimals: number;
};

export interface LaunchRequirements {
  id: string;
  name: string;
  category: AssetCategory;
  tokenSymbol: string;
  tokenName: string;
  totalSupply: number; // e.g. 1_000_000_000
  tokenDecimals: 6 | 7 | 8 | 9;
  tokenType: 'SPLToken' | 'Token2022';
  quoteMintAddress: string;
  quoteSymbol: string;
  quoteDecimals: number;
  targetQuoteRaise: number; // mode 0 migrationQuoteThreshold; otherwise unused analytical field
  initialMarketCap: number; // in quote tokens
  migrationMarketCap: number; // in quote tokens
  percentageSupplyOnMigration: number; // directly used by modes 0, 2, and 4; derived by modes 1 and 3
  buildCurveMode: BuildCurveMode;
  midPriceQuote?: number; // for mode 4
  liquidityWeights?: number[]; // mode 3 (16) or mode 5 (prices.length - 1)
  curvePrices?: number[]; // mode 5 decimal quote/base prices, ascending
  feePreferences: {
    baseFeeBps: number; // 25 to 9900 bps (0.25% - 99%)
    feeMode: 'fixed' | 'linear_decay' | 'exponential_decay';
    decayDurationSeconds: number; // e.g. 3600 (1 hour)
    dynamicFeeEnabled: boolean;
    creatorFeeSharePercent: number; // 0 to 100% of non-protocol fee
  };
  migrationPreferences: {
    migrationOption: 0 | 1; // SDK enum: DAMM v1 (deprecated for new pools) or DAMM v2
    dammPoolFeeBps: 25 | 30 | 100 | 200 | 400 | 600 | 1000;
    migrationFeePercent: number; // configured fee taken from migration quote threshold (audited Invent config: 0–50%)
    creatorMigrationFeeSharePercent: number; // creator share of configured migration fee (0–100%)
    lockLiquidity: boolean;
    lockDurationDays: number; // e.g. 180 days
  };
  liquidityDistribution?: LiquidityDistributionDraft;
  assumptions: string[];
  constraints: string[];
}

export interface CurveSegment {
  segmentIndex: number;
  pLower: number; // UI price quote/base
  pUpper: number; // UI price quote/base
  sqrtPLower: string; // Q64 format or bigint string
  sqrtPUpper: string;
  virtualLiquidity: number;
  baseTokenAmount: number;
  quoteTokenAmount: number;
  cumulativeQuote: number;
  cumulativeBase: number;
}

export interface DerivedRecipeMetrics {
  initialPriceQuote: number;
  migrationPriceQuote: number;
  priceMultiplier: number;
  quoteNeededToGraduate: number;
  baseTokensMigrated: number;
  baseTokensSoldOnCurve: number;
  leftoverTokens: number;
  maxEffectiveFeePercent: number;
  minEffectiveFeePercent: number;
  postMigrationDammPriceQuote: number;
  protocolMigrationFeeQuote: number; // 0.2% protocol fee
  creatorMigrationFeeQuote: number;
  partnerMigrationFeeQuote: number;
  quoteReserveToDammV2: number;
  graduationFillProgressPercent: number;
}

export interface TradeOffItem {
  dimension: string;
  choice: string;
  benefit: string;
  drawback: string;
  riskSeverity: 'low' | 'medium' | 'high';
}

export interface TradeOffSummary {
  items: TradeOffItem[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  actualValue: any;
  allowedRange?: string;
  remedyAction: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  tradeOffImplication: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  protocolVersion: string;
  rulesCheckedCount: number;
}

export interface DbcRecipe {
  id: string;
  title: string;
  version: string;
  description: string;
  category: AssetCategory;
  isExample: boolean;
  createdAt: string;
  requirements: LaunchRequirements;
  derivedMetrics: DerivedRecipeMetrics;
  segments: CurveSegment[];
  tradeOffs: TradeOffSummary;
  validation: ValidationResult;
  notes: string[];
}

export interface ScenarioComparison {
  recipes: DbcRecipe[];
  metricsComparison: {
    label: string;
    category: 'Exact Protocol Calculation' | 'Derived Calculation' | 'Assumption-Dependent Simulation' | 'Post-Graduation DAMM v2';
    unit: string;
    values: Record<string, number | string>;
    formulaOrExplanation: string;
  }[];
  slippageSimulation: {
    fillPercentage: number; // 25, 50, 75, 100%
    priceQuote: Record<string, number>;
    cumulativeQuoteSpent: Record<string, number>;
    effectivePricePaid: Record<string, number>;
  }[];
}
