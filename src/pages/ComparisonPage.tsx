import React, { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import type { DbcRecipe } from '../domain/types';
import { buildScenarioComparison } from '../engine/scenarioComparison';
import { explainScenarioDifferences } from '../engine/scenarioInsights';

interface ComparisonPageProps {
  allRecipes: DbcRecipe[];
  onSelectRecipe: (recipeId: string) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  allRecipes,
  onSelectRecipe,
}) => {
  // Select 3 recipes to compare (default to first 3)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    allRecipes[0]?.id || '',
    allRecipes[1]?.id || '',
    allRecipes[2]?.id || '',
  ]);

  const candidateRecipes = allRecipes.filter((r) => selectedIds.includes(r.id)).slice(0, 3);
  const comparison = buildScenarioComparison(candidateRecipes);
  const practicalDifferences = explainScenarioDifferences(candidateRecipes);

  const colors = ['#f97316', '#38bdf8', '#a855f7'];

  // Multi-curve chart data interpolation
  const chartPoints: {
    progress: number;
    [key: string]: number;
  }[] = [];

  for (let p = 0; p <= 100; p += 5) {
    const point: any = { progress: p };
    candidateRecipes.forEach((recipe) => {
      const segs = recipe.segments;
      if (segs.length > 0) {
        const totalQ = segs[segs.length - 1].cumulativeQuote;
        const targetQ = (totalQ * p) / 100;

        let price = segs[0].pLower;
        for (const seg of segs) {
          if (targetQ <= seg.cumulativeQuote || seg === segs[segs.length - 1]) {
            const segStartQ = seg.cumulativeQuote - seg.quoteTokenAmount;
            const localQ = Math.max(0, targetQ - segStartQ);
            const ratio = seg.quoteTokenAmount > 0 ? localQ / seg.quoteTokenAmount : 0;
            const sqrtL = Math.sqrt(seg.pLower);
            const sqrtU = Math.sqrt(seg.pUpper);
            const curSqrt = sqrtL + (sqrtU - sqrtL) * Math.min(1, ratio);
            price = curSqrt * curSqrt;
            break;
          }
        }
        point[recipe.id] = parseFloat(price.toFixed(6));
      }
    });
    chartPoints.push(point);
  }

  const handleSelectSlot = (slotIndex: number, newId: string) => {
    const updated = [...selectedIds];
    updated[slotIndex] = newId;
    setSelectedIds(updated);
  };

  const categories = [
    'Exact Protocol Calculation',
    'Derived Calculation',
    'Post-Graduation DAMM v2',
    'Assumption-Dependent Simulation',
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <GitCompare className="w-3.5 h-3.5 text-purple-400" />
          <span>Multi-Scenario Lab</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Scenario Trade-Off Comparison
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Compare candidate recipes side-by-side. Curve metrics are analytical estimates and assumption-dependent models, not exact on-chain simulations.
        </p>
      </div>

      {/* 3 Recipe Selector Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((slotIdx) => {
          const currentRecipe = candidateRecipes[slotIdx];
          const color = colors[slotIdx];

          return (
            <div
              key={slotIdx}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Scenario {slotIdx + 1}
                </span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
              </div>

              <select
                value={selectedIds[slotIdx] || ''}
                onChange={(e) => handleSelectSlot(slotIdx, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 font-sans"
              >
                {allRecipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.category})
                  </option>
                ))}
              </select>

              {currentRecipe && (
                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Quote:</span>
                    <span className="font-mono text-white">{currentRecipe.requirements.quoteSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-mono text-white">Mode {currentRecipe.requirements.buildCurveMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Raise Target:</span>
                    <span className="font-mono text-emerald-400">
                      {currentRecipe.requirements.targetQuoteRaise} {currentRecipe.requirements.quoteSymbol}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                    <button
                      onClick={() => onSelectRecipe(currentRecipe.id)}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center space-x-1"
                    >
                      <span>Open in Lab</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">What the parameter differences change</h3>
          <p className="mt-1 text-xs text-slate-400">Direct consequences of entered values; no combined ranking or profitability claim.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {practicalDifferences.map((pair) => <article key={`${pair.firstTitle}:${pair.secondTitle}`} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h4 className="text-xs font-semibold text-orange-200">{pair.firstTitle} <span className="text-slate-500">vs</span> {pair.secondTitle}</h4>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[11px] leading-relaxed text-slate-300">
              {pair.differences.map((difference) => <li key={difference}>{difference}</li>)}
            </ul>
          </article>)}
        </div>
      </section>

      {/* Comparative Multi-Curve Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Comparative Price Trajectory Curves
            </h4>
            <p className="text-xs text-slate-400">
              Normalized curve progression (0% to 100% Graduation Threshold)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Recharts Multi-Line Virtual Model
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis
                dataKey="progress"
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={['auto', 'auto']}
                tickFormatter={(v) => (v < 0.001 ? v.toExponential(1) : v.toFixed(4))}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs font-mono shadow-xl space-y-1.5">
                        <div className="text-white font-bold">Progress: {label}%</div>
                        {payload.map((entry: any, i: number) => {
                          const r = candidateRecipes.find((rec) => rec.id === entry.dataKey);
                          return (
                            <div key={i} style={{ color: entry.color }} className="flex justify-between space-x-3">
                              <span>{r?.title.slice(0, 15)}...:</span>
                              <span>{entry.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => {
                  const r = candidateRecipes.find((rec) => rec.id === value);
                  return <span className="text-slate-300 text-xs font-sans">{r?.title || value}</span>;
                }}
              />
              {candidateRecipes.map((r, i) => (
                <Line
                  key={r.id}
                  type="monotone"
                  dataKey={r.id}
                  stroke={colors[i]}
                  strokeWidth={2.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categorized Comparison Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div>
          <h4 className="text-base font-bold text-white">
            Granular Scenario Parameter Comparison Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Every metric is labeled with its derivation formula or protocol method.
          </p>
        </div>

        {categories.map((catName) => {
          const metricsInCat = comparison.metricsComparison.filter((m) => m.category === catName);
          if (metricsInCat.length === 0) return null;

          return (
            <div key={catName} className="space-y-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${
                    catName === 'Exact Protocol Calculation'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : catName === 'Derived Calculation'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : catName === 'Post-Graduation DAMM v2'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {catName}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-4 w-1/4">Metric & Formula</th>
                      {candidateRecipes.map((r, i) => (
                        <th key={r.id} className="py-2.5 px-4" style={{ color: colors[i] }}>
                          {r.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {metricsInCat.map((m, mIdx) => (
                      <tr key={mIdx} className="hover:bg-slate-900/30">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white font-sans">{m.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {m.formulaOrExplanation}
                          </div>
                        </td>
                        {candidateRecipes.map((r) => (
                          <td key={r.id} className="py-3 px-4 font-bold text-slate-100">
                            {m.values[r.id] ?? 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slippage Progression Comparison (25%, 50%, 75%, 100%) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white">
            Slippage & Capital Inflow Progression Milestones
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Modeled effective average price paid vs cumulative quote inflow at 25%, 50%, 75%, and 100% curve fill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {comparison.slippageSimulation.map((sim) => (
            <div
              key={sim.fillPercentage}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono"
            >
              <div className="text-orange-400 font-bold font-sans">
                {sim.fillPercentage}% Curve Fill
              </div>
              <div className="space-y-1.5 pt-1 text-[11px]">
                {candidateRecipes.map((r) => (
                  <div key={r.id} className="border-t border-slate-800/60 pt-1">
                    <div className="text-slate-400 font-sans truncate">{r.title}:</div>
                    <div className="text-white font-semibold">
                      Spot: {sim.priceQuote[r.id] < 0.001 ? sim.priceQuote[r.id]?.toExponential(3) : sim.priceQuote[r.id]?.toFixed(6)} {r.requirements.quoteSymbol}
                    </div>
                    <div className="text-slate-400">
                      Spent: {sim.cumulativeQuoteSpent[r.id]?.toFixed(1)} {r.requirements.quoteSymbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
