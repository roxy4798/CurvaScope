import type { LaunchRequirements, TradeOffSummary, TradeOffItem } from '../domain/types';

/**
 * Analyzes architectural trade-offs across launch parameters.
 * Helps builders understand WHY parameters behave as they do and what compromises are made.
 */
export function analyzeTradeOffs(requirements: LaunchRequirements): TradeOffSummary {
  const items: TradeOffItem[] = [];

  // 1. Fee Architecture Trade-Off
  const feeBps = requirements.feePreferences.baseFeeBps;
  if (feeBps >= 200) {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Base Fee`,
      benefit: 'Extracts aggressive yield from MEV arbitrage and frontrunners during launch volatility.',
      drawback: 'Disincentivizes small retail buyers and high-frequency swaps on Jupiter aggregator.',
      riskSeverity: 'medium',
    });
  } else if (feeBps <= 50) {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Ultra-Low Fee`,
      benefit: 'Maximizes swap volume and Jupiter routing priority across Solana DEX aggregators.',
      drawback: 'Vulnerable to sniper bots capturing initial price discovery with minimal cost friction.',
      riskSeverity: 'high',
    });
  } else {
    items.push({
      dimension: 'Trading Fee Level',
      choice: `${(feeBps / 100).toFixed(2)}% Balanced Fee`,
      benefit: 'Provides reasonable MEV drag while maintaining competitive Jupiter aggregator routing.',
      drawback: 'Moderate compromise between fee capture and trading volume.',
      riskSeverity: 'low',
    });
  }

  // 2. Curve Construction Mode
  if (requirements.buildCurveMode === 0 || requirements.buildCurveMode === 1) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: 'Single Segment Curve (buildCurve)',
      benefit: 'Simple, predictable constant-product price movement across the entire graduation journey.',
      drawback: 'Does not allow steepening price discovery near graduation or dampening initial volatility.',
      riskSeverity: 'low',
    });
  } else if (requirements.buildCurveMode === 2 || requirements.buildCurveMode === 4) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: 'Two-Segment Curve (Initial + Acceleration)',
      benefit: 'Provides gentle price discovery at start, followed by rapid price appreciation near graduation.',
      drawback: 'Requires calibrated mid-point price to avoid sudden slippage walls for late buyers.',
      riskSeverity: 'medium',
    });
  } else if (requirements.buildCurveMode === 3) {
    items.push({
      dimension: 'Curve Segmentation',
      choice: '16-Segment Custom Liquidity Weights',
      benefit: 'Maximal control over exact depth at all 16 price milestones, ideal for institutional or RWA launches.',
      drawback: 'Higher configuration complexity and sensitivity to weight miscalibrations.',
      riskSeverity: 'high',
    });
  }

  // 3. Post-Graduation DAMM v2 Liquidity Split
  const migPct = requirements.percentageSupplyOnMigration;
  if (migPct >= 40) {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Total Supply Migrated to DAMM v2`,
      benefit: 'Deep post-graduation liquidity pool. Minimizes post-launch dump slippage and volatility.',
      drawback: 'Fewer tokens available for price discovery on the DBC bonding curve, requiring higher per-token quote price.',
      riskSeverity: 'low',
    });
  } else if (migPct <= 15) {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Minimal Migration Liquidity`,
      benefit: 'More tokens tradeable during curve phase, enabling broader initial distribution.',
      drawback: 'Thin post-graduation DAMM v2 pool. Large holders can crash price with modest sell volume.',
      riskSeverity: 'high',
    });
  } else {
    items.push({
      dimension: 'Post-Graduation Liquidity',
      choice: `${migPct}% Standard Migration Liquidity`,
      benefit: 'Healthy balance between bonding curve circulating supply and post-migration depth.',
      drawback: 'Standard trade-off.',
      riskSeverity: 'low',
    });
  }

  // 4. Quote Token Volatility
  if (requirements.quoteSymbol === 'SOL') {
    items.push({
      dimension: 'Quote Currency Exposure',
      choice: 'SOL-Denominated Pool',
      benefit: 'Highest liquidity and immediate access to native Solana ecosystem capital.',
      drawback: 'Market cap and graduation targets fluctuate with SOL/USD market volatility.',
      riskSeverity: 'medium',
    });
  } else {
    items.push({
      dimension: 'Quote Currency Exposure',
      choice: `${requirements.quoteSymbol} (USD Stable/Asset Pair)`,
      benefit: 'Stable valuation baseline; complies with tokenized equity / RWA valuation requirements.',
      drawback: 'Requires traders to hold or wrap quote tokens, potentially reducing impulse retail volume.',
      riskSeverity: 'low',
    });
  }

  return { items };
}
