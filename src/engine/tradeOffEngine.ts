import type { LaunchRequirements, TradeOffSummary, TradeOffItem } from '../domain/types';

/**
 * Summarizes selected input bands and their modeled consequences.
 * The text is heuristic context, not a prediction or protocol risk assessment.
 */
export function analyzeTradeOffs(requirements: LaunchRequirements): TradeOffSummary {
  const items: TradeOffItem[] = [];

  // 1. Fee Architecture Trade-Off
  const feeBps = requirements.feePreferences.baseFeeBps;
  if (feeBps >= 200) {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Higher Base-Fee Input`,
      benefit: 'Uses a higher configured base-fee input; realized fees depend on the selected schedule and trading activity.',
      drawback: 'Raises modeled per-swap cost; demand, bot behavior, and routing effects are not predicted.',
      riskSeverity: 'medium',
    });
  } else if (feeBps <= 50) {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Lower Base-Fee Input`,
      benefit: 'Uses a lower configured base-fee input and lowers modeled per-swap cost; no volume or routing effect is predicted.',
      drawback: 'The modeled fee per swap is lower; market behavior and bot activity are not predicted.',
      riskSeverity: 'high',
    });
  } else {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Mid-Range Base-Fee Input`,
      benefit: 'Falls within the engine’s middle comparison band; this label is not a protocol rating.',
      drawback: 'Actual fees, trading volume, routing, and bot behavior depend on conditions this model does not simulate.',
      riskSeverity: 'low',
    });
  }

  // 2. Curve Construction Mode
  if (requirements.buildCurveMode === 0 || requirements.buildCurveMode === 1) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: `Builder Mode ${requirements.buildCurveMode} (single-segment input mode)`,
      benefit: 'Uses a single-segment builder input shape; CurveScope plots an analytical approximation.',
      drawback: 'Does not expose a custom 16-weight vector or custom price checkpoints in this mode.',
      riskSeverity: 'low',
    });
  } else if (requirements.buildCurveMode === 2 || requirements.buildCurveMode === 4) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: `Builder Mode ${requirements.buildCurveMode} (market-cap and migration/mid-price inputs)`,
      benefit: 'Uses the market-cap inputs and mode-specific migration percentage or midpoint.',
      drawback: 'The chart does not establish price progression, slippage, or graduation outcomes.',
      riskSeverity: 'medium',
    });
  } else if (requirements.buildCurveMode === 3) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: 'Builder Mode 3 (16 liquidity-weight inputs)',
      benefit: 'Lets the user configure the builder’s 16 liquidity weights.',
      drawback: 'The weights are not a guarantee of exact on-chain depth; CurveScope does not claim chart parity.',
      riskSeverity: 'high',
    });
  }

  // 3. Post-Graduation DAMM v2 Liquidity Split
  const migPct = requirements.percentageSupplyOnMigration;
  if (migPct >= 40) {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Supply-on-Migration Input`,
      benefit: 'Uses a higher supply-on-migration input within the local comparison bands.',
      drawback: 'CurveScope does not estimate resulting DAMM depth, slippage, or volatility.',
      riskSeverity: 'low',
    });
  } else if (migPct <= 15) {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Lower Supply-on-Migration Input`,
      benefit: 'Uses a lower supply-on-migration input within the local comparison bands.',
      drawback: 'CurveScope does not estimate resulting curve distribution, DAMM depth, or price impact.',
      riskSeverity: 'high',
    });
  } else {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Mid-Range Supply-on-Migration Input`,
      benefit: 'Falls between the engine’s input comparison bands; this is not a protocol rating.',
      drawback: 'CurveScope does not estimate resulting liquidity depth or price impact.',
      riskSeverity: 'low',
    });
  }

  // 4. Quote Token Volatility
  if (requirements.quoteSymbol === 'SOL') {
    items.push({
      dimension: 'Quote Currency Exposure',
      choice: 'SOL-Denominated Pool',
      benefit: 'Selects SOL as the quote-asset input.',
      drawback: 'CurveScope does not retrieve or model the quote asset’s external USD price.',
      riskSeverity: 'medium',
    });
  } else {
    items.push({
      dimension: 'Quote Currency Exposure',
      choice: `${requirements.quoteSymbol} Quote-Asset Input`,
      benefit: 'Selects the configured non-SOL quote-asset input.',
      drawback: 'The choice does not establish a price peg, valuation compliance, liquidity, or user demand.',
      riskSeverity: 'low',
    });
  }

  return { items };
}
