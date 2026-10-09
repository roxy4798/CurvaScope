import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileText,
  Table,
  Code,
  AlertTriangle,
} from 'lucide-react';
import type { DbcRecipe } from '../domain/types';
import {
  formatInventJsonc,
  formatHumanReadableReport,
  formatSegmentsCsv,
  getInventExportReadiness,
} from '../adapters/meteora/inventSerializer';

interface InventExportModalProps {
  recipe: DbcRecipe;
  onClose: () => void;
}

export const InventExportModal: React.FC<InventExportModalProps> = ({
  recipe,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'invent' | 'report' | 'csv' | 'json'>('invent');
  const [copied, setCopied] = useState<boolean>(false);

  const inventJsonc = formatInventJsonc(recipe);
  const reportMd = formatHumanReadableReport(recipe);
  const segmentsCsv = formatSegmentsCsv(recipe);
  const rawJson = JSON.stringify(recipe, null, 2);
  const readiness = getInventExportReadiness(recipe);
  const readinessStatuses = [
    ['Analytical recipe', readiness.analyticalRecipe],
    ['Required inputs', readiness.requiredInputs],
    ['Local consistency checks', readiness.localValidation],
    ['Official Invent validation', readiness.officialInventValidation],
    ['On-chain deployment', readiness.onChainDeployment],
  ];

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'invent':
        return inventJsonc;
      case 'report':
        return reportMd;
      case 'csv':
        return segmentsCsv;
      case 'json':
        return rawJson;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = `${recipe.id}`;
    let mimeType = 'text/plain';

    if (activeTab === 'invent') {
      filename += '_invent_analytical_draft_only.txt';
      mimeType = 'text/plain';
    } else if (activeTab === 'report') {
      filename += '_report.md';
      mimeType = 'text/markdown';
    } else if (activeTab === 'csv') {
      filename += '_segments.csv';
      mimeType = 'text/csv';
    } else {
      filename += '_recipe.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([getCurrentContent()], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Configuration Diagnostics & Export: {recipe.title}
              </h3>
              <p className="text-xs text-slate-400">
                Analytical draft exports and Meteora Invent readiness diagnostics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setActiveTab('invent')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'invent'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Invent Readiness & Draft Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown Report</span>
            </button>

            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'csv'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Segments CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'json'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Recipe JSON</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied!' : activeTab === 'invent' ? 'Copy Draft Note' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content Preview */}
        <div className="p-6 flex-1 overflow-auto bg-[#070b14] font-mono text-xs text-slate-300">
          {activeTab === 'invent' && (
            <div className="mb-5 space-y-4">
              {/* Prominent Warning Banner */}
              <div className="rounded-xl border border-amber-600/70 bg-amber-950/40 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Critical Boundary: Analytical Draft Only — Not an Invent Configuration</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  Official Meteora Invent schema completeness and CLI parser acceptance are <strong>unverified</strong>.
                  Do <strong>not</strong> copy this draft into <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-100 font-mono">studio/config/dbc_config.jsonc</code> or use it to create on-chain pools.
                </p>
                <div className="text-[11px] font-sans text-amber-300/80 grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 border-t border-amber-800/40">
                  <div>• Local Consistency Checks: <span className="text-emerald-400 font-semibold">Passed</span></div>
                  <div>• Selected SDK Helper Checks: <span className="text-emerald-400 font-semibold">Applied Locally</span></div>
                  <div>• Official Invent Parser Validation: <span className="text-amber-400 font-semibold">Not Verified</span></div>
                  <div>• On-Chain Pool Deployment: <span className="text-rose-400 font-semibold">Unsupported</span></div>
                </div>
              </div>

              {/* Status Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {readinessStatuses.map(([label, status]) => (
                  <div key={label} className="rounded-lg border border-amber-900/50 bg-slate-950/60 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="text-xs font-semibold text-amber-200 mt-1">{status}</div>
                  </div>
                ))}
              </div>

              {/* Field Checklist */}
              <div className="rounded-xl border border-amber-800/50 bg-amber-950/20 p-4">
                <h4 className="text-sm font-semibold text-amber-200 mb-2">Field checklist and next actions</h4>
                <div className="space-y-2">
                  {readiness.fields.map((item) => (
                    <div key={item.field} className="grid grid-cols-1 md:grid-cols-[minmax(190px,0.8fr)_110px_1.3fr_1.5fr] gap-2 md:gap-3 border-t border-amber-900/40 pt-2">
                      <code className="text-slate-200">{item.field}</code>
                      <span className={item.state === 'complete' ? 'text-emerald-300' : item.state === 'unsupported' ? 'text-slate-400' : 'text-amber-300'}>{item.state}</span>
                      <span className="text-slate-400">{item.reason}</span>
                      <span className="text-amber-100/80">Next: {item.remedy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {getCurrentContent()}
          </pre>
        </div>

        {/* Instructions banner */}
        <div className="px-6 py-3 border-t border-amber-800/80 bg-amber-950/30 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono">
            <span className="text-orange-400 font-semibold">Boundary Notice:</span>
            <span>Analytical draft only. Do not execute with Meteora Invent or use for pool creation.</span>
          </div>
          <span className="text-[11px] text-amber-300/90 font-sans">Official CLI configurations must be authored independently</span>
        </div>
      </div>
    </div>
  );
};
