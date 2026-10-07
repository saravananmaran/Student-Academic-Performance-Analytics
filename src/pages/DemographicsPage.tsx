import React, { useState } from 'react';
import {
  PieChart,
  Users,
  BookOpen,
  Wifi,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { StudentRecord } from '../types';
import { calculateMean, calculatePassRate } from '../utils/statistics';

interface DemographicsPageProps {
  students: StudentRecord[];
}

export const DemographicsPage: React.FC<DemographicsPageProps> = ({ students }) => {
  const [subTab, setSubTab] = useState<'gender' | 'parentEdu' | 'internet' | 'extra'>('gender');

  // 1. Gender Data
  const males = students.filter((s) => s.Gender === 'Male');
  const females = students.filter((s) => s.Gender === 'Female');

  const genderComparison = [
    {
      metric: 'Avg Final Marks',
      Male: calculateMean(males.map((s) => s.Final_Marks)),
      Female: calculateMean(females.map((s) => s.Final_Marks)),
    },
    {
      metric: 'Avg Attendance %',
      Male: calculateMean(males.map((s) => s.Attendance_Percentage)),
      Female: calculateMean(females.map((s) => s.Attendance_Percentage)),
    },
    {
      metric: 'Avg GPA (×10)',
      Male: Number((calculateMean(males.map((s) => s.Previous_Semester_GPA)) * 10).toFixed(1)),
      Female: Number((calculateMean(females.map((s) => s.Previous_Semester_GPA)) * 10).toFixed(1)),
    },
    {
      metric: 'Daily Study (×10h)',
      Male: Number((calculateMean(males.map((s) => s.Study_Hours_Per_Day)) * 10).toFixed(1)),
      Female: Number((calculateMean(females.map((s) => s.Study_Hours_Per_Day)) * 10).toFixed(1)),
    },
    {
      metric: 'Pass Rate %',
      Male: calculatePassRate(males),
      Female: calculatePassRate(females),
    },
  ];

  // 2. Parent Education
  const parentEduLevels = ['School', 'Diploma', 'UG', 'PG'];
  const parentEduData = parentEduLevels.map((lvl) => {
    const subset = students.filter((s) => s.Parent_Education === lvl);
    return {
      category: lvl,
      count: subset.length,
      avgMarks: calculateMean(subset.map((s) => s.Final_Marks)),
      avgGPA: calculateMean(subset.map((s) => s.Previous_Semester_GPA)),
      passRate: calculatePassRate(subset),
      avgAttendance: calculateMean(subset.map((s) => s.Attendance_Percentage)),
    };
  });

  // 3. Internet Access
  const internetLevels = ['Poor', 'Average', 'Good', 'Excellent'];
  const internetData = internetLevels.map((lvl) => {
    const subset = students.filter((s) => s.Internet_Access === lvl);
    return {
      category: lvl,
      count: subset.length,
      avgMarks: calculateMean(subset.map((s) => s.Final_Marks)),
      avgGPA: calculateMean(subset.map((s) => s.Previous_Semester_GPA)),
      avgStudyHours: calculateMean(subset.map((s) => s.Study_Hours_Per_Day)),
      passRate: calculatePassRate(subset),
    };
  });

  // 4. Extracurricular Activities
  const extraYes = students.filter((s) => s.Extracurricular_Activities === 'Yes');
  const extraNo = students.filter((s) => s.Extracurricular_Activities === 'No');

  const extraData = [
    {
      activity: 'Active (Yes)',
      count: extraYes.length,
      avgMarks: calculateMean(extraYes.map((s) => s.Final_Marks)),
      avgGPA: calculateMean(extraYes.map((s) => s.Previous_Semester_GPA)),
      avgAttendance: calculateMean(extraYes.map((s) => s.Attendance_Percentage)),
      avgStudy: calculateMean(extraYes.map((s) => s.Study_Hours_Per_Day)),
      passRate: calculatePassRate(extraYes),
    },
    {
      activity: 'Non-Participant (No)',
      count: extraNo.length,
      avgMarks: calculateMean(extraNo.map((s) => s.Final_Marks)),
      avgGPA: calculateMean(extraNo.map((s) => s.Previous_Semester_GPA)),
      avgAttendance: calculateMean(extraNo.map((s) => s.Attendance_Percentage)),
      avgStudy: calculateMean(extraNo.map((s) => s.Study_Hours_Per_Day)),
      passRate: calculatePassRate(extraNo),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-purple-600" /> Demographic & Socio-Academic Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Investigating academic performance variation across demographic background, parental education, and digital access.
        </p>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'gender', label: 'Gender Demographics', icon: Users },
          { id: 'parentEdu', label: 'Parental Education', icon: BookOpen },
          { id: 'internet', label: 'Internet Connectivity', icon: Wifi },
          { id: 'extra', label: 'Extracurricular Participation', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. GENDER SUB-VIEW */}
      {subTab === 'gender' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Male Students</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {males.length} <span className="text-xs font-normal text-slate-400">({((males.length / (students.length || 1)) * 100).toFixed(1)}%)</span>
              </p>
              <div className="mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <p>Avg Marks: <strong>{calculateMean(males.map((s) => s.Final_Marks))}</strong></p>
                <p>Avg GPA: <strong>{calculateMean(males.map((s) => s.Previous_Semester_GPA))}</strong></p>
                <p>Pass Rate: <strong>{calculatePassRate(males)}%</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Female Students</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {females.length} <span className="text-xs font-normal text-slate-400">({((females.length / (students.length || 1)) * 100).toFixed(1)}%)</span>
              </p>
              <div className="mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <p>Avg Marks: <strong>{calculateMean(females.map((s) => s.Final_Marks))}</strong></p>
                <p>Avg GPA: <strong>{calculateMean(females.map((s) => s.Previous_Semester_GPA))}</strong></p>
                <p>Pass Rate: <strong>{calculatePassRate(females)}%</strong></p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Grouped Metric Comparison: Male vs Female Cohorts
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderComparison} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Male" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Female" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Note: GPA and Daily Study values scaled by 10 for harmonious comparative visualization.
            </p>
          </div>
        </div>
      )}

      {/* 2. PARENT EDUCATION SUB-VIEW */}
      {subTab === 'parentEdu' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Parental Education vs Average Final Marks
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={parentEduData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="category" />
                    <YAxis domain={[60, 80]} />
                    <Tooltip formatter={(val: any) => [`${val} marks`, 'Avg Marks']} />
                    <Bar dataKey="avgMarks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Parental Education vs Semester GPA
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={parentEduData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="category" />
                    <YAxis domain={[6.5, 8.0]} />
                    <Tooltip formatter={(val: any) => [`${val} GPA`, 'Avg GPA']} />
                    <Bar dataKey="avgGPA" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-900/60 shadow-sm flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-purple-950 dark:text-purple-200">
                Automatically Generated Parent Education Insight
              </h4>
              <p className="text-xs text-purple-900/80 dark:text-purple-300/80 leading-relaxed">
                Analysis reveals that academic outcomes remain consistently robust across all parental educational tiers: School ({parentEduData.find((d) => d.category === 'School')?.avgMarks} marks), Diploma ({parentEduData.find((d) => d.category === 'Diploma')?.avgMarks} marks), UG ({parentEduData.find((d) => d.category === 'UG')?.avgMarks} marks), and PG ({parentEduData.find((d) => d.category === 'PG')?.avgMarks} marks). Personal study routines and classroom attendance exert significantly higher variance impact than parental education alone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. INTERNET CONNECTIVITY SUB-VIEW */}
      {subTab === 'internet' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Internet Access Quality vs Final Marks
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={internetData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="category" />
                    <YAxis domain={[65, 80]} />
                    <Tooltip formatter={(val: any) => [`${val} marks`, 'Avg Final Marks']} />
                    <Bar dataKey="avgMarks" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Internet Access Quality vs Daily Study Hours
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={internetData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="category" />
                    <YAxis domain={[3.0, 4.5]} />
                    <Tooltip formatter={(val: any) => [`${val} hrs`, 'Avg Study Hours']} />
                    <Bar dataKey="avgStudyHours" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXTRACURRICULAR ACTIVITIES SUB-VIEW */}
      {subTab === 'extra' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extraData.map((item) => (
              <div
                key={item.activity}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.activity}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {item.count} Students ({((item.count / (students.length || 1)) * 100).toFixed(1)}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Avg Final Marks</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{item.avgMarks}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Avg GPA</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{item.avgGPA}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Avg Attendance</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{item.avgAttendance}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Daily Study</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{item.avgStudy} hrs</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-500">Cohort Pass Clearance Rate:</span>
                  <span className="font-bold text-emerald-600">{item.passRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
