import React from 'react';
import {
  X,
  User,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Award,
  AlertTriangle,
  Clock,
  Moon,
  Wifi,
  Users,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentProfileModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  deptAverageMarks: number;
  deptAverageAttendance: number;
  cohortAverageMarks: number;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  deptAverageMarks,
  deptAverageAttendance,
  cohortAverageMarks,
}) => {
  if (!student) return null;

  const isAtRisk =
    student.Final_Marks < 50 ||
    student.Attendance_Percentage < 75 ||
    student.Previous_Semester_GPA < 5.5;

  const isHighPerformer =
    student.Final_Marks >= 85 || student.Grade === 'A+' || student.Grade === 'A';

  const markDeltaDept = Number((student.Final_Marks - deptAverageMarks).toFixed(1));
  const markDeltaCohort = Number((student.Final_Marks - cohortAverageMarks).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-2xl shadow-inner">
                {student.Student_ID.replace('STU', '')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{student.Student_ID}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      student.Pass_Fail === 'Pass'
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                        : 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                    }`}
                  >
                    {student.Pass_Fail}
                  </span>
                </div>
                <p className="text-blue-100 text-sm flex items-center gap-2 mt-0.5">
                  <span>{student.Department} Engineering</span>
                  <span>•</span>
                  <span>{student.Gender}</span>
                  <span>•</span>
                  <span>Age {student.Age}</span>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-blue-200 block">Grade Awarded</span>
                <span className="text-3xl font-extrabold text-white">{student.Grade}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Alert Badge */}
          {isAtRisk && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Attention Required:</strong> Student triggers early intervention criteria:
                {student.Attendance_Percentage < 75 && ` Attendance below 75% (${student.Attendance_Percentage}%).`}
                {student.Final_Marks < 50 && ` Final marks below 50 (${student.Final_Marks}).`}
                {student.Previous_Semester_GPA < 5.5 && ` Previous GPA below 5.50 (${student.Previous_Semester_GPA}).`}
              </div>
            </div>
          )}

          {isHighPerformer && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="font-bold">Honors Achiever:</strong> Student ranks among the top echelon of academic scorers in {student.Department}.
              </div>
            </div>
          )}

          {/* Academic Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-500" /> Academic Evaluation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Final Marks</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.Final_Marks}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Attendance</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.Attendance_Percentage}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Prev. Sem GPA</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.Previous_Semester_GPA}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Internal Marks</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.Internal_Marks}
                </span>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison Bars */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Benchmark vs Cohort & Department</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold normal-case">
                {markDeltaDept >= 0 ? `+${markDeltaDept}` : markDeltaDept} pts vs Dept Avg
              </span>
            </h4>

            {/* Marks Comparison */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600 dark:text-slate-300">Final Marks: {student.Final_Marks}</span>
                <span className="text-slate-400">Dept Avg: {deptAverageMarks} | Cohort Avg: {cohortAverageMarks}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, student.Final_Marks)}%` }}
                />
              </div>
            </div>

            {/* Attendance Comparison */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600 dark:text-slate-300">Attendance: {student.Attendance_Percentage}%</span>
                <span className="text-slate-400">Dept Avg: {deptAverageAttendance}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    student.Attendance_Percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, student.Attendance_Percentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lifestyle & Demographic Background */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" /> Lifestyle & Background Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Study Hours / Day</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {student.Study_Hours_Per_Day} hrs
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Sleep Hours / Day</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" /> {student.Sleep_Hours_Per_Day} hrs
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Assignment Score</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> {student.Assignment_Score}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Parent Education</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {student.Parent_Education}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Internet Connectivity</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-blue-500" /> {student.Internet_Access}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Extracurricular</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {student.Extracurricular_Activities === 'Yes' ? 'Active Participant' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
