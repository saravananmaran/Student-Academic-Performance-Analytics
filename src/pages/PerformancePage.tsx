import React from 'react';
import {
  GraduationCap,
  Award,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { StudentRecord } from '../types';
import {
  groupByGrade,
  calculateMean,
  calculatePassRate,
  identifyAtRiskStudents,
  getTopPerformers,
} from '../utils/statistics';

interface PerformancePageProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  students,
  onSelectStudent,
}) => {
  const gradeData = groupByGrade(students);
  const passRate = calculatePassRate(students);
  const avgMarks = calculateMean(students.map((s) => s.Final_Marks));
  const avgInternal = calculateMean(students.map((s) => s.Internal_Marks));
  const avgAssignment = calculateMean(students.map((s) => s.Assignment_Score));
  const avgGPA = calculateMean(students.map((s) => s.Previous_Semester_GPA));

  // Marks Histogram Bins
  const markBins = [
    { range: '40-49', count: 0 },
    { range: '50-59', count: 0 },
    { range: '60-69', count: 0 },
    { range: '70-79', count: 0 },
    { range: '80-89', count: 0 },
    { range: '90-100', count: 0 },
  ];
  students.forEach((s) => {
    const m = s.Final_Marks;
    if (m < 50) markBins[0].count++;
    else if (m < 60) markBins[1].count++;
    else if (m < 70) markBins[2].count++;
    else if (m < 80) markBins[3].count++;
    else if (m < 90) markBins[4].count++;
    else markBins[5].count++;
  });

  // GPA Bins
  const gpaBins = [
    { range: '4.0-5.4', count: 0 },
    { range: '5.5-6.4', count: 0 },
    { range: '6.5-7.4', count: 0 },
    { range: '7.5-8.4', count: 0 },
    { range: '8.5-10.0', count: 0 },
  ];
  students.forEach((s) => {
    const g = s.Previous_Semester_GPA;
    if (g < 5.5) gpaBins[0].count++;
    else if (g < 6.5) gpaBins[1].count++;
    else if (g < 7.5) gpaBins[2].count++;
    else if (g < 8.5) gpaBins[3].count++;
    else gpaBins[4].count++;
  });

  const passCount = students.filter((s) => s.Pass_Fail === 'Pass').length;
  const failCount = students.filter((s) => s.Pass_Fail === 'Fail').length;
  const passFailData = [
    { name: 'Pass', value: passCount, color: '#10b981' },
    { name: 'Fail', value: failCount, color: '#ef4444' },
  ];

  const topPerformers = getTopPerformers(students, 10);
  const atRiskStudents = identifyAtRiskStudents(students);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600" /> Academic Performance Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          In-depth evaluation of grades, final marks distributions, pass rates, and performance tiers.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Mean Final Marks
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {avgMarks}
          </span>
          <span className="text-xs text-slate-400 block mt-1">out of 100 marks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pass Percentage
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {passRate}%
          </span>
          <span className="text-xs text-slate-400 block mt-1">
            {passCount} passed / {failCount} failed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Avg Internal Assessment
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {avgInternal}
          </span>
          <span className="text-xs text-slate-400 block mt-1">continuous evaluation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Avg Assignment Score
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
            {avgAssignment}
          </span>
          <span className="text-xs text-slate-400 block mt-1">homework & lab tasks</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Grade Distribution (A+ to F)
              </h3>
              <p className="text-xs text-slate-500">Student count per awarded academic tier</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Bar Chart
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} students (${item.payload.percentage}%)`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Final Marks Histogram */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Final Marks Frequency Distribution
              </h3>
              <p className="text-xs text-slate-500">Bin intervals across 10-point spans</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Histogram
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(val: any) => [`${val} students`, 'Frequency']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass vs Fail Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pass vs Fail Proportion
              </h3>
              <p className="text-xs text-slate-500">Overall academic clearance percentage</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              Donut
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} students`, 'Count']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPA Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                GPA Bracket Spread
              </h3>
              <p className="text-xs text-slate-500">Previous cumulative grade point groupings</p>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
              Bar Chart
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(val: any) => [`${val} students`, 'Count']} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Performers Leaderboard */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Academic Leaderboard — Top 10 Performers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students ranked highest based on summative Final Marks and GPA
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Cohort Honors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2">Rank</th>
                <th className="pb-2">Student ID</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Final Marks</th>
                <th className="pb-2">GPA</th>
                <th className="pb-2">Attendance</th>
                <th className="pb-2">Study Hrs</th>
                <th className="pb-2">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPerformers.map((st, idx) => (
                <tr
                  key={st.Student_ID}
                  onClick={() => onSelectStudent(st)}
                  className="hover:bg-blue-50/60 dark:hover:bg-blue-950/30 cursor-pointer transition-colors"
                >
                  <td className="py-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold inline-flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {st.Student_ID}
                  </td>
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {st.Department}
                  </td>
                  <td className="py-3 font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    {st.Final_Marks}
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {st.Previous_Semester_GPA}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {st.Attendance_Percentage}%
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {st.Study_Hours_Per_Day}h
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {st.Grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
