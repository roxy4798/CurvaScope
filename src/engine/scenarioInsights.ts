import type { DbcRecipe } from '../domain/types';

export interface ScenarioDifferenceInsight {
  firstTitle: string;
  secondTitle: string;
  differences: string[];
}

/** Describes direct parameter effects without combining them into an opaque score. */
export function explainScenarioDifferences(recipes: DbcRecipe[]): ScenarioDifferenceInsight[] {
  const pairs: ScenarioDifferenceInsight[] = [];
  for (let i = 0; i < recipes.length; i += 1) for (let j = i + 1; j < recipes.length; j += 1) {
    const first = recipes[i];
    const second = recipes[j];
    const a = first.requirements;
    const b = second.requirements;
    const differences: string[] = [];
    if (a.buildCurveMode !== b.buildCurveMode) differences.push(`Builder mode differs (${a.buildCurveMode} vs ${b.buildCurveMode}); the inputs and curve construction method differ, and both plotted curves remain estimates.`);
    if (a.feePreferences.baseFeeBps !== b.feePreferences.baseFeeBps) differences.push(`Starting base fee differs (${a.feePreferences.baseFeeBps} vs ${b.feePreferences.baseFeeBps} bps); the higher setting raises the fee on early swaps before any configured schedule/dynamic component.`);
    if (a.feePreferences.creatorFeeSharePercent !== b.feePreferences.creatorFeeSharePercent) differences.push(`Creator trading-fee share differs (${a.feePreferences.creatorFeeSharePercent}% vs ${b.feePreferences.creatorFeeSharePercent}%); it apportions the non-protocol trading-fee share between creator and partner, not LP ownership.`);
    if (a.targetQuoteRaise !== b.targetQuoteRaise && (a.buildCurveMode === 0 || b.buildCurveMode === 0)) differences.push(`Mode 0 quote threshold differs (${a.targetQuoteRaise} vs ${b.targetQuoteRaise} ${a.quoteSymbol}/${b.quoteSymbol}); a different configured reserve threshold changes the quote needed for graduation.`);
    if (a.initialMarketCap !== b.initialMarketCap || a.migrationMarketCap !== b.migrationMarketCap) differences.push(`Market-cap anchors differ (${a.initialMarketCap}→${a.migrationMarketCap} vs ${b.initialMarketCap}→${b.migrationMarketCap}); this changes the modeled price range and estimated curve shape.`);
    if (a.percentageSupplyOnMigration !== b.percentageSupplyOnMigration && [0, 2, 4].some((mode) => a.buildCurveMode === mode || b.buildCurveMode === mode)) differences.push(`Direct migration-supply input differs (${a.percentageSupplyOnMigration}% vs ${b.percentageSupplyOnMigration}%); the configured migrated base-supply share changes, subject to each builder's semantics.`);
    if (a.migrationPreferences.migrationFeePercent !== b.migrationPreferences.migrationFeePercent) differences.push(`Configured migration-fee rate differs (${a.migrationPreferences.migrationFeePercent}% vs ${b.migrationPreferences.migrationFeePercent}%); it changes the quote amount deducted from the migration threshold.`);
    if (a.migrationPreferences.creatorMigrationFeeSharePercent !== b.migrationPreferences.creatorMigrationFeeSharePercent) differences.push(`Creator share of the configured migration fee differs (${a.migrationPreferences.creatorMigrationFeeSharePercent}% vs ${b.migrationPreferences.creatorMigrationFeeSharePercent}%); it redistributes that configured fee between creator and partner.`);
    if (a.migrationPreferences.dammPoolFeeBps !== b.migrationPreferences.dammPoolFeeBps) differences.push(`Selected migrated-pool fee tier differs (${a.migrationPreferences.dammPoolFeeBps} vs ${b.migrationPreferences.dammPoolFeeBps} bps); this is a post-migration fee setting, separate from DBC curve trading fees.`);
    if (!differences.length) differences.push('No compared parameter in this summary differs; review the mode inputs and recipe assumptions for other differences.');
    pairs.push({ firstTitle: first.title, secondTitle: second.title, differences });
  }
  return pairs;
}
