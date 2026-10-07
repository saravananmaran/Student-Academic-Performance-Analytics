import React, { useState } from 'react';
import {
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { StudentRecord, DepartmentStat } from '../types';
import { groupByDepartment } from '../utils/statistics';

interface DepartmentPageProps {
  students: StudentRecord[];
}

export const DepartmentPage: React.FC<DepartmentPageProps> = ({ students }) => {
  const [sortField, setSortField] = useState<keyof DepartmentStat>('avgMarks');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const rawDeptStats = groupByDepartment(students);

  const sortedDeptStats = [...rawDeptStats].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (field: keyof DepartmentStat) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: keyof DepartmentStat) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  // Color palette for branches
  const deptColors: Record<string, string> = {
    CSE: '#2563eb',
    IT: '#0284c7',
    ECE: '#7c3aed',
    EEE: '#9333ea',
    MECH: '#ea580c',
    CIVIL: '#059669',
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> Department Comparison Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Comparative evaluation across CSE, IT, ECE, EEE, MECH, and CIVIL engineering branches.
        </p>
      </div>

      {/* 4 Comparative Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Marks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Average Final Marks by Department
              </h3>
              <p className="text-xs text-slate-500">Scale of 0 to 100 marks</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
              Avg Marks
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawDeptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="department" />
                <YAxis domain={[50, 90]} />
                <Tooltip formatter={(val: any) => [`${val} marks`, 'Avg Final Mark']} />
                <Bar dataKey="avgMarks" radius={[6, 6, 0, 0]}>
                  {rawDeptStats.map((entry) => (
                    <Cell key={entry.department} fill={deptColors[entry.department] || '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average GPA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Average Semester GPA by Department
              </h3>
              <p className="text-xs text-slate-500">Previous cumulative GPA</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              Avg GPA
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawDeptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="department" />
                <YAxis domain={[5.0, 9.0]} />
                <Tooltip formatter={(val: any) => [`${val} GPA`, 'Avg Previous GPA']} />
                <Bar dataKey="avgGPA" radius={[6, 6, 0, 0]}>
                  {rawDeptStats.map((entry) => (
                    <Cell key={entry.department} fill={deptColors[entry.department] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Attendance % by Department */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Attendance Percentage by Department
              </h3>
              <p className="text-xs text-slate-500">Average lecture attendance per department</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              Attendance %
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawDeptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="department" />
                <YAxis domain={[70, 95]} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Avg Attendance']} />
                <Bar dataKey="avgAttendance" radius={[6, 6, 0, 0]}>
                  {rawDeptStats.map((entry) => (
                    <Cell key={entry.department} fill={deptColors[entry.department] || '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pass Percentage by Department */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pass Percentage by Department
              </h3>
              <p className="text-xs text-slate-500">Clearance rate across branches</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600">
              Pass Rate %
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawDeptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="department" />
                <YAxis domain={[90, 100]} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Pass Rate']} />
                <Bar dataKey="passRate" radius={[6, 6, 0, 0]}>
                  {rawDeptStats.map((entry) => (
                    <Cell key={entry.department} fill={deptColors[entry.department] || '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sortable Department Performance Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Department Performance Comparative Table
            </h3>
            <p className="text-xs text-slate-500">
              Click any column header to sort in ascending or descending order
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
            {rawDeptStats.length} Departments Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th
                  onClick={() => handleSort('department')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    {renderSortIcon('department')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('count')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Students</span>
                    {renderSortIcon('count')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgMarks')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Avg Marks</span>
                    {renderSortIcon('avgMarks')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgGPA')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Avg GPA</span>
                    {renderSortIcon('avgGPA')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgAttendance')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Attendance %</span>
                    {renderSortIcon('avgAttendance')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgStudyHours')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Daily Study</span>
                    {renderSortIcon('avgStudyHours')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('passRate')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Pass %</span>
                    {renderSortIcon('passRate')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('highestMark')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Top Mark</span>
                    {renderSortIcon('highestMark')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedDeptStats.map((row) => (
                <tr key={row.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: deptColors[row.department] || '#2563eb' }}
                    />
                    {row.department}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {row.count} ({row.maleCount}M / {row.femaleCount}F)
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">
                    {row.avgMarks}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-200">{row.avgGPA}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-200">
                    {row.avgAttendance}%
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {row.avgStudyHours} hrs
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.passRate}%
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {row.highestMark}
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
