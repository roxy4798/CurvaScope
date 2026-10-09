import type { LaunchRequirements, DbcRecipe } from '../domain/types';
import { buildFullRecipe } from './recipeFactory';

export const EXAMPLE_REQUIREMENTS: LaunchRequirements[] = [
  {
    id: 'recipe-ai-agent-mesh',
    name: 'AI Agent Compute Launch Recipe',
    category: 'ai_agent',
    tokenSymbol: 'MESH',
    tokenName: 'NeuroMesh Decentralized Compute',
    totalSupply: 1_000_000_000,
    tokenDecimals: 6,
    tokenType: 'SPLToken',
    quoteMintAddress: 'So11111111111111111111111111111111111111112',
    quoteSymbol: 'SOL',
    quoteDecimals: 9,
    targetQuoteRaise: 15,
    initialMarketCap: 30,
    migrationMarketCap: 600,
    percentageSupplyOnMigration: 25,
    buildCurveMode: 2, // Two segments
    feePreferences: {
      baseFeeBps: 150, // 1.5%
      feeMode: 'linear_decay',
      decayDurationSeconds: 7200, // 2 hours
      dynamicFeeEnabled: true,
      creatorFeeSharePercent: 60,
    },
    migrationPreferences: {
      migrationOption: 1, // DAMM v2
      dammPoolFeeBps: 100, // 1.00%
      migrationFeePercent: 20,
      creatorMigrationFeeSharePercent: 25,
      lockLiquidity: true,
      lockDurationDays: 180,
    },
    assumptions: [
      'Graduation target is an illustrative input; keeper operation is not guaranteed',
      'Two-segment curve is an illustrative shape; the model does not evaluate bot extraction',
      'Dynamic fee settings are illustrative; market and volatility outcomes are not predicted',
    ],
    constraints: [
      'Quote threshold is an illustrative planning input; no universal minimum or keeper eligibility is asserted',
      '25% supply locked into DAMM v2 for 180 days',
    ],
  },
  {
    id: 'recipe-rwa-treasury',
    name: 'Tokenized Treasury Bill (RWA) Recipe',
    category: 'rwa',
    tokenSymbol: 'sTBILL',
    tokenName: 'Solana US Treasury Bill Yield Bearer',
    totalSupply: 100_000_000,
    tokenDecimals: 6,
    tokenType: 'SPLToken',
    quoteMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    quoteSymbol: 'USDC',
    quoteDecimals: 6,
    targetQuoteRaise: 50_000,
    initialMarketCap: 100_000,
    migrationMarketCap: 120_000,
    percentageSupplyOnMigration: 50,
    buildCurveMode: 0, // Single segment (buildCurve)
    feePreferences: {
      baseFeeBps: 25, // 0.25% min fee
      feeMode: 'fixed',
      decayDurationSeconds: 0,
      dynamicFeeEnabled: false,
      creatorFeeSharePercent: 40,
    },
    migrationPreferences: {
      migrationOption: 1,
      dammPoolFeeBps: 25, // 0.25%
      migrationFeePercent: 0,
      creatorMigrationFeeSharePercent: 0,
      lockLiquidity: true,
      lockDurationDays: 365,
    },
    assumptions: [
      'USD quote denomination does not peg the token price or establish NAV',
      'Ultra-low 25 bps fee preserves yield value for institutional participants',
    ],
    constraints: [
      'Strict regulatory KYC/white-listing must occur at transfer level or off-chain',
      'Quote threshold shown is an illustrative planning input; keeper eligibility is not modeled',
    ],
  },
  {
    id: 'recipe-tokenized-stock-concept',
    name: 'Pre-IPO Synthetic Stock Concept Recipe',
    category: 'tokenized_stock',
    tokenSymbol: 'xSPACE',
    tokenName: 'SpaceX Synthetic Equity Concept',
    totalSupply: 50_000_000,
    tokenDecimals: 6,
    tokenType: 'Token2022',
    quoteMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    quoteSymbol: 'USDC',
    quoteDecimals: 6,
    targetQuoteRaise: 25_000,
    initialMarketCap: 50_000,
    migrationMarketCap: 250_000,
    percentageSupplyOnMigration: 35,
    buildCurveMode: 4, // Mode 4: buildCurveWithMidPrice
    midPriceQuote: 0.0025,
    feePreferences: {
      baseFeeBps: 100, // 1.00%
      feeMode: 'fixed',
      decayDurationSeconds: 0,
      dynamicFeeEnabled: true,
      creatorFeeSharePercent: 50,
    },
    migrationPreferences: {
      migrationOption: 1,
      dammPoolFeeBps: 100,
      migrationFeePercent: 10,
      creatorMigrationFeeSharePercent: 25,
      lockLiquidity: true,
      lockDurationDays: 365,
    },
    assumptions: [
      'Quote choice and threshold are illustrative assumptions, not keeper guarantees',
      'Mid-price checkpoint is a builder input; it does not prevent price spikes or establish valuation',
    ],
    constraints: [
      'Not a registered security prospectus; purely experimental quantitative model',
      'Requires Token-2022 compatibility on receiving wallets',
    ],
  },
  {
    id: 'recipe-meme-fair-launch',
    name: 'Viral Meme Fair Launch Recipe',
    category: 'meme_fair_launch',
    tokenSymbol: 'CORBIT',
    tokenName: 'Cat Orbit Fair Launch',
    totalSupply: 1_000_000_000,
    tokenDecimals: 6,
    tokenType: 'SPLToken',
    quoteMintAddress: 'So11111111111111111111111111111111111111112',
    quoteSymbol: 'SOL',
    quoteDecimals: 9,
    targetQuoteRaise: 85,
    initialMarketCap: 20,
    migrationMarketCap: 700,
    percentageSupplyOnMigration: 20,
    buildCurveMode: 1, // buildCurveWithMarketCap
    feePreferences: {
      baseFeeBps: 300, // 3.00% illustrative initial fee
      feeMode: 'linear_decay',
      decayDurationSeconds: 1800, // 30 minutes decay
      dynamicFeeEnabled: true,
      creatorFeeSharePercent: 75,
    },
    migrationPreferences: {
      migrationOption: 1,
      dammPoolFeeBps: 200, // 2.00%
      migrationFeePercent: 15,
      creatorMigrationFeeSharePercent: 25,
      lockLiquidity: true,
      lockDurationDays: 90,
    },
    assumptions: [
      'Illustrative fee-decay schedule; bot behavior and launch outcomes are not modeled',
      'High creator fee share provides ongoing developer budget',
    ],
    constraints: [
      'High initial fee may receive warnings on some DEX user interfaces',
    ],
  },
  {
    id: 'recipe-community-dao',
    name: 'Ecosystem DAO Governance Launch Recipe',
    category: 'community_dao',
    tokenSymbol: 'SOLAR',
    tokenName: 'Solaris DAO Ecosystem Token',
    totalSupply: 500_000_000,
    tokenDecimals: 6,
    tokenType: 'SPLToken',
    quoteMintAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    quoteSymbol: 'JUP',
    quoteDecimals: 6,
    targetQuoteRaise: 30_000,
    initialMarketCap: 15_000,
    migrationMarketCap: 150_000,
    percentageSupplyOnMigration: 30,
    buildCurveMode: 2, // Two segments
    feePreferences: {
      baseFeeBps: 80, // 0.8%
      feeMode: 'fixed',
      decayDurationSeconds: 0,
      dynamicFeeEnabled: false,
      creatorFeeSharePercent: 50,
    },
    migrationPreferences: {
      migrationOption: 1,
      dammPoolFeeBps: 30, // 0.30%
      migrationFeePercent: 5,
      creatorMigrationFeeSharePercent: 25,
      lockLiquidity: true,
      lockDurationDays: 180,
    },
    assumptions: [
      'Paired with ecosystem token JUP to align with Jupiter community liquidity',
      'Migration target is illustrative; automated keeper eligibility is not modeled',
    ],
    constraints: [
      'Requires community to hold JUP for participation',
    ],
  },
  {
    id: 'recipe-custom-quant-weights',
    name: '16-Segment Custom Weighted Curve Recipe',
    category: 'custom',
    tokenSymbol: 'AQUANT',
    tokenName: 'AlphaQuant Segmented Protocol',
    totalSupply: 1_000_000_000,
    tokenDecimals: 9,
    tokenType: 'SPLToken',
    quoteMintAddress: 'So11111111111111111111111111111111111111112',
    quoteSymbol: 'SOL',
    quoteDecimals: 9,
    targetQuoteRaise: 25,
    initialMarketCap: 25,
    migrationMarketCap: 750,
    percentageSupplyOnMigration: 25,
    buildCurveMode: 3, // 16 Segments with Liquidity Weights
    liquidityWeights: [1, 1.2, 1.5, 1.8, 2.2, 2.8, 3.5, 4.5, 5.8, 7.2, 9.0, 11.2, 14.0, 17.5, 22.0, 28.0],
    feePreferences: {
      baseFeeBps: 100,
      feeMode: 'exponential_decay',
      decayDurationSeconds: 3600,
      dynamicFeeEnabled: true,
      creatorFeeSharePercent: 50,
    },
    migrationPreferences: {
      migrationOption: 1,
      dammPoolFeeBps: 100,
      migrationFeePercent: 10,
      creatorMigrationFeeSharePercent: 25,
      lockLiquidity: true,
      lockDurationDays: 180,
    },
    assumptions: [
      'Deep initial liquidity transitions into accelerating curve near graduation',
      'Demonstrates advanced multi-segment capability of Meteora DBC SDK',
    ],
    constraints: [
      'Must maintain strictly monotonic price across all 16 ranges',
    ],
  },
];

export const EXAMPLE_RECIPES: DbcRecipe[] = EXAMPLE_REQUIREMENTS.map((req) =>
  buildFullRecipe(
    req,
    true,
    req.name,
    req.assumptions
  )
);


