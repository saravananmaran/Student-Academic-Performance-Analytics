import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { StudentRecord } from '../types';
import { exportToCSV } from '../utils/statistics';

interface StudentsPageProps {
  students: StudentRecord[];
  allStudents: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

type SortField = keyof StudentRecord;
type SortOrder = 'asc' | 'desc';

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  allStudents,
  onSelectStudent,
}) => {
  const [sortField, setSortField] = useState<SortField>('Final_Marks');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    Student_ID: true,
    Department: true,
    Gender: true,
    Age: true,
    Attendance_Percentage: true,
    Study_Hours_Per_Day: true,
    Assignment_Score: true,
    Internal_Marks: true,
    Previous_Semester_GPA: true,
    Final_Marks: true,
    Grade: true,
    Pass_Fail: true,
    Internet_Access: false,
    Parent_Education: false,
    Extracurricular_Activities: false,
    Sleep_Hours_Per_Day: false,
  });

  const [showColPicker, setShowColPicker] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [students, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-50" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Interactive Student Data Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Displaying {sortedStudents.length} matching records from total {allStudents.length}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Column Visibility Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColPicker(!showColPicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>

            {showColPicker && (
              <div className="absolute right-0 mt-2 w-56 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 space-y-1.5 animate-fade-in text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300 border-b pb-1 mb-1">
                  Visible Attributes
                </p>
                {Object.keys(visibleColumns).map((colKey) => (
                  <label
                    key={colKey}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey as keyof typeof visibleColumns]}
                      onChange={() => toggleColumn(colKey as keyof typeof visibleColumns)}
                      className="rounded accent-blue-600"
                    />
                    <span className="truncate">{colKey.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(sortedStudents, `student_explorer_${sortedStudents.length}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table</span>
          </button>

          {/* Page size select */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 focus:outline-none"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider z-10">
              <tr>
                {visibleColumns.Student_ID && (
                  <th
                    onClick={() => handleSort('Student_ID')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Student ID</span>
                      {renderSortIcon('Student_ID')}
                    </div>
                  </th>
                )}
                {visibleColumns.Department && (
                  <th
                    onClick={() => handleSort('Department')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Dept</span>
                      {renderSortIcon('Department')}
                    </div>
                  </th>
                )}
                {visibleColumns.Gender && (
                  <th
                    onClick={() => handleSort('Gender')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Gender</span>
                      {renderSortIcon('Gender')}
                    </div>
                  </th>
                )}
                {visibleColumns.Age && (
                  <th
                    onClick={() => handleSort('Age')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Age</span>
                      {renderSortIcon('Age')}
                    </div>
                  </th>
                )}
                {visibleColumns.Attendance_Percentage && (
                  <th
                    onClick={() => handleSort('Attendance_Percentage')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Attendance</span>
                      {renderSortIcon('Attendance_Percentage')}
                    </div>
                  </th>
                )}
                {visibleColumns.Study_Hours_Per_Day && (
                  <th
                    onClick={() => handleSort('Study_Hours_Per_Day')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Study Hrs</span>
                      {renderSortIcon('Study_Hours_Per_Day')}
                    </div>
                  </th>
                )}
                {visibleColumns.Assignment_Score && (
                  <th
                    onClick={() => handleSort('Assignment_Score')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Assignment</span>
                      {renderSortIcon('Assignment_Score')}
                    </div>
                  </th>
                )}
                {visibleColumns.Internal_Marks && (
                  <th
                    onClick={() => handleSort('Internal_Marks')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Internal</span>
                      {renderSortIcon('Internal_Marks')}
                    </div>
                  </th>
                )}
                {visibleColumns.Previous_Semester_GPA && (
                  <th
                    onClick={() => handleSort('Previous_Semester_GPA')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>GPA</span>
                      {renderSortIcon('Previous_Semester_GPA')}
                    </div>
                  </th>
                )}
                {visibleColumns.Final_Marks && (
                  <th
                    onClick={() => handleSort('Final_Marks')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Final Marks</span>
                      {renderSortIcon('Final_Marks')}
                    </div>
                  </th>
                )}
                {visibleColumns.Grade && (
                  <th
                    onClick={() => handleSort('Grade')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Grade</span>
                      {renderSortIcon('Grade')}
                    </div>
                  </th>
                )}
                {visibleColumns.Pass_Fail && (
                  <th
                    onClick={() => handleSort('Pass_Fail')}
                    className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {renderSortIcon('Pass_Fail')}
                    </div>
                  </th>
                )}
                {visibleColumns.Internet_Access && (
                  <th className="p-3.5">Internet</th>
                )}
                {visibleColumns.Parent_Education && (
                  <th className="p-3.5">Parent Edu</th>
                )}
                {visibleColumns.Extracurricular_Activities && (
                  <th className="p-3.5">Extracurricular</th>
                )}
                {visibleColumns.Sleep_Hours_Per_Day && (
                  <th className="p-3.5">Sleep Hrs</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-12 text-slate-400">
                    No students match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => {
                  const isAtRisk =
                    st.Final_Marks < 50 ||
                    st.Attendance_Percentage < 75 ||
                    st.Previous_Semester_GPA < 5.5;

                  return (
                    <tr
                      key={st.Student_ID}
                      onClick={() => onSelectStudent(st)}
                      className="hover:bg-blue-50/60 dark:hover:bg-blue-950/30 cursor-pointer transition-colors group"
                    >
                      {visibleColumns.Student_ID && (
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="group-hover:text-blue-600 transition-colors">
                            {st.Student_ID}
                          </span>
                          {isAtRisk && (
                            <span title="Student flagged for academic attention">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          )}
                          {st.Final_Marks >= 85 && (
                            <span title="Honors Performer">
                              <Award className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                          )}
                        </td>
                      )}
                      {visibleColumns.Department && (
                        <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                          {st.Department}
                        </td>
                      )}
                      {visibleColumns.Gender && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">{st.Gender}</td>
                      )}
                      {visibleColumns.Age && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">{st.Age}</td>
                      )}
                      {visibleColumns.Attendance_Percentage && (
                        <td className="p-3.5 font-medium">
                          <span
                            className={
                              st.Attendance_Percentage < 75
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {st.Attendance_Percentage}%
                          </span>
                        </td>
                      )}
                      {visibleColumns.Study_Hours_Per_Day && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Study_Hours_Per_Day}h
                        </td>
                      )}
                      {visibleColumns.Assignment_Score && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Assignment_Score}
                        </td>
                      )}
                      {visibleColumns.Internal_Marks && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Internal_Marks}
                        </td>
                      )}
                      {visibleColumns.Previous_Semester_GPA && (
                        <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {st.Previous_Semester_GPA}
                        </td>
                      )}
                      {visibleColumns.Final_Marks && (
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          <span
                            className={
                              st.Final_Marks < 50
                                ? 'text-rose-600 font-extrabold'
                                : st.Final_Marks >= 80
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : ''
                            }
                          >
                            {st.Final_Marks}
                          </span>
                        </td>
                      )}
                      {visibleColumns.Grade && (
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                              st.Grade === 'A+' || st.Grade === 'A'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : st.Grade === 'B'
                                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : st.Grade === 'C'
                                ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            {st.Grade}
                          </span>
                        </td>
                      )}
                      {visibleColumns.Pass_Fail && (
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.Pass_Fail === 'Pass'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            }`}
                          >
                            {st.Pass_Fail}
                          </span>
                        </td>
                      )}
                      {visibleColumns.Internet_Access && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Internet_Access}
                        </td>
                      )}
                      {visibleColumns.Parent_Education && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Parent_Education}
                        </td>
                      )}
                      {visibleColumns.Extracurricular_Activities && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Extracurricular_Activities}
                        </td>
                      )}
                      {visibleColumns.Sleep_Hours_Per_Day && (
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {st.Sleep_Hours_Per_Day}h
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedStudents.length)} of {sortedStudents.length}{' '}
            records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
