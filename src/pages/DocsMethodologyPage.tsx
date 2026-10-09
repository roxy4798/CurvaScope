import React from 'react';
import {
  BookOpen,
  Calculator,
  ShieldCheck,
  Cpu,
  DollarSign,
} from 'lucide-react';
import { QUOTE_MINT_PRESETS } from '../domain/constants';

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
          Comprehensive review of Meteora DBC virtual reserve math, fee mechanics, keeper conditions, and zero-cost local architecture.
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
          Meteora DBC uses concentrated liquidity math to construct customizable bonding curves across up to 16 contiguous price ranges. Unlike naive constant-product models (x · y = k) which assume liquidity from price zero to infinity, DBC segments define virtual liquidity L bounded between P_lower and P_upper.
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
              Determines exactly how much circulating token supply is purchased as the spot price progresses through that price segment.
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
              Determines how much quote currency (SOL, USDC) must be deposited by traders to push price from P_lower to P_upper.
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
            The sum of all quote capital absorbed across all curve segments represents the exact reserve threshold required for graduation into DAMM v2.
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
              <span className="text-[10px] text-slate-400">Protocol Fee Share</span>
              <p className="font-bold text-white mt-1">20%</p>
              <span className="text-[10px] text-slate-500">Fixed protocol split</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="text-white font-semibold font-sans">Fee Split Sequence:</div>
            <p>1. Protocol Fee = Total Trading Fee × 20%</p>
            <p>2. LP Fee = Total Trading Fee × 80%</p>
            <p>3. Creator Fee = LP Fee × Creator Trading Fee Percentage</p>
            <p>4. Partner Fee = LP Fee - Creator Fee</p>
          </div>
        </div>
      </section>

      {/* Section 3: Automated Migration Keepers */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              3. Automated Migration Keeper Conditions
            </h3>
            <p className="text-xs text-slate-400">
              Mainnet keeper addresses: `Asi5DT...` and `DeQ8dP...`
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Meteora maintains automated migration keeper bots that continuously inspect completed DBC pools and execute the migration into DAMM v2. To qualify for automatic keeper execution, pools must meet specific quote token thresholds:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Quote Token</th>
                <th className="py-2.5 px-3">Mint Address</th>
                <th className="py-2.5 px-3">Quote Decimals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {QUOTE_MINT_PRESETS.map((p) => (
                <tr key={p.symbol} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">{p.symbol}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{p.mintAddress.slice(0, 8)}...{p.mintAddress.slice(-4)}</td>
                  <td className="py-2.5 px-3 text-slate-400">{p.decimals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Zero-Cost Architecture */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>4. Zero-Cost Architectural Commitment</span>
        </div>

        <p>
          CurveScope was built from first principles under a strict zero-cost framework. It requires:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Zero Paid AI or Cloud APIs</span>
            All recipe synthesis, trade-off scoring, and validations are computed locally via deterministic TypeScript algorithms.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Zero Mandatory Database / Auth</span>
            Recipe persistence uses client-side localStorage and standard JSON import/export files.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Zero Private Key Custody</span>
            CurveScope never touches seed phrases, private keys, or wallet signatures. It does not emit executable Invent configs or submit transactions.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-semibold text-white block mb-1">Free Static Hosting Compatibility</span>
            Deploys to Cloudflare Pages, GitHub Pages, or Vercel Hobby tier with zero recurring hosting costs.
          </div>
        </div>
      </section>
    </div>
  );
};
