import React from 'react';
import {
  Compass,
  Sliders,
  GitCompare,
  BookOpen,
  Search,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';

export type ActivePage =
  | 'overview'
  | 'requirements'
  | 'builder'
  | 'comparison'
  | 'library'
  | 'verification'
  | 'docs';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  savedRecipeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  savedRecipeCount,
}) => {
  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'requirements', label: 'Launch Profile', icon: <Sliders className="w-4 h-4" /> },
    { id: 'builder', label: 'Recipe Lab', icon: <FileCode2 className="w-4 h-4" /> },
    { id: 'comparison', label: 'Comparison', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'library', label: 'Preset Library', icon: <Search className="w-4 h-4" />, badge: savedRecipeCount },
    { id: 'verification', label: 'On-Chain Proof', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'docs', label: 'Methodology', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActivePage('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-sky-400 p-[2px] glow-orange transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-bold text-lg text-orange-400">CP</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  CurveProof
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  Meteora DBC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                DBC Config-to-Outcome Lab
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-orange-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right cluster badge & status */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-slate-300 font-mono text-[11px]">ANALYTICAL PROTOTYPE</span>
            </div>

            <button
              onClick={() => setActivePage('requirements')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-all shadow-sm hover:shadow-orange-500/20"
            >
              New Launch
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800/60 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-orange-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
