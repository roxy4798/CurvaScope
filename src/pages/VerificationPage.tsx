import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  verifyOnChainPool,
} from '../adapters/solana/readOnlyClient';
import type { PoolVerificationResult } from '../adapters/solana/readOnlyClient';
import {
  METEORA_DBC_PROGRAM_ID,
  METEORA_DBC_POOL_AUTHORITY,
  METEORA_DAMM_V2_PROGRAM_ID,
  MIGRATION_KEEPERS,
} from '../domain/constants';

export const VerificationPage: React.FC = () => {
  const [addressInput, setAddressInput] = useState<string>('');
  const [rpcUrl, setRpcUrl] = useState<string>('https://api.mainnet-beta.solana.com');
  const [customRpcUrl, setCustomRpcUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PoolVerificationResult | null>(null);

  const sampleAccounts = [
    { label: 'DBC Program ID', address: METEORA_DBC_PROGRAM_ID, desc: 'Core Meteora DBC program account' },
    { label: 'Pool Authority PDA', address: METEORA_DBC_POOL_AUTHORITY, desc: 'Program-derived pool authority' },
    { label: 'DAMM v2 Program', address: METEORA_DAMM_V2_PROGRAM_ID, desc: 'Graduation destination AMM program' },
    { label: 'Migration Keeper', address: MIGRATION_KEEPERS[0], desc: 'Automated graduation bot account' },
  ];

  const handleVerify = async (targetAddress?: string) => {
    const addressToQuery = targetAddress || addressInput;
    if (!addressToQuery.trim()) return;

    setIsLoading(true);
    setResult(null);

    const activeRpc = rpcUrl === 'custom' ? customRpcUrl || 'https://api.mainnet-beta.solana.com' : rpcUrl;
    const res = await verifyOnChainPool(addressToQuery, activeRpc);
    setResult(res);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Read-Only Protocol Evidence</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          On-Chain Meteora Verification
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Verify live bonding curve pool and program state using the official `@meteora-ag/dynamic-bonding-curve-sdk` and bounded read-only RPC queries.
        </p>
      </div>

      {/* Query Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {/* RPC Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Select Solana RPC Endpoint
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'https://api.mainnet-beta.solana.com', label: 'Mainnet-Beta (Public)' },
              { id: 'https://api.devnet.solana.com', label: 'Devnet (Public)' },
              { id: 'custom', label: 'Custom RPC URL' },
            ].map((rpc) => (
              <button
                key={rpc.id}
                type="button"
                onClick={() => setRpcUrl(rpc.id)}
                className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all ${
                  rpcUrl === rpc.id
                    ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {rpc.label}
              </button>
            ))}
          </div>

          {rpcUrl === 'custom' && (
            <input
              type="text"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              placeholder="https://mainnet.helius-rpc.com/?api-key=..."
              className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          )}
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Account or DBC Virtual Pool Address
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter 32-44 character base58 Solana public key..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => handleVerify()}
              disabled={isLoading || !addressInput.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-sm"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? 'Querying...' : 'Verify'}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Address Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400">
            Or test with verified on-chain Meteora accounts:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleAccounts.map((samp) => (
              <button
                key={samp.label}
                type="button"
                onClick={() => {
                  setAddressInput(samp.address);
                  handleVerify(samp.address);
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-slate-200 text-[11px]">{samp.label}</div>
                <div className="font-mono text-[10px] text-orange-400 truncate mt-0.5">
                  {samp.address.slice(0, 4)}...{samp.address.slice(-4)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Results Display */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  result.status === 'VERIFIED_DBC_POOL'
                    ? 'bg-emerald-400'
                    : result.status === 'VALID_SOLANA_ACCOUNT_NOT_DBC'
                    ? 'bg-sky-400'
                    : result.status === 'RPC_ERROR_OR_RATE_LIMIT'
                    ? 'bg-amber-400'
                    : result.status === 'DBC_PROGRAM_ACCOUNT_UNDECODABLE'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              ></span>
              <h3 className="text-base font-bold text-white">Verification Diagnostic Result</h3>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              {new Date(result.observationTimestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Diagnostic message box */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              result.status === 'VERIFIED_DBC_POOL'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : result.status === 'VALID_SOLANA_ACCOUNT_NOT_DBC'
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : result.status === 'RPC_ERROR_OR_RATE_LIMIT'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : result.status === 'DBC_PROGRAM_ACCOUNT_UNDECODABLE'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {result.diagnosticMessage}
          </div>

          {/* Account Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px]">Queried Address</span>
              <p className="text-white truncate font-bold">{result.poolAddress}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px]">Base58 Validation</span>
              <p className={result.isValidSolanaAddress ? 'text-emerald-400' : 'text-rose-400'}>
                {result.isValidSolanaAddress ? 'Valid Solana public key (may be off-curve)' : 'Invalid Format'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px]">Evidence Source</span>
              <p className="text-white">{result.evidenceSource === 'live-rpc' ? 'Live RPC observation' : result.evidenceSource === 'injected-test' ? 'Injected test response (not live chain data)' : 'Local address check only'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px]">RPC Endpoint</span>
              <p className="text-white truncate">{result.rpcEndpointUsed}</p>
            </div>

            {result.accountOwner && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px]">On-Chain Program Owner</span>
                <p className="text-orange-400 truncate font-bold">{result.accountOwner}</p>
              </div>
            )}

            {result.lamportsBalance !== undefined && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px]">Rent & Balance</span>
                <p className="text-slate-200">
                  {(result.lamportsBalance / 1_000_000_000).toFixed(4)} SOL ({result.dataSize} bytes data)
                </p>
              </div>
            )}
          </div>

          {/* Decoded DBC Pool State if available */}
          {result.decodedPoolState && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white font-sans">
                Decoded DBC Pool State (via SDK StateService)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px]">Base Mint</span>
                  <p className="text-slate-200 truncate">{result.decodedPoolState.baseMint || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Quote Mint</span>
                  <p className="text-slate-200 truncate">{result.decodedPoolState.quoteMint || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Graduation Status</span>
                  <p className={result.decodedPoolState.isMigrated ? 'text-emerald-400' : 'text-orange-400'}>
                    {result.decodedPoolState.isMigrated ? 'Graduated to DAMM v2' : 'Active Bonding Curve'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Solscan Link */}
          {result.isValidSolanaAddress && (
            <div className="pt-2 text-right">
              <a
                href={`https://solscan.io/account/${result.poolAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-orange-400 hover:underline font-mono"
              >
                <span>View on Solscan Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Protocol Integration Architecture Explainer */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
          <Layers className="w-4 h-4 text-orange-400" />
          <span>How CurveScope Integrates with Meteora DBC & DAMM v2</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white">1. Configuration Pipeline</div>
            <p className="text-slate-400 text-[11px]">
              CurveScope does not currently create SDK `ConfigParameters` or perform SDK-equivalent curve construction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white">2. Invent CLI Tooling</div>
            <p className="text-slate-400 text-[11px]">
              Produces a draft JSONC only. It is not schema-complete and must be reviewed against Meteora Invent before use.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white">3. DAMM v2 Migration</div>
            <p className="text-slate-400 text-[11px]">
              Derives post-graduation liquidity depths, initial concentrated AMM price, and locker vesting schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
