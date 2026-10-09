import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download,
  Terminal,
  Bookmark,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import type { DbcRecipe, LaunchRequirements } from '../domain/types';
import { buildFullRecipe } from '../data/recipeFactory';
import { MetricCard } from '../components/MetricCard';
import { CurveChart } from '../components/CurveChart';
import { ActionableErrorBox } from '../components/ActionableErrorBox';
import { InventExportModal } from '../components/InventExportModal';
import { formatInventJsonc } from '../adapters/meteora/inventSerializer';

interface RecipeBuilderPageProps {
  recipe: DbcRecipe;
  onUpdateRecipe: (updatedRecipe: DbcRecipe) => void;
  onSaveToLibrary: (recipe: DbcRecipe) => void;
  onCompareRecipe: (recipe: DbcRecipe) => void;
}

export const RecipeBuilderPage: React.FC<RecipeBuilderPageProps> = ({
  recipe,
  onUpdateRecipe,
  onSaveToLibrary,
  onCompareRecipe,
}) => {
  const [activeTab, setActiveTab] = useState<'curve' | 'tradeoffs' | 'invent' | 'tune'>('curve');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fine-tuning state bound to current recipe requirements
  const handleTweak = (field: keyof LaunchRequirements | string, value: any) => {
    let newReq = { ...recipe.requirements };

    if (field === 'targetQuoteRaise') {
      newReq.targetQuoteRaise = value;
    } else if (field === 'initialMarketCap') {
      newReq.initialMarketCap = value;
    } else if (field === 'migrationMarketCap') {
      newReq.migrationMarketCap = value;
    } else if (field === 'percentageSupplyOnMigration') {
      newReq.percentageSupplyOnMigration = value;
    } else if (field === 'baseFeeBps') {
      newReq.feePreferences = { ...newReq.feePreferences, baseFeeBps: value };
    } else if (field === 'dynamicFeeEnabled') {
      newReq.feePreferences = { ...newReq.feePreferences, dynamicFeeEnabled: value };
    } else if (field === 'creatorFeeSharePercent') {
      newReq.feePreferences = { ...newReq.feePreferences, creatorFeeSharePercent: value };
    }

    const updated = buildFullRecipe(newReq, recipe.isExample, recipe.description, recipe.notes);
    onUpdateRecipe(updated);
  };

  const handleSave = () => {
    onSaveToLibrary(recipe);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const { requirements, derivedMetrics, tradeOffs, validation, segments } = recipe;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {recipe.category.replace('_', ' ')}
              </span>
              {recipe.isExample && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Example Recipe (Not Proven Optimal)
                </span>
              )}
              <span className="text-xs font-mono text-slate-400">
                ID: {recipe.id}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {recipe.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {recipe.description}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <Bookmark className="w-3.5 h-3.5 text-orange-400" />
              <span>{saveSuccess ? 'Saved Locally!' : 'Save Recipe'}</span>
            </button>

            <button
              onClick={() => onCompareRecipe(recipe)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Compare Scenarios</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Invent Readiness & Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-slate-300">Target: Meteora DBC v1.5.13</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Quote Mint:</span>
              <span className="font-mono text-orange-400 font-semibold">{requirements.quoteSymbol}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Mode:</span>
              <span className="font-mono text-slate-300">Mode {requirements.buildCurveMode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            {validation.isValid ? (
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Local Input Checks Passed</span>
              </span>
            ) : (
              <span className="text-rose-400 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{validation.errors.length} Validation Errors</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'curve', label: 'Curve Economics & Chart', icon: <Layers className="w-4 h-4" /> },
          { id: 'tradeoffs', label: 'Trade-Off & Reason Engine', icon: <Info className="w-4 h-4" /> },
          { id: 'invent', label: 'Invent Readiness & Diagnostics', icon: <Terminal className="w-4 h-4" /> },
          { id: 'tune', label: 'Interactive Tuning Controls', icon: <Sliders className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Validation alert banner if invalid */}
      {!validation.isValid && <ActionableErrorBox validation={validation} />}

      {/* TAB 1: CURVE ECONOMICS & CHART */}
      {activeTab === 'curve' && (
        <div className="space-y-6">
          {/* 6 Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard
              label="Starting Price"
              value={
                derivedMetrics.initialPriceQuote < 0.0001
                  ? derivedMetrics.initialPriceQuote.toExponential(3)
                  : derivedMetrics.initialPriceQuote.toFixed(6)
              }
              unit={requirements.quoteSymbol}
              category="Derived Metric"
              subValue="Initial pool opening rate"
            />
            <MetricCard
              label="Graduation Price"
              value={
                derivedMetrics.migrationPriceQuote < 0.0001
                  ? derivedMetrics.migrationPriceQuote.toExponential(3)
                  : derivedMetrics.migrationPriceQuote.toFixed(6)
              }
              unit={requirements.quoteSymbol}
              category="Derived Metric"
              subValue={`${derivedMetrics.priceMultiplier.toFixed(1)}x multiple`}
              highlight
            />
            <MetricCard
              label="Quote Needed"
              value={derivedMetrics.quoteNeededToGraduate.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              unit={requirements.quoteSymbol}
              category="Simulation"
              subValue="CurveScope analytical estimate"
            />
            <MetricCard
              label="DAMM v2 Base LP"
              value={derivedMetrics.baseTokensMigrated.toLocaleString()}
              unit={`${requirements.percentageSupplyOnMigration}%`}
              category="DAMM v2"
              subValue="Reserved supply for AMM"
            />
            <MetricCard
              label="DAMM v2 Quote LP"
              value={derivedMetrics.quoteReserveToDammV2.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              unit={requirements.quoteSymbol}
              category="DAMM v2"
              subValue="Net seeded quote liquidity"
            />
            <MetricCard
              label="Base Fee Schedule"
              value={`${(requirements.feePreferences.baseFeeBps / 100).toFixed(2)}%`}
              unit={requirements.feePreferences.feeMode}
              category="Derived Metric"
              subValue={requirements.feePreferences.dynamicFeeEnabled ? 'Dynamic fee selected (not simulated exactly)' : 'Static base fee selected'}
            />
          </div>

          {/* Interactive Recharts Visualization */}
          <CurveChart
            segments={segments}
            quoteSymbol={requirements.quoteSymbol}
            tokenSymbol={requirements.tokenSymbol}
            migrationThreshold={derivedMetrics.quoteNeededToGraduate}
          />

          {/* Concentrated Liquidity Segments Breakdown Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  CurveScope Analytical Curve Segments
                </h4>
                <p className="text-xs text-slate-400">
                  Floating-point visualization of the selected mode's price path. These values are not decoded from an on-chain curve and are not SDK-parity output.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {segments.length} analytical segment{segments.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">Lower Price ({requirements.quoteSymbol})</th>
                    <th className="py-2.5 px-3">Upper Price ({requirements.quoteSymbol})</th>
                    <th className="py-2.5 px-3">Virtual Liquidity ($L$)</th>
                    <th className="py-2.5 px-3">Base Sold ({requirements.tokenSymbol})</th>
                    <th className="py-2.5 px-3">Quote Inflow ({requirements.quoteSymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {segments.map((seg) => (
                    <tr key={seg.segmentIndex} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 text-orange-400 font-bold">#{seg.segmentIndex + 1}</td>
                      <td className="py-2.5 px-3">
                        {seg.pLower < 0.0001 ? seg.pLower.toExponential(4) : seg.pLower.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-3">
                        {seg.pUpper < 0.0001 ? seg.pUpper.toExponential(4) : seg.pUpper.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-3">{seg.virtualLiquidity.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                      <td className="py-2.5 px-3">{seg.baseTokenAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                        {seg.quoteTokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRADE-OFFS & REASONS */}
      {activeTab === 'tradeoffs' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-400">These explanations use local input thresholds and modeled direct consequences. The High / Medium / Low tags are heuristic labels, not measured protocol risk, launch outcomes, or financial advice.</p>

          {/* Granular Trade-Off Dimension Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">
              Parameter Trade-Off Explanations & Compromises
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradeOffs.items.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.dimension}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        item.riskSeverity === 'high'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : item.riskSeverity === 'medium'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.riskSeverity} Heuristic
                    </span>
                  </div>

                  <div className="font-mono text-orange-400 font-semibold">{item.choice}</div>

                  <div className="space-y-1 pt-1 text-slate-300">
                    <div>
                      <span className="text-emerald-400 font-semibold">Benefit: </span>
                      {item.benefit}
                    </div>
                    <div>
                      <span className="text-rose-400 font-semibold">Drawback: </span>
                      {item.drawback}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions & Disclosures */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <h5 className="font-semibold text-white">Assumptions & Operational Disclosures</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              {requirements.assumptions.map((asmp, idx) => (
                <li key={idx}>{asmp}</li>
              ))}
              <li>Quote threshold assumes 100% of required reserve is reached before graduation triggers.</li>
              <li>A fixed 0.20% protocol liquidity migration deduction applies to DAMM v2 pool seeding.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: INVENT CLI PREVIEW */}
      {activeTab === 'invent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Meteora Invent CLI Configuration (`studio/config/dbc_config.jsonc`)
              </h4>
              <p className="text-xs text-slate-400">
                Analytical draft only. Schema completeness and official Meteora Invent parser acceptance are unverified. Do not use this draft to create pools.
              </p>
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>View Configuration Diagnostics</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="whitespace-pre leading-relaxed select-all">
              {formatInventJsonc(recipe)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE TUNING CONTROLS */}
      {activeTab === 'tune' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Live Parameter Tuning
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Adjust parameters in real time. The mathematical engine immediately recalculates all virtual curve segments, price multiples, and trade-off metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tweak 1: Target Raise */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Target Quote Raise</span>
                <span className="font-mono text-orange-400 font-bold">
                  {requirements.targetQuoteRaise} {requirements.quoteSymbol}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={requirements.targetQuoteRaise}
                onChange={(e) => handleTweak('targetQuoteRaise', Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tweak 2: Base Fee */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Base Trading Fee</span>
                <span className="font-mono text-orange-400 font-bold">
                  {(requirements.feePreferences.baseFeeBps / 100).toFixed(2)}% ({requirements.feePreferences.baseFeeBps} bps)
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={500}
                step={5}
                value={requirements.feePreferences.baseFeeBps}
                onChange={(e) => handleTweak('baseFeeBps', Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tweak 3: Migration Market Cap */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Migration Market Cap</span>
                <span className="font-mono text-orange-400 font-bold">
                  {requirements.migrationMarketCap} {requirements.quoteSymbol}
                </span>
              </div>
              <input
                type="range"
                min={requirements.initialMarketCap * 2}
                max={requirements.initialMarketCap * 40}
                step={10}
                value={requirements.migrationMarketCap}
                onChange={(e) => handleTweak('migrationMarketCap', Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tweak 4: Percentage Supply Migrated */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Supply Migrated to DAMM v2</span>
                <span className="font-mono text-orange-400 font-bold">
                  {requirements.percentageSupplyOnMigration}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={1}
                value={requirements.percentageSupplyOnMigration}
                onChange={(e) => handleTweak('percentageSupplyOnMigration', Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <InventExportModal recipe={recipe} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};
