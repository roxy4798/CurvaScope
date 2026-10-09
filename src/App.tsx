import React, { lazy, Suspense, useState } from 'react';
import { Navbar } from './components/Navbar';
import type { ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
const OverviewPage = lazy(() => import('./pages/OverviewPage').then((module) => ({ default: module.OverviewPage })));
const RequirementsWizardPage = lazy(() => import('./pages/RequirementsWizardPage').then((module) => ({ default: module.RequirementsWizardPage })));
const RecipeBuilderPage = lazy(() => import('./pages/RecipeBuilderPage').then((module) => ({ default: module.RecipeBuilderPage })));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage').then((module) => ({ default: module.ComparisonPage })));
const RecipeLibraryPage = lazy(() => import('./pages/RecipeLibraryPage').then((module) => ({ default: module.RecipeLibraryPage })));
const VerificationPage = lazy(() => import('./pages/VerificationPage').then((module) => ({ default: module.VerificationPage })));
const DocsMethodologyPage = lazy(() => import('./pages/DocsMethodologyPage').then((module) => ({ default: module.DocsMethodologyPage })));
import type { DbcRecipe, LaunchRequirements } from './domain/types';
import { EXAMPLE_RECIPES } from './data/exampleRecipes';
import { buildFullRecipe, makeUniqueRecipeId } from './data/recipeFactory';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [recipes, setRecipes] = useState<DbcRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('curvescope_user_recipes');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...EXAMPLE_RECIPES, ...parsed];
      }
    } catch {
      // fallback
    }
    return EXAMPLE_RECIPES;
  });

  const [currentRecipe, setCurrentRecipe] = useState<DbcRecipe>(EXAMPLE_RECIPES[0]);

  // Persist user-created recipes to localStorage
  const saveUserRecipe = (recipeToSave: DbcRecipe) => {
    setRecipes((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === recipeToSave.id);
      let updated: DbcRecipe[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = recipeToSave;
      } else {
        updated = [recipeToSave, ...prev];
      }

      // Filter only user-created recipes for localStorage
      const userOnly = updated.filter((r) => !r.isExample);
      try {
        localStorage.setItem('curvescope_user_recipes', JSON.stringify(userOnly));
      } catch {
        // localStorage full or disabled
      }
      return updated;
    });
    setCurrentRecipe(recipeToSave);
  };

  const deleteUserRecipe = (recipeId: string) => {
    setRecipes((prev) => {
      const updated = prev.filter((r) => r.id !== recipeId);
      const userOnly = updated.filter((r) => !r.isExample);
      try {
        localStorage.setItem('curvescope_user_recipes', JSON.stringify(userOnly));
      } catch {}
      return updated;
    });
    if (currentRecipe.id === recipeId) {
      setCurrentRecipe(EXAMPLE_RECIPES[0]);
    }
  };

  const handleSynthesizeRecipe = (requirements: LaunchRequirements) => {
    const requirementsWithUniqueId = {
      ...requirements,
      id: makeUniqueRecipeId(requirements.id, recipes.map((recipe) => recipe.id)),
    };
    const newRecipe = buildFullRecipe(
      requirementsWithUniqueId,
      false,
      `Custom Meteora DBC launch configuration for ${requirements.tokenName} (${requirements.tokenSymbol}).`
    );
    saveUserRecipe(newRecipe);
    setCurrentRecipe(newRecipe);
    setActivePage('builder');
  };

  const handleSelectRecipeFromId = (recipeId: string) => {
    const found = recipes.find((r) => r.id === recipeId) || EXAMPLE_RECIPES[0];
    setCurrentRecipe(found);
    setActivePage('builder');
  };

  const handleCompareRecipe = (recipe: DbcRecipe) => {
    setCurrentRecipe(recipe);
    setActivePage('comparison');
  };

  const handleImportRecipe = (imported: DbcRecipe) => {
    saveUserRecipe(imported);
    setCurrentRecipe(imported);
    setActivePage('builder');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        savedRecipeCount={recipes.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="min-h-[55vh] grid place-items-center text-sm text-slate-400">Loading local workspace…</div>}>
        {activePage === 'overview' && (
          <OverviewPage
            setActivePage={setActivePage}
            onSelectRecipe={handleSelectRecipeFromId}
          />
        )}

        {activePage === 'requirements' && (
          <RequirementsWizardPage
            initialRequirements={currentRecipe.requirements}
            onSynthesizeRecipe={handleSynthesizeRecipe}
          />
        )}

        {activePage === 'builder' && (
          <RecipeBuilderPage
            recipe={currentRecipe}
            onUpdateRecipe={(updated) => {
              setCurrentRecipe(updated);
              saveUserRecipe(updated);
            }}
            onSaveToLibrary={saveUserRecipe}
            onCompareRecipe={handleCompareRecipe}
          />
        )}

        {activePage === 'comparison' && (
          <ComparisonPage
            allRecipes={recipes}
            onSelectRecipe={handleSelectRecipeFromId}
          />
        )}

        {activePage === 'library' && (
          <RecipeLibraryPage
            recipes={recipes}
            onSelectRecipe={handleSelectRecipeFromId}
            onDeleteUserRecipe={deleteUserRecipe}
            onImportRecipe={handleImportRecipe}
            onCompareRecipe={handleCompareRecipe}
          />
        )}

        {activePage === 'verification' && <VerificationPage />}

        {activePage === 'docs' && <DocsMethodologyPage />}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
