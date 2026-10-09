import React from 'react';
import {
  Compass,
  Sliders,
  FileCode2,
  GitCompare,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { ActivePage } from '../components/Navbar';
import { EXAMPLE_RECIPES } from '../data/exampleRecipes';

interface OverviewPageProps {
  setActivePage: (page: ActivePage) => void;
  onSelectRecipe: (recipeId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  setActivePage,
  onSelectRecipe,
}) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Crypto World's Fair — Meteora Track MVP</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Evidence-Driven Configuration for Better Asset Launches on{' '}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
            Meteora DBC
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Turn launch requirements into reusable analytical recipes, comparisons, and optional read-only pool inspection. Invent configuration export is disabled.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('requirements')}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02]"
          >
            <Sliders className="w-4 h-4" />
            <span>Launch Requirements Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('library')}
            className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm px-5 py-3 rounded-xl transition-all"
          >
            <span>Explore 6 Presets</span>
          </button>

          <button
            onClick={() => setActivePage('verification')}
            className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm px-5 py-3 rounded-xl transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Pool On-Chain</span>
          </button>
        </div>
      </section>

      {/* The Core Problem & The Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The Builder Problem</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Meteora DBC exposes multiple curve builders, configurable fee behavior, and post-graduation migration choices. The available inputs depend on the selected builder mode.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Choosing among those parameters requires understanding their interactions. CurveScope provides local analytical comparisons while clearly labeling estimates and configuration gaps.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The CurveScope Solution</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            CurveScope acts as an <strong>Asset Launch Recipe Lab</strong>. You define requirements: asset type (AI, RWA, Tokenized Stock, Meme), quote currency, and raise target.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            CurveScope organizes requirements, illustrates trade-offs, and compares candidate recipes. Its mode geometry is analytical, and Invent configuration export is disabled.
          </p>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            End-to-End Launch Engineering Workflow
          </h3>
          <p className="text-sm text-slate-400">
            From requirements intake to analytical recipe comparison in 5 steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Launch Profile',
              desc: 'Select asset class, quote currency, supply, and raise target.',
              icon: <Sliders className="w-4 h-4 text-orange-400" />,
              action: () => setActivePage('requirements'),
            },
            {
              step: '02',
              title: 'Recipe Builder',
              desc: 'Synthesize curve shape, fee schedule, and migration allocation.',
              icon: <FileCode2 className="w-4 h-4 text-sky-400" />,
              action: () => setActivePage('builder'),
            },
            {
              step: '03',
              title: 'Validation',
              desc: 'Check selected input ranges and mode-specific recipe requirements.',
              icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
              action: () => setActivePage('builder'),
            },
            {
              step: '04',
              title: 'Comparison',
              desc: 'Contrast 3 candidate curves on slippage, fees, and DAMM depth.',
              icon: <GitCompare className="w-4 h-4 text-purple-400" />,
              action: () => setActivePage('comparison'),
            },
            {
              step: '05',
              title: 'Invent Readiness',
              desc: 'Review missing fields; config export remains disabled pending validation.',
              icon: <Compass className="w-4 h-4 text-amber-400" />,
              action: () => setActivePage('builder'),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-orange-500/40 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-orange-400/80 font-bold">
                  {item.step}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verified vs Simulated Transparency Banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-semibold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Scientific Transparency: Verified Rules vs Simulated Models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
              What Is Source-Checked
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Selected local input bounds and mode-specific parameter shapes.</li>
              <li>Fee numerator conversion uses the documented 1,000,000,000 denominator.</li>
              <li>SDK 1.5.13 builder functions are exercised by unit fixtures.</li>
              <li>Invent schema acceptance and keeper eligibility are not verified.</li>
            </ul>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-purple-400 uppercase tracking-wider text-[11px]">
              What Is Model Simulation
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Price progression is deterministic concentrated-liquidity virtual math.</li>
              <li>Slippage models assume isolated trading without external arb pressure.</li>
              <li>No historical price or volume is fabricated; there is no universally optimal curve.</li>
              <li>No composite outcome scores are used; scenario insights describe selected input differences.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Recipe Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white">
              Curated Asset Class Recipes
            </h3>
            <p className="text-xs text-slate-400">
              Explore illustrative engineering profiles for different example use cases.
            </p>
          </div>

          <button
            onClick={() => setActivePage('library')}
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1 font-medium"
          >
            <span>View All in Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXAMPLE_RECIPES.slice(0, 3).map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe.id)}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {recipe.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-orange-400">
                  {recipe.requirements.quoteSymbol} Pair
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {recipe.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Raise Target</span>
                  <p className="font-mono text-slate-200 mt-0.5">
                    {recipe.requirements.targetQuoteRaise.toLocaleString()}{' '}
                    {recipe.requirements.quoteSymbol}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Base Fee</span>
                  <p className="font-mono text-slate-200 mt-0.5">
                    {(recipe.requirements.feePreferences.baseFeeBps / 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span className="text-[11px]">Mode {recipe.requirements.buildCurveMode}</span>
                <span className="text-orange-400 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center space-x-1">
                  <span>Open Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

