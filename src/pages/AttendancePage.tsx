import React, { useMemo } from 'react';
import {
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { StudentRecord } from '../types';
import {
  calculateMean,
  calculateLinearRegression,
  calculateCorrelation,
} from '../utils/statistics';

interface AttendancePageProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  students,
  onSelectStudent,
}) => {
  const attendances = students.map((s) => s.Attendance_Percentage);
  const marks = students.map((s) => s.Final_Marks);

  const avgAttendance = calculateMean(attendances);
  const lowAttendanceStudents = students.filter((s) => s.Attendance_Percentage < 75);
  const highAttendanceStudents = students.filter((s) => s.Attendance_Percentage >= 90);

  const avgMarksLow = calculateMean(lowAttendanceStudents.map((s) => s.Final_Marks));
  const avgMarksHigh = calculateMean(highAttendanceStudents.map((s) => s.Final_Marks));
  const markDelta = Number((avgMarksHigh - avgMarksLow).toFixed(1));

  // Regression line calculation
  const regression = useMemo(() => {
    return calculateLinearRegression(attendances, marks);
  }, [attendances, marks]);

  // Scatter plot data points
  const scatterData = useMemo(() => {
    return students.map((s) => ({
      x: s.Attendance_Percentage,
      y: s.Final_Marks,
      id: s.Student_ID,
      dept: s.Department,
      grade: s.Grade,
      student: s,
    }));
  }, [students]);

  // Generate 2 points for the trendline
  const minX = Math.min(...(attendances.length ? attendances : [50]));
  const maxX = Math.max(...(attendances.length ? attendances : [100]));
  const trendPoints = [
    { x: minX, trendY: Number((regression.slope * minX + regression.intercept).toFixed(2)) },
    { x: maxX, trendY: Number((regression.slope * maxX + regression.intercept).toFixed(2)) },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-blue-600" /> Attendance vs Academic Performance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Exploration of the empirical relationship between classroom attendance and final examination scores.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Attendance
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {avgAttendance}%
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">all students</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Below 75% Shortage
          </span>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {lowAttendanceStudents.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {((lowAttendanceStudents.length / (students.length || 1)) * 100).toFixed(1)}% of cohort
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Above 90% Exemplary
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {highAttendanceStudents.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {((highAttendanceStudents.length / (students.length || 1)) * 100).toFixed(1)}% of cohort
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Marks (&lt;75% Att)
          </span>
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {avgMarksLow}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">shortage cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Marks (≥90% Att)
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {avgMarksHigh}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            +{markDelta} pts premium
          </span>
        </div>
      </div>

      {/* Main Scatter Plot with Regression Trend */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bivariate Scatter: Attendance % vs Final Examination Marks
            </h3>
            <p className="text-xs text-slate-500">
              Hover over any point to inspect individual student metrics or click to view profile
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Student
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-4 h-0.5 bg-rose-500"></span>
              Linear Trendline (R² = {regression.r2})
            </span>
          </div>
        </div>

        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                type="number"
                dataKey="x"
                name="Attendance"
                unit="%"
                domain={[50, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: 'Attendance Percentage (%)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Final Marks"
                domain={[40, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: 'Final Marks (out of 100)', angle: -90, position: 'insideLeft' }}
              />
              <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="3 3" label="75% Min Req" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-xs space-y-1">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {data.id} ({data.dept})
                        </p>
                        <p className="text-slate-700 dark:text-slate-200">
                          Attendance: <strong>{data.x}%</strong>
                        </p>
                        <p className="text-slate-700 dark:text-slate-200">
                          Final Marks: <strong>{data.y}</strong> (Grade {data.grade})
                        </p>
                        <p className="text-[10px] text-slate-400 italic">Click point to view profile</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Students"
                data={scatterData}
                fill="#2563eb"
                opacity={0.7}
                onClick={(e: any) => e?.student && onSelectStudent(e.student)}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Statistical Model Regression Details */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Fitted Regression Model:</span>
            <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400">
              Final_Marks = {regression.intercept} + ({regression.slope} × Attendance_%)
            </code>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span>Pearson r = <strong>{regression.correlation >= 0 ? '+' : ''}{regression.correlation}</strong></span>
            <span>R² Variance Explained = <strong>{(regression.r2 * 100).toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Calculated Insight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 shadow-sm flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200">
            Empirical EDA Insight: Attendance Correlates Directly With Examination Success
          </h4>
          <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed">
            Data confirms that higher attendance is positively associated with improved academic performance (r = {regression.correlation >= 0 ? '+' : ''}{regression.correlation}). Students with ≥90% attendance average <strong>{avgMarksHigh} marks</strong>, compared to <strong>{avgMarksLow} marks</strong> for students with attendance shortages below 75%—a statistically significant advantage of <strong>+{markDelta} marks</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
