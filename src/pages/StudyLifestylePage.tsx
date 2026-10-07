import React, { useMemo } from 'react';
import {
  Coffee,
  Moon,
  Clock,
  Sparkles,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { StudentRecord } from '../types';
import {
  calculateMean,
  calculateLinearRegression,
  calculateCorrelation,
} from '../utils/statistics';

interface StudyLifestylePageProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const StudyLifestylePage: React.FC<StudyLifestylePageProps> = ({
  students,
  onSelectStudent,
}) => {
  const studyHours = students.map((s) => s.Study_Hours_Per_Day);
  const sleepHours = students.map((s) => s.Sleep_Hours_Per_Day);
  const marks = students.map((s) => s.Final_Marks);
  const gpas = students.map((s) => s.Previous_Semester_GPA);

  const avgStudy = calculateMean(studyHours);
  const avgSleep = calculateMean(sleepHours);

  // Regressions
  const studyVsMarksReg = useMemo(
    () => calculateLinearRegression(studyHours, marks),
    [studyHours, marks]
  );
  const sleepVsMarksReg = useMemo(
    () => calculateLinearRegression(sleepHours, marks),
    [sleepHours, marks]
  );
  const studyVsGpaReg = useMemo(
    () => calculateLinearRegression(studyHours, gpas),
    [studyHours, gpas]
  );

  // Sleep hours distribution
  const sleepBins = [
    { range: '4.0 - 5.0 hrs', count: 0 },
    { range: '5.1 - 6.0 hrs', count: 0 },
    { range: '6.1 - 7.0 hrs', count: 0 },
    { range: '7.1 - 8.0 hrs', count: 0 },
    { range: '8.1 - 9.0 hrs', count: 0 },
    { range: '> 9.0 hrs', count: 0 },
  ];
  sleepHours.forEach((h) => {
    if (h <= 5.0) sleepBins[0].count++;
    else if (h <= 6.0) sleepBins[1].count++;
    else if (h <= 7.0) sleepBins[2].count++;
    else if (h <= 8.0) sleepBins[3].count++;
    else if (h <= 9.0) sleepBins[4].count++;
    else sleepBins[5].count++;
  });

  // Dynamic comparison insight
  const highStudy = students.filter((s) => s.Study_Hours_Per_Day >= 5);
  const lowStudy = students.filter((s) => s.Study_Hours_Per_Day < 2.5);
  const avgMarksHighStudy = calculateMean(highStudy.map((s) => s.Final_Marks));
  const avgMarksLowStudy = calculateMean(lowStudy.map((s) => s.Final_Marks));
  const studyDelta = Number((avgMarksHighStudy - avgMarksLowStudy).toFixed(1));

  // Scatter points
  const studyMarksData = students.map((s) => ({
    x: s.Study_Hours_Per_Day,
    y: s.Final_Marks,
    student: s,
    id: s.Student_ID,
  }));

  const sleepMarksData = students.map((s) => ({
    x: s.Sleep_Hours_Per_Day,
    y: s.Final_Marks,
    student: s,
    id: s.Student_ID,
  }));

  const studyGpaData = students.map((s) => ({
    x: s.Study_Hours_Per_Day,
    y: s.Previous_Semester_GPA,
    student: s,
    id: s.Student_ID,
  }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Coffee className="w-6 h-6 text-indigo-600" /> Study Habits & Lifestyle Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Evaluating the influence of daily study duration and sleep hygiene on academic outcomes.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Mean Study Hours
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-indigo-600" />
            {avgStudy} hrs/day
          </span>
          <span className="text-xs text-slate-400 block mt-1">daily self-study</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Mean Sleep Duration
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Moon className="w-5 h-5 text-purple-600" />
            {avgSleep} hrs/night
          </span>
          <span className="text-xs text-slate-400 block mt-1">nocturnal rest</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            High-Study Cohort (&ge;5h)
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {avgMarksHighStudy}
          </span>
          <span className="text-xs text-slate-400 block mt-1">avg final marks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Low-Study Cohort (&lt;2.5h)
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
            {avgMarksLowStudy}
          </span>
          <span className="text-xs text-slate-400 block mt-1">avg final marks</span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Hours vs Final Marks Scatter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Study Hours vs Final Marks
              </h3>
              <p className="text-xs text-slate-500">
                Pearson r = {studyVsMarksReg.correlation >= 0 ? '+' : ''}{studyVsMarksReg.correlation}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
              Scatter Plot
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" dataKey="x" name="Study Hours" unit="h" />
                <YAxis type="number" dataKey="y" name="Final Marks" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'Final Marks' ? `${val} marks` : `${val} hrs`,
                    name,
                  ]}
                />
                <Scatter
                  name="Students"
                  data={studyMarksData}
                  fill="#6366f1"
                  opacity={0.65}
                  onClick={(e: any) => e?.student && onSelectStudent(e.student)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Hours vs GPA Scatter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Study Hours vs Previous GPA
              </h3>
              <p className="text-xs text-slate-500">
                Pearson r = {studyVsGpaReg.correlation >= 0 ? '+' : ''}{studyVsGpaReg.correlation}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              Scatter Plot
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" dataKey="x" name="Study Hours" unit="h" />
                <YAxis type="number" dataKey="y" name="GPA" domain={[4, 10]} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'GPA' ? `${val} GPA` : `${val} hrs`,
                    name,
                  ]}
                />
                <Scatter
                  name="Students"
                  data={studyGpaData}
                  fill="#8b5cf6"
                  opacity={0.65}
                  onClick={(e: any) => e?.student && onSelectStudent(e.student)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Hours vs Final Marks Scatter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sleep Hours vs Final Marks
              </h3>
              <p className="text-xs text-slate-500">
                Pearson r = {sleepVsMarksReg.correlation >= 0 ? '+' : ''}{sleepVsMarksReg.correlation}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600">
              Scatter Plot
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" dataKey="x" name="Sleep Hours" unit="h" />
                <YAxis type="number" dataKey="y" name="Final Marks" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'Final Marks' ? `${val} marks` : `${val} hrs`,
                    name,
                  ]}
                />
                <Scatter
                  name="Students"
                  data={sleepMarksData}
                  fill="#ec4899"
                  opacity={0.65}
                  onClick={(e: any) => e?.student && onSelectStudent(e.student)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Hours Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sleep Hours Frequency Distribution
              </h3>
              <p className="text-xs text-slate-500">Nocturnal sleep range distribution across students</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
              Distribution
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(val: any) => [`${val} students`, 'Count']} />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Insight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-900/60 shadow-sm flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
            Dynamically Computed Lifestyle Insight
          </h4>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
            Students who study more hours per day tend to achieve higher final marks (correlation r = {studyVsMarksReg.correlation >= 0 ? '+' : ''}{studyVsMarksReg.correlation}). Students studying 5+ hours daily average <strong>{avgMarksHighStudy} marks</strong>, outperforming those studying under 2.5 hours ({avgMarksLowStudy} marks) by <strong>+{studyDelta} marks</strong>. Sleep duration averages <strong>{avgSleep} hours/day</strong>, exhibiting healthy concentration between 6 and 8 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
