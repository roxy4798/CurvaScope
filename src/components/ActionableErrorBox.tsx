import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ValidationResult } from '../domain/types';

interface ActionableErrorBoxProps {
  validation: ValidationResult;
  onFixField?: (field: string) => void;
}

export const ActionableErrorBox: React.FC<ActionableErrorBoxProps> = ({
  validation,
  onFixField,
}) => {
  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
        <div className="flex-1">
          <span className="font-semibold text-emerald-300">
            Local Input Checks Passed
          </span>
          <p className="text-emerald-400/80 text-[11px] mt-0.5">
            Passed {validation.rulesCheckedCount} CurveScope consistency checks. This does not establish SDK equivalence or Invent CLI acceptance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Errors */}
      {validation.errors.map((err, idx) => (
        <div
          key={`err-${idx}`}
          className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2"
        >
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-rose-300">{err.code}</span>
                <span className="font-mono text-[10px] text-rose-400/80 px-1.5 py-0.2 rounded bg-rose-500/20">
                  {err.field}
                </span>
              </div>
              <p className="text-slate-200 mt-1">{err.message}</p>
            </div>
          </div>

          <div className="pl-6 pt-1 flex items-center justify-between border-t border-rose-500/20 text-[11px]">
            <div className="text-slate-300 flex items-center space-x-1.5">
              <span className="text-rose-400 font-semibold">Remedy:</span>
              <span>{err.remedyAction}</span>
            </div>
            {onFixField && (
              <button
                onClick={() => onFixField(err.field)}
                className="text-rose-300 hover:text-white flex items-center space-x-1 underline text-[11px]"
              >
                <span>Navigate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Warnings */}
      {validation.warnings.map((warn, idx) => (
        <div
          key={`warn-${idx}`}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5"
        >
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-amber-300">Protocol Caution</span>
                <span className="font-mono text-[10px] text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/20">
                  {warn.field}
                </span>
              </div>
              <p className="text-slate-200 mt-1">{warn.message}</p>
              <p className="text-amber-400/90 text-[11px] mt-0.5">
                <span className="font-semibold">Trade-off implication: </span>
                {warn.tradeOffImplication}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
