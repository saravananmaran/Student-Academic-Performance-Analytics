import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { StudentRecord, NumericalVariableKey } from '../types';
import { calculateCorrelationMatrix, NUMERICAL_VARIABLES } from '../utils/statistics';

interface CorrelationPageProps {
  students: StudentRecord[];
}

export const CorrelationPage: React.FC<CorrelationPageProps> = ({ students }) => {
  const [selectedVariable, setSelectedVariable] = useState<string>('Final Marks');

  const { variables, matrix, flatCorrelations } = useMemo(() => {
    return calculateCorrelationMatrix(students);
  }, [students]);

  // Color helper based on correlation r
  const getCellColor = (r: number) => {
    if (r === 1) return 'bg-blue-600 text-white font-bold';
    if (r >= 0.5) return 'bg-blue-500/80 text-white font-semibold';
    if (r >= 0.25) return 'bg-blue-400/60 text-slate-900 dark:text-white font-medium';
    if (r >= 0.1) return 'bg-blue-300/40 text-slate-800 dark:text-slate-200';
    if (r > -0.1) return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
    if (r > -0.25) return 'bg-rose-200/40 text-rose-900 dark:text-rose-200';
    if (r > -0.5) return 'bg-rose-400/60 text-white font-medium';
    return 'bg-rose-600 text-white font-bold';
  };

  // Find correlations for the currently selected variable
  const selectedCorrelations = useMemo(() => {
    return flatCorrelations
      .filter((c) => c.var1 === selectedVariable || c.var2 === selectedVariable)
      .map((c) => ({
        partner: c.var1 === selectedVariable ? c.var2 : c.var1,
        correlation: c.correlation,
        strength: c.strength,
      }))
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [selectedVariable, flatCorrelations]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-blue-600" /> Pearson Correlation Matrix Heatmap
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Pairwise Pearson correlation coefficients (r) evaluated across all 8 continuous numerical variables.
        </p>
      </div>

      {/* Main Heatmap and Side Drilldown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap Grid Table (2 Columns Span) */}
        <div className="xl:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              8×8 Correlation Heatmap Matrix
            </h3>
            <span className="text-xs text-slate-400">Click any row/header to drill down</span>
          </div>

          <div className="min-w-[620px]">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-slate-400 font-semibold uppercase text-[10px] w-28">
                    Variable
                  </th>
                  {variables.map((v) => (
                    <th
                      key={v.key}
                      onClick={() => setSelectedVariable(v.label)}
                      className={`p-2 cursor-pointer transition-colors text-[11px] font-bold ${
                        selectedVariable === v.label
                          ? 'text-blue-600 dark:text-blue-400 underline'
                          : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
                      }`}
                    >
                      {v.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {variables.map((v1, i) => (
                  <tr key={v1.key} className="border-t border-slate-100 dark:border-slate-800/80">
                    <td
                      onClick={() => setSelectedVariable(v1.label)}
                      className={`p-2 text-left font-bold cursor-pointer transition-colors text-xs ${
                        selectedVariable === v1.label
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:text-blue-500'
                      }`}
                    >
                      {v1.label}
                    </td>
                    {variables.map((v2, j) => {
                      const val = matrix[i][j];
                      const isSelf = i === j;
                      return (
                        <td
                          key={v2.key}
                          onClick={() => {
                            if (!isSelf) setSelectedVariable(v1.label);
                          }}
                          className={`p-2.5 transition-all cursor-pointer ${getCellColor(
                            val
                          )} ${selectedVariable === v1.label || selectedVariable === v2.label ? 'ring-1 ring-blue-400 dark:ring-blue-500' : ''}`}
                          title={`${v1.label} vs ${v2.label}: r = ${val}`}
                        >
                          {val === 1 ? '1.00' : val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Scale Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-600"></span> -1.0 Negative
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700"></span> 0.0 No Correlation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-600"></span> +1.0 Positive
            </span>
          </div>
        </div>

        {/* Selected Variable Correlate Drilldown Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Strongest Correlates for:
              </h3>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950">
                {selectedVariable}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ranked descending by absolute correlation magnitude |r|
            </p>

            <div className="space-y-2.5">
              {selectedCorrelations.map((item, idx) => (
                <div
                  key={item.partner}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-[10px] text-slate-700 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.partner}</p>
                      <p className="text-[10px] text-slate-400">{item.strength}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-extrabold ${
                        item.correlation >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'
                      }`}
                    >
                      {item.correlation >= 0 ? '+' : ''}
                      {item.correlation.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Select other variables from the matrix header or table rows to pivot
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Strongest Global Pairwise Correlations */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Overall Top Pairwise Correlations in Dataset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {flatCorrelations.slice(0, 4).map((c, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {c.var1} ↔ {c.var2}
                </span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {c.correlation >= 0 ? '+' : ''}{c.correlation.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{c.strength}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
