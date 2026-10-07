import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Award,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { StudentRecord } from '../types';
import {
  generateAlgorithmicInsights,
  identifyAtRiskStudents,
  getTopPerformers,
} from '../utils/statistics';

interface InsightsPageProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
  students,
  onSelectStudent,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'performance' | 'attention' | 'finding' | 'recommendation'>('all');

  const allInsights = generateAlgorithmicInsights(students);
  const filteredInsights = activeCategory === 'all'
    ? allInsights
    : allInsights.filter((ins) => ins.category === activeCategory);

  const atRiskStudents = identifyAtRiskStudents(students);
  const topPerformers = getTopPerformers(students, 10);

  const categoryIcons = {
    performance: TrendingUp,
    attention: AlertTriangle,
    finding: Sparkles,
    recommendation: Lightbulb,
  };

  const categoryStyles = {
    performance: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-900',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      tag: '📈 Performance Insight',
    },
    attention: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900',
      text: 'text-rose-700 dark:text-rose-300',
      icon: 'text-rose-600 dark:text-rose-400',
      tag: '⚠️ Attention Required',
    },
    finding: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-900',
      text: 'text-indigo-700 dark:text-indigo-300',
      icon: 'text-indigo-600 dark:text-indigo-400',
      tag: '🎯 Key Finding',
    },
    recommendation: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      tag: '💡 Recommendation',
    },
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" /> Algorithmic Insights & Academic Health
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dynamically synthesized educational insights, automated intervention detection, and top student rankings.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All Automated Insights' },
          { id: 'performance', label: 'Performance' },
          { id: 'attention', label: 'Attention Required' },
          { id: 'finding', label: 'Key Findings' },
          { id: 'recommendation', label: 'Recommendations' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveCategory(btn.id as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeCategory === btn.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => {
          const style = categoryStyles[insight.category];
          const Icon = categoryIcons[insight.category];

          return (
            <div
              key={insight.id}
              className={`p-5 rounded-2xl border ${style.bg} ${style.border} shadow-sm space-y-3 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${style.text}`}>{style.tag}</span>
                {insight.metricValue && (
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                    {insight.metricLabel}: {insight.metricValue}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${style.icon}`} />
                  {insight.title}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* At-Risk Student Identification Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              At-Risk Student Diagnostic Roster ({atRiskStudents.length} Students Flagged)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students identified based on transparent rules: Final Marks &lt; 50 OR Attendance &lt; 75% OR Previous GPA &lt; 5.50
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Requires Academic Mentoring
          </span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Student ID</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">GPA</th>
                <th className="py-2.5 px-3">Final Marks</th>
                <th className="py-2.5 px-3">Risk Severity</th>
                <th className="py-2.5 px-3">Diagnostic Reasons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {atRiskStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-emerald-600">
                    No students currently meet at-risk criteria in the selected cohort.
                  </td>
                </tr>
              ) : (
                atRiskStudents.map(({ student: st, riskReasons, riskSeverity }) => (
                  <tr
                    key={st.Student_ID}
                    onClick={() => onSelectStudent(st)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {st.Student_ID}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {st.Department}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={st.Attendance_Percentage < 75 ? 'text-rose-600 font-bold' : ''}>
                        {st.Attendance_Percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={st.Previous_Semester_GPA < 5.5 ? 'text-amber-600 font-bold' : ''}>
                        {st.Previous_Semester_GPA}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={st.Final_Marks < 50 ? 'text-rose-600 font-extrabold' : ''}>
                        {st.Final_Marks}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          riskSeverity === 'High'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : riskSeverity === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {riskSeverity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      <div className="flex flex-wrap gap-1">
                        {riskReasons.map((r, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
