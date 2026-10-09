import { PROTOCOL_LIMITS } from '../domain/constants';

/**
 * Fee calculations for Meteora Dynamic Bonding Curves.
 * Complies with official formulas from docs.meteora.ag/core-products/dbc/formulas.
 */

export function bpsToFeeNumerator(bps: number): number {
  return Math.round((bps / 10000) * PROTOCOL_LIMITS.FEE_DENOMINATOR);
}

export function feeNumeratorToBps(numerator: number): number {
  return Math.round((numerator / PROTOCOL_LIMITS.FEE_DENOMINATOR) * 10000);
}

export interface FeeSplitResult {
  totalFeeAmount: number;
  protocolFeeAmount: number;
  nonProtocolFeeAmount: number;
  creatorFeeAmount: number;
  partnerFeeAmount: number;
}

export function calculateFeeSplit(
  tradeAmount: number,
  feeBps: number,
  creatorSharePercent: number
): FeeSplitResult {
  const totalFeeAmount = (tradeAmount * feeBps) / 10000;
  const protocolFeeAmount = totalFeeAmount * (PROTOCOL_LIMITS.PROTOCOL_FEE_PERCENT / 100); // 20%
  const nonProtocolFeeAmount = totalFeeAmount - protocolFeeAmount;
  // The config percentage applies to the non-protocol trading-fee share.
  const creatorFeeAmount = nonProtocolFeeAmount * (Math.min(100, Math.max(0, creatorSharePercent)) / 100);
  const partnerFeeAmount = nonProtocolFeeAmount - creatorFeeAmount;

  return {
    totalFeeAmount,
    protocolFeeAmount,
    nonProtocolFeeAmount,
    creatorFeeAmount,
    partnerFeeAmount,
  };
}

export function calculateScheduledFeeAtElapsed(
  startBps: number,
  endBps: number,
  mode: 'fixed' | 'linear_decay' | 'exponential_decay',
  elapsedSeconds: number,
  durationSeconds: number
): number {
  if (mode === 'fixed' || durationSeconds <= 0 || elapsedSeconds >= durationSeconds) {
    return mode === 'fixed' ? startBps : endBps;
  }

  const progress = Math.min(1, Math.max(0, elapsedSeconds / durationSeconds));

  if (mode === 'linear_decay') {
    return startBps - (startBps - endBps) * progress;
  } else {
    // exponential decay
    const decayFactor = Math.exp(-3 * progress);
    return endBps + (startBps - endBps) * decayFactor;
  }
}

export function calculateSurplusSplit(
  quoteReserve: number,
  migrationQuoteThreshold: number,
  creatorSharePercent: number
): {
  totalSurplus: number;
  protocolSurplus: number;
  partnerAndCreatorSurplus: number;
  creatorSurplus: number;
  partnerSurplus: number;
} {
  const totalSurplus = Math.max(0, quoteReserve - migrationQuoteThreshold);
  const partnerAndCreatorSurplus = Math.floor(totalSurplus * 0.8);
  const protocolSurplus = totalSurplus - partnerAndCreatorSurplus;

  const creatorSurplus = Math.floor(
    partnerAndCreatorSurplus * (Math.min(100, Math.max(0, creatorSharePercent)) / 100)
  );
  const partnerSurplus = partnerAndCreatorSurplus - creatorSurplus;

  return {
    totalSurplus,
    protocolSurplus,
    partnerAndCreatorSurplus,
    creatorSurplus,
    partnerSurplus,
  };
}
