import React from 'react';
import {
  BookOpen,
  Calculator,
  DollarSign,
} from 'lucide-react';

export const DocsMethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Documentation & Mathematical Foundation</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          CurveScope Protocol Methodology
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Explanatory curve math, fee distinctions, migration boundaries, and CurveScope's local-planning limits.
        </p>
      </div>

      {/* Section 1: Concentrated Liquidity Virtual Math */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              1. Concentrated-Liquidity Virtual Curve Formulas
            </h3>
            <p className="text-xs text-slate-400">
              Source: `docs.meteora.ag/core-products/dbc/formulas`
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Meteora DBC offers mode-specific curve builders based on concentrated-liquidity math. Some builder inputs use up to 16 liquidity weights; other modes use different inputs such as market caps, a midpoint, or custom price checkpoints. CurveScope's charts are analytical models and do not reproduce every builder's segment construction or on-chain rounding. Unlike a constant-product model (x · y = k) with liquidity extending from zero to infinity, a concentrated-liquidity interval bounds virtual liquidity L between P_lower and P_upper.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-orange-400 font-semibold font-sans">
              Base Tokens Sold Across Segment
            </div>
            <div className="p-3 bg-slate-950 rounded-lg text-slate-200 text-[11px]">
              Base Amount = L · (1 / √P_lower - 1 / √P_upper)
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-normal">
              Gives a continuous-math estimate of base tokens across the modeled price segment. SDK rounding and builder-specific behavior are not reproduced.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-sky-400 font-semibold font-sans">
              Quote Inflow Needed Across Segment
            </div>
            <div className="p-3 bg-slate-950 rounded-lg text-slate-200 text-[11px]">
              Quote Amount = L · (√P_upper - √P_lower)
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-normal">
              Estimates quote currency across the modeled interval; the displayed calculation does not account for every builder-specific or on-chain effect.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="text-emerald-400 font-semibold font-sans">
            Total Migration Quote Threshold
          </div>
          <div className="p-3 bg-slate-950 rounded-lg text-slate-200 text-[11px]">
            Migration Quote Threshold = ∑ [ L_i · (√P_i - √P_prev) ]
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-normal">
            The sum estimates quote capital across the modeled segments. It is not an exact on-chain graduation threshold; actual behavior depends on the selected builder inputs and protocol implementation.
          </p>
        </div>
      </section>

      {/* Section 2: Fee Architecture */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              2. Trading Fee Architecture & Split Formulas
            </h3>
            <p className="text-xs text-slate-400">
              Protocol constraints, scheduler decays, and revenue distribution
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Meteora DBC expresses fee rates using a denominator of <code>1,000,000,000</code>. A rate of 25 basis points (0.25%) is represented on-chain as numerator <code>2,500,000</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Min Base Fee</span>
              <p className="font-bold text-white mt-1">25 bps (0.25%)</p>
              <span className="text-[10px] text-slate-500">2,500,000 num</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Max Base Fee</span>
              <p className="font-bold text-white mt-1">9900 bps (99.00%)</p>
              <span className="text-[10px] text-slate-500">990,000,000 num</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Protocol Portion of Trading Fee</span>
              <p className="font-bold text-white mt-1">20%</p>
              <span className="text-[10px] text-slate-500">Fixed protocol split</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="text-white font-semibold font-sans">Fee Split Sequence:</div>
            <p>1. Protocol Fee = Total Trading Fee × 20%</p>
            <p>2. Non-protocol portion = Total Trading Fee × 80%</p>
            <p>3. Creator share is calculated from the configured creator/partner split of the non-protocol portion.</p>
            <p>4. Partner share is the corresponding remainder under that configuration.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Graduation and migration limits */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              3. Graduation and Migration Boundaries
            </h3>
            <p className="text-xs text-slate-400">
              Builder-specific settings; no keeper threshold claim
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          CurveScope does not model or verify keeper services, quote-mint eligibility thresholds, or automatic migration timing. Graduation behavior and related quote or supply settings depend on the selected DBC builder and configured pool parameters. Any displayed curve quantities are estimates, not proof that a pool will graduate or migrate. Complete and validate the configuration with current Meteora tooling.
        </p>
      </section>

      {/* Section 4: Local and read-only boundaries */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>4. Local Planning and Read-Only Boundaries</span>
        </div>

        <p>
          The core planning workflow runs locally without a mandatory paid API or database. Optional RPC inspection depends on an endpoint and can be unavailable or rate-limited. No hosting provider or deployment has been verified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Local planning</span>
            Recipe synthesis, estimates, comparisons, and local input checks run in the browser; they are not official protocol validation.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Local persistence</span>
            Saved recipes use browser localStorage. Invent configuration export remains disabled.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">No wallet or transactions</span>
            This MVP does not request wallet signatures, handle private keys, or submit transactions.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Deployment not verified</span>
            Static hosting options have not been selected, tested, or deployed; their terms may change.
          </div>
        </div>
      </section>
    </div>
  );
};
