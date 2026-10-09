import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { METEORA_DBC_PROGRAM_ID, METEORA_DAMM_V2_PROGRAM_ID } from '../domain/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050811] border-t border-slate-900 mt-20 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm">CurveScope</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                Free / Local-first
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Evidence-driven configuration and developer tooling for building better asset launches on Meteora Dynamic Bonding Curve (DBC) & DAMM v2.
            </p>
          </div>

          {/* Column 2: Protocol Contracts */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Meteora Program IDs
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-400">DBC: </span>
                <a
                  href={`https://solscan.io/account/${METEORA_DBC_PROGRAM_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:underline"
                >
                  {METEORA_DBC_PROGRAM_ID.slice(0, 8)}...{METEORA_DBC_PROGRAM_ID.slice(-4)}
                </a>
              </div>
              <div>
                <span className="text-slate-400">DAMM v2: </span>
                <a
                  href={`https://solscan.io/account/${METEORA_DAMM_V2_PROGRAM_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  {METEORA_DAMM_V2_PROGRAM_ID.slice(0, 8)}...{METEORA_DAMM_V2_PROGRAM_ID.slice(-4)}
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Official Meteora Resources */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Official Resources
            </div>
            <ul className="space-y-1 text-slate-400">
              <li>
                <a
                  href="https://docs.meteora.ag/developer-guides/dbc"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-200 inline-flex items-center space-x-1"
                >
                  <span>Meteora DBC Documentation</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MeteoraAg/meteora-invent"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-200 inline-flex items-center space-x-1"
                >
                  <span>Meteora Invent CLI & Studio</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MeteoraAg/dynamic-bonding-curve-sdk"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-200 inline-flex items-center space-x-1"
                >
                  <span>DBC TypeScript SDK (v1.5.13)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Local and wallet boundary */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local and Read-Only</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              No private keys or wallet signatures are requested. Core planning needs no paid API, database, or subscription. Optional RPC inspection depends on an endpoint. Curve charts are estimates.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>CurveScope · Crypto World's Fair — Meteora track planning MVP.</p>
          <p className="mt-2 sm:mt-0">
            Independent research & developer tooling. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
