import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import type { LaunchRequirements, AssetCategory, BuildCurveMode } from '../domain/types';
import type { LiquidityDistributionDraft, LiquidityVestingDraft } from '../domain/types';
import { QUOTE_MINT_PRESETS } from '../domain/constants';
import { validateDbcRequirements } from '../engine/validationEngine';
import { ActionableErrorBox } from '../components/ActionableErrorBox';

interface RequirementsWizardPageProps {
  initialRequirements?: LaunchRequirements;
  onSynthesizeRecipe: (requirements: LaunchRequirements) => void;
}

export const RequirementsWizardPage: React.FC<RequirementsWizardPageProps> = ({
  initialRequirements,
  onSynthesizeRecipe,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<AssetCategory>(
    initialRequirements?.category || 'ai_agent'
  );
  const [tokenName, setTokenName] = useState<string>(
    initialRequirements?.tokenName || 'My Agent Token'
  );
  const [tokenSymbol, setTokenSymbol] = useState<string>(
    initialRequirements?.tokenSymbol || 'AGENT'
  );
  const [totalSupply, setTotalSupply] = useState<number>(
    initialRequirements?.totalSupply || 1_000_000_000
  );
  const [tokenDecimals, setTokenDecimals] = useState<6 | 7 | 8 | 9>(
    initialRequirements?.tokenDecimals || 6
  );
  const [tokenType, setTokenType] = useState<'SPLToken' | 'Token2022'>(
    initialRequirements?.tokenType || 'SPLToken'
  );

  // Step 2: Quote & Targets
  const [selectedQuoteSymbol, setSelectedQuoteSymbol] = useState<string>(
    initialRequirements?.quoteSymbol || 'SOL'
  );
  const [customQuoteMint, setCustomQuoteMint] = useState<string>(
    initialRequirements?.quoteMintAddress || 'So11111111111111111111111111111111111111112'
  );
  const [targetQuoteRaise, setTargetQuoteRaise] = useState<number>(
    initialRequirements?.targetQuoteRaise || 15
  );
  const [initialMarketCap, setInitialMarketCap] = useState<number>(
    initialRequirements?.initialMarketCap || 30
  );
  const [migrationMarketCap, setMigrationMarketCap] = useState<number>(
    initialRequirements?.migrationMarketCap || 600
  );

  // Step 3: Curve Geometry
  const [buildCurveMode, setBuildCurveMode] = useState<BuildCurveMode>(
    initialRequirements?.buildCurveMode ?? 2
  );
  const [percentageSupplyOnMigration, setPercentageSupplyOnMigration] = useState<number>(
    initialRequirements?.percentageSupplyOnMigration || 25
  );
  const [midPriceQuote, setMidPriceQuote] = useState<number>(
    initialRequirements?.midPriceQuote || 0.0001
  );
  const [curvePricesText, setCurvePricesText] = useState<string>(
    initialRequirements?.curvePrices?.join(', ') || '0.00000003, 0.0000006'
  );
  const [liquidityWeightsText, setLiquidityWeightsText] = useState<string>(
    initialRequirements?.liquidityWeights?.join(', ') || (initialRequirements?.buildCurveMode === 5 ? '' : Array(16).fill(1).join(', '))
  );

  // Step 4: Fees
  const [baseFeeBps, setBaseFeeBps] = useState<number>(
    initialRequirements?.feePreferences.baseFeeBps || 100
  );
  const [feeMode, setFeeMode] = useState<'fixed' | 'linear_decay' | 'exponential_decay'>(
    initialRequirements?.feePreferences.feeMode || 'linear_decay'
  );
  const [decayDurationMinutes, setDecayDurationMinutes] = useState<number>(
    initialRequirements ? initialRequirements.feePreferences.decayDurationSeconds / 60 : 60
  );
  const [dynamicFeeEnabled, setDynamicFeeEnabled] = useState<boolean>(
    initialRequirements?.feePreferences.dynamicFeeEnabled ?? true
  );
  const [creatorFeeSharePercent, setCreatorFeeSharePercent] = useState<number>(
    initialRequirements?.feePreferences.creatorFeeSharePercent || 60
  );

  // Step 5: Migration & DAMM v2
  const [dammPoolFeeBps, setDammPoolFeeBps] = useState<25 | 30 | 100 | 200 | 400 | 600 | 1000>(
    initialRequirements?.migrationPreferences.dammPoolFeeBps || 100
  );
  const [migrationFeePercent, setMigrationFeePercent] = useState<number>(
    initialRequirements?.migrationPreferences.migrationFeePercent ?? 15
  );
  const [creatorMigrationFeeSharePercent, setCreatorMigrationFeeSharePercent] = useState<number>(
    initialRequirements?.migrationPreferences.creatorMigrationFeeSharePercent ?? 0
  );
  const [lockLiquidity, setLockLiquidity] = useState<boolean>(
    initialRequirements?.migrationPreferences.lockLiquidity ?? true
  );
  const [lockDurationDays, setLockDurationDays] = useState<number>(
    initialRequirements?.migrationPreferences.lockDurationDays || 180
  );
  const [migrationOption, setMigrationOption] = useState<0 | 1>(initialRequirements?.migrationPreferences.migrationOption ?? 1);
  const [lpDraft, setLpDraft] = useState<Record<string, string>>(() => {
    const distribution = initialRequirements?.liquidityDistribution;
    const input: Record<string, string> = {};
    for (const key of ['partnerLiquidityPercentage', 'creatorLiquidityPercentage', 'partnerPermanentLockedLiquidityPercentage', 'creatorPermanentLockedLiquidityPercentage'] as const) {
      input[key] = distribution?.[key] === undefined ? '' : String(distribution[key]);
    }
    for (const role of ['partner', 'creator'] as const) {
      const vesting = distribution?.[`${role}LiquidityVestingInfoParams`];
      for (const key of ['vestingPercentage', 'bpsPerPeriod', 'numberOfPeriods', 'cliffDurationFromMigrationTime', 'totalDuration'] as const) {
        input[`${role}.${key}`] = vesting?.[key] === undefined ? '' : String(vesting[key]);
      }
    }
    return input;
  });
  const updateLpDraft = (key: string, value: string) => setLpDraft((current) => ({ ...current, [key]: value }));
  const parseLpValue = (key: string) => lpDraft[key]?.trim() ? Number(lpDraft[key]) : undefined;
  const parseVestingDraft = (role: 'partner' | 'creator'): Partial<LiquidityVestingDraft> | undefined => {
    const names = ['vestingPercentage', 'bpsPerPeriod', 'numberOfPeriods', 'cliffDurationFromMigrationTime', 'totalDuration'] as const;
    const values = names.map((name) => parseLpValue(`${role}.${name}`));
    if (values.every((value) => value === undefined)) return undefined;
    return Object.fromEntries(names.map((name, index) => [name, values[index]])) as Partial<LiquidityVestingDraft>;
  };
  const liquidityDistribution: LiquidityDistributionDraft = {
    partnerLiquidityPercentage: parseLpValue('partnerLiquidityPercentage'),
    creatorLiquidityPercentage: parseLpValue('creatorLiquidityPercentage'),
    partnerPermanentLockedLiquidityPercentage: parseLpValue('partnerPermanentLockedLiquidityPercentage'),
    creatorPermanentLockedLiquidityPercentage: parseLpValue('creatorPermanentLockedLiquidityPercentage'),
    partnerLiquidityVestingInfoParams: parseVestingDraft('partner'),
    creatorLiquidityVestingInfoParams: parseVestingDraft('creator'),
  };

  // Helper to resolve quote mint address and decimals
  const activePreset = QUOTE_MINT_PRESETS.find((p) => p.symbol === selectedQuoteSymbol);
  const quoteMintAddress =
    selectedQuoteSymbol === 'CUSTOM'
      ? customQuoteMint
      : activePreset?.mintAddress || 'So11111111111111111111111111111111111111112';
  const quoteDecimals = activePreset?.decimals || 9;

  // Build current requirements object for validation
  const currentRequirements: LaunchRequirements = {
    id: initialRequirements?.id || 'recipe-draft',
    name: `${tokenName} Launch Recipe`,
    category,
    tokenSymbol: tokenSymbol.trim().toUpperCase() || 'TOKEN',
    tokenName: tokenName.trim() || 'My Token',
    totalSupply,
    tokenDecimals,
    tokenType,
    quoteMintAddress,
    quoteSymbol: selectedQuoteSymbol === 'CUSTOM' ? 'CUSTOM' : selectedQuoteSymbol,
    quoteDecimals,
    targetQuoteRaise,
    initialMarketCap,
    migrationMarketCap,
    percentageSupplyOnMigration,
    buildCurveMode,
    midPriceQuote: buildCurveMode === 4 ? midPriceQuote : undefined,
    curvePrices: buildCurveMode === 5
      ? curvePricesText.split(',').map((value) => Number(value.trim()))
      : undefined,
    liquidityWeights: [3, 5].includes(buildCurveMode) && liquidityWeightsText.trim()
      ? liquidityWeightsText.split(',').map((value) => Number(value.trim()))
      : undefined,
    feePreferences: {
      baseFeeBps,
      feeMode,
      decayDurationSeconds: decayDurationMinutes * 60,
      dynamicFeeEnabled,
      creatorFeeSharePercent,
    },
    migrationPreferences: {
      migrationOption,
      dammPoolFeeBps,
      migrationFeePercent,
      creatorMigrationFeeSharePercent,
      lockLiquidity,
      lockDurationDays,
    },
    liquidityDistribution: Object.values(liquidityDistribution).some((value) => value !== undefined) ? liquidityDistribution : undefined,
    assumptions: [
      `Initial valuation target: ${initialMarketCap} ${selectedQuoteSymbol}`,
      `Graduation target: ${migrationMarketCap} ${selectedQuoteSymbol}`,
      `Base fee: ${(baseFeeBps / 100).toFixed(2)}% with ${feeMode}`,
    ],
    constraints: [
      `Post-graduation liquidity: ${percentageSupplyOnMigration}% supply in DAMM v2`,
      lockLiquidity ? `Locked for ${lockDurationDays} days` : 'Permanent/unlocked liquidity',
    ],
  };

  const validation = validateDbcRequirements(currentRequirements);

  const handleQuoteChange = (symbol: string) => {
    setSelectedQuoteSymbol(symbol);
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    onSynthesizeRecipe(currentRequirements);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Wizard Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-orange-400" />
          <span>Step {step} of 5</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Asset Launch Requirements Profile
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Define target economic behavior, token properties, fee design, and migration preferences.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 text-xs">
        {[
          { num: 1, label: 'Identity' },
          { num: 2, label: 'Quote & Raise' },
          { num: 3, label: 'Curve Mode' },
          { num: 4, label: 'Fees' },
          { num: 5, label: 'DAMM v2' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 font-semibold'
                : step > s.num
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-400 font-medium'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5">
              {step > s.num ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="font-mono text-[11px]">{s.num}.</span>
              )}
              <span className="truncate">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Step Contents */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {/* STEP 1: Identity & Classification */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                1. Asset Classification & Token Parameters
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select your asset category. Note: Categories are configuration intents, not legal compliance or regulatory endorsements.
              </p>
            </div>

            {/* Legal / Disclaimers notice */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Regulatory & Compliance Disclosure: </span>
                Entering "tokenized_stock" or "rwa" does not register a security, create an SEC prospectus, or configure an oracle. It configures Meteora DBC mathematical curves for USD-anchored threshold discovery.
              </div>
            </div>

            {/* Asset Category Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'ai_agent', label: 'AI Agent / Compute', desc: 'Volatility protection & fee decay' },
                { id: 'rwa', label: 'RWA / Yield Bearer', desc: 'NAV-anchored & low fee drag' },
                { id: 'tokenized_stock', label: 'Tokenized Stock Concept', desc: 'USD quote & calibrated mid-price' },
                { id: 'meme_fair_launch', label: 'Meme Fair Launch', desc: 'Aggressive anti-sniper fee decay' },
                { id: 'community_dao', label: 'Community DAO', desc: 'Ecosystem quote & liquidity depth' },
                { id: 'custom', label: 'Custom Specification', desc: 'Mode 3 liquidity-weight inputs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as AssetCategory)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    category === cat.id
                      ? 'bg-orange-500/15 border-orange-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{cat.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{cat.desc}</div>
                </button>
              ))}
            </div>

            {/* Token Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. NeuroMesh Compute"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Token Symbol
                </label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. MESH"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Supply
                </label>
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Standard DBC supply: 1,000,000,000 tokens
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Decimals
                  </label>
                  <select
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  >
                    <option value={6}>6 (SPL standard)</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9 (Solana native)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Token Program
                  </label>
                  <select
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  >
                    <option value="SPLToken">SPL Token</option>
                    <option value="Token2022">Token-2022</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Quote Asset & Targets */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                2. Quote Currency & Valuation Targets
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select the quote asset paired against the token and set target market caps in quote units.
              </p>
            </div>

            {/* Quote Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Quote Token Presets (mint addresses are editable for custom tokens)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {QUOTE_MINT_PRESETS.map((preset) => (
                  <button
                    key={preset.symbol}
                    type="button"
                    onClick={() => handleQuoteChange(preset.symbol)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedQuoteSymbol === preset.symbol
                        ? 'bg-orange-500/15 border-orange-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{preset.symbol}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Quote Mint if needed */}
            {selectedQuoteSymbol === 'CUSTOM' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom Quote Mint Address
                </label>
                <input
                  type="text"
                  value={customQuoteMint}
                  onChange={(e) => setCustomQuoteMint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="32-44 character base58 address"
                />
              </div>
            )}

            {/* Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[1, 2, 3, 4].includes(buildCurveMode) && <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Initial Market Cap ({selectedQuoteSymbol}){buildCurveMode === 0 || buildCurveMode === 5 ? ' (analytical display only)' : ''}
                </label>
                <input
                  type="number"
                  value={initialMarketCap}
                  onChange={(e) => setInitialMarketCap(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Starting valuation at pool creation
                </span>
              </div>}

              {[1, 2, 3, 4].includes(buildCurveMode) && <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Graduation Market Cap ({selectedQuoteSymbol})
                </label>
                <input
                  type="number"
                  value={migrationMarketCap}
                  onChange={(e) => setMigrationMarketCap(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Valuation when curve phase ends
                </span>
              </div>}

              {buildCurveMode === 0 && <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Quote Raise ({selectedQuoteSymbol})
                </label>
                <input
                  type="number"
                  value={targetQuoteRaise}
                  onChange={(e) => setTargetQuoteRaise(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Quote threshold needed to graduate
                </span>
              </div>}
            </div>
          </div>
        )}

        {/* STEP 3: Curve Geometry */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                3. Curve Construction Mode & Liquidity Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Meteora DBC supports 6 curve modes. Choose how concentrated virtual liquidity is shaped across the price journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  mode: 0,
                  name: 'buildCurve (Single Segment)',
                  desc: 'Simplest mode: specify percentage supply & quote threshold.',
                },
                {
                  mode: 1,
                  name: 'buildCurveWithMarketCap',
                  desc: 'Single segment anchored strictly by initial & graduation market caps.',
                },
                {
                  mode: 2,
                  name: 'buildCurveWithTwoSegments',
                  desc: '2 segments: initial calm discovery, followed by acceleration phase.',
                },
                {
                  mode: 3,
                  name: 'buildCurveWithLiquidityWeights',
                  desc: '16 segments: full control over individual price brackets.',
                },
                {
                  mode: 4,
                  name: 'buildCurveWithMidPrice',
                  desc: '2 segments with explicit mid-point price milestone.',
                },
                {
                  mode: 5,
                  name: 'buildCurveWithCustomSqrtPrices',
                  desc: 'Explicit ascending decimal price checkpoints; visualization remains analytical.',
                },
              ].map((m) => (
                <button
                  key={m.mode}
                  type="button"
                  onClick={() => setBuildCurveMode(m.mode as BuildCurveMode)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    buildCurveMode === m.mode
                      ? 'bg-orange-500/15 border-orange-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Mode {m.mode}: {m.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Direct migration-supply input modes */}
            {[0, 2, 4].includes(buildCurveMode) && <div className="pt-2">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-300 font-medium">
                  Percentage of Total Supply Migrated to DAMM v2
                </span>
                <span className="font-mono text-orange-400 font-bold">
                  {percentageSupplyOnMigration}%
                </span>
              </div>
              <input
                type="range"
                min={0.01}
                max={99.99}
                step={1}
                value={percentageSupplyOnMigration}
                onChange={(e) => setPercentageSupplyOnMigration(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.01%</span>
                <span>Migration supply parameter</span>
                <span>99.99%</span>
              </div>
            </div>}

            {buildCurveMode === 4 && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mid-Price Checkpoint ({selectedQuoteSymbol} / Token)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={midPriceQuote}
                  onChange={(e) => setMidPriceQuote(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            )}
            {buildCurveMode === 5 && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ascending decimal prices ({selectedQuoteSymbol} per token, comma separated)
                </label>
                <textarea
                  value={curvePricesText}
                  onChange={(e) => setCurvePricesText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="0.00000003, 0.0000001, 0.0000006"
                />
                <p className="text-[10px] text-amber-300 mt-1">Invent accepts at least two strictly ascending prices. This plot does not reproduce SDK curve math.</p>
              </div>
            )}
            {[3, 5].includes(buildCurveMode) && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Liquidity weights {buildCurveMode === 3 ? '(exactly 16 values)' : '(optional; one per interval)'}
                </label>
                <textarea
                  value={liquidityWeightsText}
                  onChange={(e) => setLiquidityWeightsText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Weights are passed as recipe inputs; chart allocation is analytical and not a replica of SDK liquidity weighting.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Fees */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                4. Trading Fee Schedule & Splits
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure base fees, anti-sniper fee decay schedules, and dynamic volatility mechanisms.
              </p>
            </div>

            {/* Base Fee Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-300 font-medium">Starting Base Fee</span>
                <span className="font-mono text-orange-400 font-bold">
                  {(baseFeeBps / 100).toFixed(2)}% ({baseFeeBps} bps)
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={500}
                step={5}
                value={baseFeeBps}
                onChange={(e) => setBaseFeeBps(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>25 bps (0.25% min)</span>
                <span>100 bps (1.00% default)</span>
                <span>500 bps (5.00% anti-sniper)</span>
              </div>
            </div>

            {/* Fee Mode */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'fixed', label: 'Fixed Fee', desc: 'Consistent rate across whole curve' },
                { id: 'linear_decay', label: 'Linear Decay', desc: 'Reduces linearly over time' },
                { id: 'exponential_decay', label: 'Exponential Decay', desc: 'Rapid initial drop off' },
              ].map((fm) => (
                <button
                  key={fm.id}
                  type="button"
                  onClick={() => setFeeMode(fm.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    feeMode === fm.id
                      ? 'bg-orange-500/15 border-orange-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{fm.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{fm.desc}</div>
                </button>
              ))}
            </div>

            {feeMode !== 'fixed' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fee Decay Duration: {decayDurationMinutes} minutes ({(decayDurationMinutes / 60).toFixed(1)} hours)
                </label>
                <input
                  type="range"
                  min={10}
                  max={360}
                  step={10}
                  value={decayDurationMinutes}
                  onChange={(e) => setDecayDurationMinutes(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Dynamic Volatility Fee Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-semibold text-xs text-white">Dynamic Volatility Fee</div>
                <div className="text-[11px] text-slate-400">
                  Automatically raises fees during high volatility spikes and decays as volume stabilizes.
                </div>
              </div>
              <input
                type="checkbox"
                checked={dynamicFeeEnabled}
                onChange={(e) => setDynamicFeeEnabled(e.target.checked)}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
              />
            </div>

            {/* Creator Fee Share */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-300 font-medium">
                  Creator Share of Non-Protocol Fees
                </span>
                <span className="font-mono text-orange-400 font-bold">
                  {creatorFeeSharePercent}% (Partner: {100 - creatorFeeSharePercent}%)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={creatorFeeSharePercent}
                onChange={(e) => setCreatorFeeSharePercent(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Applies to the non-protocol portion of DBC trading fees. It does not describe migrated LP ownership or migration fees.
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: Migration & DAMM v2 */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                5. Post-Graduation DAMM v2 Pool & Vesting
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Plan migration and LP ownership separately from DBC trading-fee and migration-fee sharing.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Migration destination</label>
              <select value={migrationOption} onChange={(event) => setMigrationOption(Number(event.target.value) as 0 | 1)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white">
                <option value={1}>DAMM v2 (current new-pool path)</option>
                <option value={0}>DAMM v1 (SDK marks new configs/pools deprecated)</option>
              </select>
              {migrationOption === 0 && <p className="text-xs text-rose-300">The installed DBC SDK marks DAMM v1 migration deprecated for new configs and pools. Choose DAMM v2 for a new-pool planning recipe.</p>}
            </div>

            {/* DAMM v2 Fee Tier */}
            {migrationOption === 1 && <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                DAMM v2 Pool Trading Fee Tier
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[25, 30, 100, 200, 400, 600].map((fee) => (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => setDammPoolFeeBps(fee as any)}
                    className={`p-2.5 rounded-xl text-center border font-mono text-xs transition-all ${
                      dammPoolFeeBps === fee
                        ? 'bg-orange-500/15 border-orange-500 text-orange-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {(fee / 100).toFixed(2)}%
                  </button>
                ))}
              </div>
            </div>}

            <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div>
                <h4 className="text-sm font-semibold text-white">LP allocation inputs</h4>
                <p className="text-[11px] text-slate-400">These fields describe migrated LP shares. They are not creator trading-fee shares or migration-fee shares. Leave blank until decided.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ['partnerLiquidityPercentage', 'Partner claimable LP (%)'],
                  ['creatorLiquidityPercentage', 'Creator claimable LP (%)'],
                  ['partnerPermanentLockedLiquidityPercentage', 'Partner permanently locked LP (%)'],
                  ['creatorPermanentLockedLiquidityPercentage', 'Creator permanently locked LP (%)'],
                ].map(([key, label]) => <label key={key} className="text-xs text-slate-300">{label}<input type="number" min="0" max="100" step="0.1" value={lpDraft[key]} onChange={(event) => updateLpDraft(key, event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Not set" /></label>)}
              </div>
              <details className="rounded-lg border border-slate-800 p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-200">Optional DAMM v2 creator/partner vesting schedules</summary>
                <p className="my-2 text-[10px] text-slate-400">SDK vesting inputs are supplied separately for partner and creator. A positive vesting percentage requires all schedule fields. SDK validates schedule shape and the one-day lock condition; Invent CLI acceptance remains unverified.</p>
                {(['partner', 'creator'] as const).map((role) => <div key={role} className="mt-3 space-y-2">
                  <h5 className="text-xs font-semibold capitalize text-orange-200">{role}</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    {[
                      ['vestingPercentage', 'Vesting %'],
                      ['bpsPerPeriod', 'BPS / period'],
                      ['numberOfPeriods', 'Periods'],
                      ['cliffDurationFromMigrationTime', 'Cliff seconds'],
                      ['totalDuration', 'Duration seconds'],
                    ].map(([name, label]) => <label key={name} className="text-[10px] text-slate-400">{label}<input type="number" min="0" value={lpDraft[`${role}.${name}`]} onChange={(event) => updateLpDraft(`${role}.${name}`, event.target.value)} className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white" placeholder="Not set" /></label>)}
                  </div>
                </div>)}
              </details>
            </section>

            {/* Liquidity Locking */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="font-semibold text-xs text-white">Heuristic lock preference</div>
                  <div className="text-[11px] text-slate-400">
                    Used only in CurveScope trade-off heuristics. It does not set LP allocation, vesting, or a deployed locker position.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lockLiquidity}
                  onChange={(e) => setLockLiquidity(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                />
              </div>

              {lockLiquidity && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lock Duration: {lockDurationDays} days
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={730}
                    step={30}
                    value={lockDurationDays}
                    onChange={(e) => setLockDurationDays(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Creator Migration Fee */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-300 font-medium">
                  Total Configured Migration Fee
                </span>
                <span className="font-mono text-orange-400 font-bold">
                  {migrationFeePercent}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={migrationFeePercent}
                onChange={(e) => setMigrationFeePercent(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Percentage of the migration quote threshold deducted as configured migration fee (audited Invent config range: 0–50%).
              </span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-300 font-medium">Creator share of configured migration fee</span>
                <span className="font-mono text-orange-400 font-bold">{creatorMigrationFeeSharePercent}%</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={creatorMigrationFeeSharePercent} onChange={(e) => setCreatorMigrationFeeSharePercent(Number(e.target.value))} className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer" />
              <span className="text-[10px] text-slate-400 mt-1 block">Independent of creator trading-fee share and migrated LP ownership.</span>
            </div>
          </div>
        )}

        {/* Validation Box */}
        <ActionableErrorBox validation={validation} />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={!validation.isValid}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize DBC Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

