import React, { useState, useMemo } from 'react';
import {
  Calculator,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Info,
  ChevronRight,
} from 'lucide-react';
import { StudentRecord, NumericalVariableKey, DescriptiveStats } from '../types';
import {
  NUMERICAL_VARIABLES,
  calculateStatistics,
} from '../utils/statistics';

interface StatisticsPageProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({
  students,
  onSelectStudent,
}) => {
  const [selectedVarKey, setSelectedVarKey] = useState<NumericalVariableKey>('Final_Marks');

  // Dynamically compute descriptive statistics for all 8 numerical variables
  const statsList: DescriptiveStats[] = useMemo(() => {
    return NUMERICAL_VARIABLES.map((v) => {
      const values = students.map((s) => s[v.key] as number);
      return calculateStatistics(v.key, v.label, values);
    });
  }, [students]);

  const selectedStats = statsList.find((s) => s.variable === selectedVarKey) || statsList[0];

  // Find outlier student objects for the selected variable
  const outlierStudents = useMemo(() => {
    return students.filter((s) => {
      const val = s[selectedVarKey] as number;
      return val < selectedStats.lowerBound || val > selectedStats.upperBound;
    });
  }, [students, selectedVarKey, selectedStats]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" /> Descriptive Statistics & Outlier Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Parametric and non-parametric exploratory measures with Tukey&apos;s Interquartile Range (IQR) anomaly detection.
        </p>
      </div>

      {/* Full Descriptive Statistics Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Descriptive Summary Statistics (All Numerical Variables)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across {students.length} active records in cohort
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
            N = {students.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Variable</th>
                <th className="py-3 px-3">Count</th>
                <th className="py-3 px-3">Mean</th>
                <th className="py-3 px-3">Median</th>
                <th className="py-3 px-3">Std Dev (&sigma;)</th>
                <th className="py-3 px-3">Min</th>
                <th className="py-3 px-3">Q1 (25%)</th>
                <th className="py-3 px-3">Q3 (75%)</th>
                <th className="py-3 px-3">Max</th>
                <th className="py-3 px-3">IQR</th>
                <th className="py-3 px-3">Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {statsList.map((st) => (
                <tr
                  key={st.variable}
                  onClick={() => setSelectedVarKey(st.variable as NumericalVariableKey)}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    selectedVarKey === st.variable ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedVarKey === st.variable ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    />
                    {st.label}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{st.count}</td>
                  <td className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400">{st.mean}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{st.median}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{st.stdDev}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{st.min}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{st.q1}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{st.q3}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{st.max}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{st.iqr}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        st.outliersCount > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {st.outliersCount} ({st.outlierPercentage}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outlier Analysis Deep Dive for Selected Variable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outlier Metric Cards */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tukey&apos;s IQR Outlier Thresholds
            </h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {selectedStats.label}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
              <span className="text-slate-500">Lower Bound (Q1 - 1.5×IQR):</span>
              <strong className="text-slate-900 dark:text-white">{selectedStats.lowerBound}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
              <span className="text-slate-500">First Quartile (Q1 - 25%):</span>
              <strong className="text-slate-900 dark:text-white">{selectedStats.q1}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
              <span className="text-slate-500">Median (50%):</span>
              <strong className="text-blue-600 font-bold">{selectedStats.median}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
              <span className="text-slate-500">Third Quartile (Q3 - 75%):</span>
              <strong className="text-slate-900 dark:text-white">{selectedStats.q3}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
              <span className="text-slate-500">Upper Bound (Q3 + 1.5×IQR):</span>
              <strong className="text-slate-900 dark:text-white">{selectedStats.upperBound}</strong>
            </div>
          </div>

          {/* Outlier summary count */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span className="font-semibold">Detected Anomalies:</span>
            <span className="font-extrabold text-sm">
              {selectedStats.outliersCount} records ({selectedStats.outlierPercentage}%)
            </span>
          </div>
        </div>

        {/* Visual Box-Plot Style Range Indicator */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Visual Five-Number Summary &amp; Distribution Spread
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Box plot span representation for <strong>{selectedStats.label}</strong> (Min: {selectedStats.min} to Max: {selectedStats.max})
            </p>

            {/* Box Plot Bar Diagram */}
            <div className="py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl relative">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Min: {selectedStats.min}</span>
                <span>Q1: {selectedStats.q1}</span>
                <span className="font-bold text-blue-600">Med: {selectedStats.median}</span>
                <span>Q3: {selectedStats.q3}</span>
                <span>Max: {selectedStats.max}</span>
              </div>

              {/* Progress Line */}
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-500/80 rounded-sm"
                  style={{
                    marginLeft: `${Math.max(0, ((selectedStats.q1 - selectedStats.min) / (selectedStats.max - selectedStats.min || 1)) * 100)}%`,
                    width: `${Math.max(2, ((selectedStats.q3 - selectedStats.q1) / (selectedStats.max - selectedStats.min || 1)) * 100)}%`,
                  }}
                  title={`Interquartile Box: Q1 (${selectedStats.q1}) to Q3 (${selectedStats.q3})`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 mt-3">
                <span>Lower Fence: {selectedStats.lowerBound}</span>
                <span>IQR Spread = {selectedStats.iqr}</span>
                <span>Upper Fence: {selectedStats.upperBound}</span>
              </div>
            </div>

            {/* Identified Outlier Students */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Flagged Outlier Records for {selectedStats.label}:
              </h4>
              {outlierStudents.length === 0 ? (
                <p className="text-xs text-emerald-600 font-medium">
                  ✓ No statistical outliers detected for this variable.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {outlierStudents.map((st) => (
                    <button
                      key={st.Student_ID}
                      onClick={() => onSelectStudent(st)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-all"
                    >
                      <span className="font-bold">{st.Student_ID}</span>
                      <span>({st[selectedVarKey]})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <strong>IQR Formula:</strong> Interquartile Range $IQR = Q_3 - Q_1$. Points beyond $[Q_1 - 1.5 \times IQR, Q_3 + 1.5 \times IQR]$ are flagged as atypical anomalies according to John Tukey&apos;s exploratory methodology.
          </div>
        </div>
      </div>
    </div>
  );
};
