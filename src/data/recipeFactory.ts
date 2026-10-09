import type { LaunchRequirements, DbcRecipe } from '../domain/types';
import { generateCurveSegments, computeDerivedMetrics } from '../engine/curveMath';
import { analyzeTradeOffs } from '../engine/tradeOffEngine';
import { validateDbcRequirements } from '../engine/validationEngine';

/**
 * Deterministically constructs a full, validated DBC Recipe from launch requirements.
 */
export function buildFullRecipe(
  requirements: LaunchRequirements,
  isExample: boolean = false,
  description?: string,
  notes: string[] = []
): DbcRecipe {
  const segments = generateCurveSegments(requirements);
  const derivedMetrics = computeDerivedMetrics(requirements, segments);
  const tradeOffs = analyzeTradeOffs(requirements);
  const validation = validateDbcRequirements(requirements);

  return {
    id: requirements.id,
    title: requirements.name,
    version: '1.0.0',
    description:
      description ||
      `Custom Meteora DBC launch configuration tailored for ${requirements.tokenName} (${requirements.tokenSymbol}).`,
    category: requirements.category,
    isExample,
    createdAt: new Date().toISOString().split('T')[0],
    requirements,
    derivedMetrics,
    segments,
    tradeOffs,
    validation,
    notes,
  };
}
