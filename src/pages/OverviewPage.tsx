import React from 'react';
import {
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  ChevronRight,
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
} from 'recharts';
import { StudentRecord, ActiveTab } from '../types';
import { KpiCard } from '../components/KpiCard';
import {
  calculateMean,
  calculatePassRate,
  groupByDepartment,
  groupByGrade,
} from '../utils/statistics';

interface OverviewPageProps {
  students: StudentRecord[];
  allStudents: StudentRecord[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectStudent: (student: StudentRecord) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  students,
  allStudents,
  onNavigate,
  onSelectStudent,
}) => {
  const marks = students.map((s) => s.Final_Marks);
  const gpas = students.map((s) => s.Previous_Semester_GPA);
  const attendances = students.map((s) => s.Attendance_Percentage);
  const studyHours = students.map((s) => s.Study_Hours_Per_Day);

  const avgMarks = calculateMean(marks);
  const avgGPA = calculateMean(gpas);
  const avgAttendance = calculateMean(attendances);
  const avgStudyHours = calculateMean(studyHours);
  const passRate = calculatePassRate(students);
  const highestMark = marks.length ? Math.max(...marks) : 0;
  const lowestMark = marks.length ? Math.min(...marks) : 0;

  // Grade Distribution
  const gradeData = groupByGrade(students);

  // Final Marks Distribution (Histogram Bins)
  const markBins = [
    { range: '40 - 49', min: 40, max: 49.99, count: 0 },
    { range: '50 - 59', min: 50, max: 59.99, count: 0 },
    { range: '60 - 69', min: 60, max: 69.99, count: 0 },
    { range: '70 - 79', min: 70, max: 79.99, count: 0 },
    { range: '80 - 89', min: 80, max: 89.99, count: 0 },
    { range: '90 - 100', min: 90, max: 100.01, count: 0 },
  ];
  marks.forEach((m) => {
    const bin = markBins.find((b) => m >= b.min && m <= b.max);
    if (bin) bin.count++;
  });

  // GPA Distribution Bins
  const gpaBins = [
    { range: '4.0 - 5.4', min: 4.0, max: 5.49, count: 0 },
    { range: '5.5 - 6.4', min: 5.5, max: 6.49, count: 0 },
    { range: '6.5 - 7.4', min: 6.5, max: 7.49, count: 0 },
    { range: '7.5 - 8.4', min: 7.5, max: 8.49, count: 0 },
    { range: '8.5 - 10.0', min: 8.5, max: 10.0, count: 0 },
  ];
  gpas.forEach((g) => {
    const bin = gpaBins.find((b) => g >= b.min && g <= b.max);
    if (bin) bin.count++;
  });

  // Pass vs Fail Donut
  const passCount = students.filter((s) => s.Pass_Fail === 'Pass').length;
  const failCount = students.filter((s) => s.Pass_Fail === 'Fail').length;
  const passFailData = [
    { name: 'Pass', value: passCount, color: '#10b981' },
    { name: 'Fail', value: failCount, color: '#ef4444' },
  ];

  const deptStats = groupByDepartment(students);
  const topStudents = [...students].sort((a, b) => b.Final_Marks - a.Final_Marks).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Exploratory analysis of academic performance across {students.length} students.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Cohort 2026 • 500 Records
          </span>
        </div>
      </div>

      {/* 8 Dynamic KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Total Students"
          value={students.length}
          subtitle={`of ${allStudents.length} enrolled`}
          icon={Users}
          color="blue"
          badge={{ text: 'Active Cohort', variant: 'neutral' }}
          onClick={() => onNavigate('students')}
        />
        <KpiCard
          title="Avg Final Marks"
          value={`${avgMarks}`}
          subtitle="out of 100 maximum"
          icon={Award}
          color="indigo"
          badge={{ text: avgMarks >= 70 ? 'Satisfactory' : 'Needs Focus', variant: avgMarks >= 70 ? 'positive' : 'warning' }}
          onClick={() => onNavigate('performance')}
        />
        <KpiCard
          title="Avg Semester GPA"
          value={`${avgGPA}`}
          subtitle="scale of 10.0"
          icon={GraduationCap}
          color="purple"
          badge={{ text: 'CGPA Scale', variant: 'neutral' }}
          onClick={() => onNavigate('performance')}
        />
        <KpiCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          subtitle="institution metric"
          icon={CalendarCheck}
          color="cyan"
          badge={{ text: avgAttendance >= 75 ? 'Optimal' : 'Shortage', variant: avgAttendance >= 75 ? 'positive' : 'warning' }}
          onClick={() => onNavigate('attendance')}
        />
        <KpiCard
          title="Pass Percentage"
          value={`${passRate}%`}
          subtitle={`${passCount} Passed, ${failCount} Failed`}
          icon={CheckCircle}
          color="emerald"
          badge={{ text: passRate >= 95 ? 'Exceptional' : 'Standard', variant: 'positive' }}
          onClick={() => onNavigate('performance')}
        />
        <KpiCard
          title="Avg Study Hours"
          value={`${avgStudyHours}h`}
          subtitle="hours spent per day"
          icon={Clock}
          color="amber"
          badge={{ text: 'Daily Routine', variant: 'neutral' }}
          onClick={() => onNavigate('study_lifestyle')}
        />
        <KpiCard
          title="Highest Mark"
          value={`${highestMark}`}
          subtitle="top scorer cohort"
          icon={TrendingUp}
          color="emerald"
          badge={{ text: 'Top 1 Rank', variant: 'positive' }}
        />
        <KpiCard
          title="Lowest Mark"
          value={`${lowestMark}`}
          subtitle="minimum score"
          icon={TrendingDown}
          color="rose"
          badge={{ text: lowestMark < 50 ? 'Requires Support' : 'Passed', variant: lowestMark < 50 ? 'negative' : 'neutral' }}
        />
      </div>

      {/* Chart Grid: 4 Core Overview Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Grade Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Grade Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of students achieving each letter grade (A+ through F)
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Bar Chart
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
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

        {/* Chart 2: Final Marks Distribution (Histogram) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Final Marks Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Histogram frequency across 10-point mark interval intervals
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Histogram
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: any) => [`${val} students`, 'Frequency']} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Pass vs Fail Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pass vs Fail Ratio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proportion of students successfully passing examination requirements
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Donut Chart
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
                  paddingAngle={4}
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

        {/* Chart 4: GPA Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Previous Semester GPA Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spread of previous semester cumulative grade point averages
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Distribution
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: any) => [`${val} students`, 'Count']} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Summary & Top Performers Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Quick Ranking */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Department Academic Standings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average marks, GPA, and pass rate across all engineering disciplines
              </p>
            </div>
            <button
              onClick={() => onNavigate('department')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-2">Department</th>
                  <th className="pb-2">Students</th>
                  <th className="pb-2">Avg Marks</th>
                  <th className="pb-2">Avg GPA</th>
                  <th className="pb-2">Avg Attendance</th>
                  <th className="pb-2">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {deptStats.map((d, index) => (
                  <tr key={d.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      {d.department}
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{d.count}</td>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{d.avgMarks}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{d.avgGPA}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{d.avgAttendance}%</td>
                    <td className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{d.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Performers Widget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Top Performers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest achieving students
                </p>
              </div>
              <button
                onClick={() => onNavigate('insights')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Leaderboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topStudents.map((st, i) => (
                <div
                  key={st.Student_ID}
                  onClick={() => onSelectStudent(st)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        i === 0
                          ? 'bg-amber-400 text-amber-950 shadow-sm shadow-amber-500/20'
                          : i === 1
                          ? 'bg-slate-300 text-slate-800'
                          : i === 2
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {st.Student_ID}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {st.Department} • {st.Attendance_Percentage}% Att.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      {st.Final_Marks}
                    </span>
                    <span className="block text-[10px] font-semibold text-emerald-600">
                      Grade {st.Grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Click any student row to view full academic profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
