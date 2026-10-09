import React, { useState } from 'react';
import {
  Search,
  Upload,
  Terminal,
  Bookmark,
  ArrowRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import type { DbcRecipe } from '../domain/types';
import { InventExportModal } from '../components/InventExportModal';

interface RecipeLibraryPageProps {
  recipes: DbcRecipe[];
  onSelectRecipe: (recipeId: string) => void;
  onDeleteUserRecipe: (recipeId: string) => void;
  onImportRecipe: (recipe: DbcRecipe) => void;
  onCompareRecipe: (recipe: DbcRecipe) => void;
}

export const RecipeLibraryPage: React.FC<RecipeLibraryPageProps> = ({
  recipes,
  onSelectRecipe,
  onDeleteUserRecipe,
  onImportRecipe,
  onCompareRecipe,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipeForExport, setSelectedRecipeForExport] = useState<DbcRecipe | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.requirements.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.requirements.quoteSymbol.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.requirements || !parsed.id || !parsed.title) {
          throw new Error('Invalid CurveScope recipe JSON schema.');
        }
        onImportRecipe(parsed);
        setImportError(null);
      } catch (err: any) {
        setImportError(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Bookmark className="w-3.5 h-3.5 text-orange-400" />
          <span>Preset Library & Reusable Recipes</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          DBC Configuration Preset Hub
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Browse illustrative launch recipes, compare their inputs, and review export readiness. Invent configuration export remains disabled.
        </p>
      </div>

      {/* Search & Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, symbol, or quote..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-sans"
          />
        </div>

        {/* Import JSON button */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <label className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-all">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import Recipe JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <span>{importError}</span>
          <button onClick={() => setImportError(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'All Recipes' },
          { id: 'ai_agent', label: 'AI Agent' },
          { id: 'rwa', label: 'RWA Yield' },
          { id: 'tokenized_stock', label: 'Tokenized Stock Concept' },
          { id: 'meme_fair_launch', label: 'Meme Fair Launch' },
          { id: 'community_dao', label: 'Community DAO' },
          { id: 'custom', label: 'Custom' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {recipe.category.replace('_', ' ')}
                </span>

                <div className="flex items-center space-x-1.5">
                  {recipe.isExample ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      Illustrative Preset
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      User Created
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Parameter Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px]">Quote Pair</span>
                  <p className="text-slate-200 mt-0.5">{recipe.requirements.quoteSymbol}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Curve Mode</span>
                  <p className="text-slate-200 mt-0.5">Mode {recipe.requirements.buildCurveMode}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Raise Target</span>
                  <p className="text-emerald-400 mt-0.5">
                    {recipe.requirements.targetQuoteRaise.toLocaleString()} {recipe.requirements.quoteSymbol}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Base Fee</span>
                  <p className="text-slate-200 mt-0.5">
                    {(recipe.requirements.feePreferences.baseFeeBps / 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedRecipeForExport(recipe)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Invent export status (currently disabled)"
                >
                  <Terminal className="w-4 h-4 text-orange-400" />
                </button>

                <button
                  onClick={() => onCompareRecipe(recipe)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Compare"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </button>

                {!recipe.isExample && (
                  <button
                    onClick={() => onDeleteUserRecipe(recipe.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Recipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => onSelectRecipe(recipe.id)}
                className="flex items-center space-x-1 font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <span>Open Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      {selectedRecipeForExport && (
        <InventExportModal
          recipe={selectedRecipeForExport}
          onClose={() => setSelectedRecipeForExport(null)}
        />
      )}
    </div>
  );
};
