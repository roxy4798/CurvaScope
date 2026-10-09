import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { CurveSegment } from '../domain/types';

interface CurveChartProps {
  segments: CurveSegment[];
  quoteSymbol: string;
  tokenSymbol: string;
  migrationThreshold: number;
}

export const CurveChart: React.FC<CurveChartProps> = ({
  segments,
  quoteSymbol,
  tokenSymbol,
  migrationThreshold,
}) => {
  if (!segments || segments.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-800 rounded-xl">
        No curve segment data available
      </div>
    );
  }

  // Generate 40 interpolated plot points across the segments
  const plotData: {
    pointIndex: number;
    quoteSpent: number;
    price: number;
    priceFormatted: string;
    progressPercent: number;
  }[] = [];

  const totalQuote = segments[segments.length - 1].cumulativeQuote;
  const numSamples = 40;

  for (let i = 0; i <= numSamples; i++) {
    const quoteTarget = (totalQuote * i) / numSamples;
    let price = segments[0].pLower;

    for (const seg of segments) {
      if (quoteTarget <= seg.cumulativeQuote || seg === segments[segments.length - 1]) {
        const segStartQuote = seg.cumulativeQuote - seg.quoteTokenAmount;
        const localQuote = Math.max(0, quoteTarget - segStartQuote);
        const segRatio = seg.quoteTokenAmount > 0 ? localQuote / seg.quoteTokenAmount : 0;

        const sqrtL = Math.sqrt(seg.pLower);
        const sqrtU = Math.sqrt(seg.pUpper);
        const currentSqrt = sqrtL + (sqrtU - sqrtL) * Math.min(1, segRatio);
        price = currentSqrt * currentSqrt;
        break;
      }
    }

    plotData.push({
      pointIndex: i,
      quoteSpent: parseFloat(quoteTarget.toFixed(3)),
      price: price,
      priceFormatted: price < 0.0001 ? price.toExponential(4) : price.toFixed(6),
      progressPercent: Math.round((i / numSamples) * 100),
    });
  }

  const migrationPrice = segments[segments.length - 1].pUpper;

  return (
    <div className="w-full glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800/80 mb-4 gap-2">
        <div>
          <h4 className="text-sm font-semibold text-white">
            Bonding Curve Price Trajectory
          </h4>
          <p className="text-xs text-slate-400">
            Price ({quoteSymbol}/{tokenSymbol}) vs Quote Capital Inflow ({quoteSymbol})
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
            <span className="text-slate-300">Curve Price</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400"></span>
            <span className="text-emerald-400">Graduation Threshold</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plotData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="quoteSpent"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${v} ${quoteSymbol}`}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => (v < 0.001 ? v.toExponential(1) : v.toFixed(4))}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
                      <div className="text-orange-400 font-bold">
                        Fill: {data.progressPercent}% of Graduation
                      </div>
                      <div className="text-slate-300">
                        Quote Inflow: {data.quoteSpent} {quoteSymbol}
                      </div>
                      <div className="text-sky-300">
                        Spot Price: {data.priceFormatted} {quoteSymbol}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={migrationPrice}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: `Graduation: ${migrationPrice < 0.001 ? migrationPrice.toExponential(2) : migrationPrice.toFixed(4)}`,
                fill: '#10b981',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f97316"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#curveGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center text-xs">
        <div>
          <span className="text-slate-400 text-[11px]">Initial Price</span>
          <p className="font-mono font-medium text-slate-200 mt-0.5">
            {segments[0].pLower < 0.0001 ? segments[0].pLower.toExponential(3) : segments[0].pLower.toFixed(6)}{' '}
            {quoteSymbol}
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Migration Threshold</span>
          <p className="font-mono font-medium text-emerald-400 mt-0.5">
            {migrationThreshold.toLocaleString()} {quoteSymbol}
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Segments</span>
          <p className="font-mono font-medium text-slate-200 mt-0.5">
            {segments.length} Concentrated Range{segments.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
