import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Users,
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalStudents: number;
  filteredCount: number;
  onReset: () => void;
}

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const GRADES = ['A+', 'A', 'B', 'C', 'D', 'F'];
const PARENT_EDU = ['School', 'Diploma', 'UG', 'PG'];
const INTERNET = ['Poor', 'Average', 'Good', 'Excellent'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalStudents,
  filteredCount,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleDepartment = (dept: string) => {
    setFilters((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  const toggleGrade = (grade: string) => {
    setFilters((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter((g) => g !== grade)
        : [...prev.grades, grade],
    }));
  };

  const setGender = (gender: string) => {
    setFilters((prev) => ({
      ...prev,
      genders: prev.genders.includes(gender) ? [] : [gender],
    }));
  };

  const setPassFail = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      passFail: prev.passFail.includes(status) ? [] : [status],
    }));
  };

  const toggleParentEdu = (edu: string) => {
    setFilters((prev) => ({
      ...prev,
      parentEducation: prev.parentEducation.includes(edu)
        ? prev.parentEducation.filter((e) => e !== edu)
        : [...prev.parentEducation, edu],
    }));
  };

  const toggleInternet = (access: string) => {
    setFilters((prev) => ({
      ...prev,
      internetAccess: prev.internetAccess.includes(access)
        ? prev.internetAccess.filter((i) => i !== access)
        : [...prev.internetAccess, access],
    }));
  };

  const setExtracurricular = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      extracurricular: prev.extracurricular.includes(val) ? [] : [val],
    }));
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.departments.length > 0 ||
    filters.genders.length > 0 ||
    filters.grades.length > 0 ||
    filters.passFail.length > 0 ||
    filters.parentEducation.length > 0 ||
    filters.internetAccess.length > 0 ||
    filters.extracurricular.length > 0 ||
    filters.attendanceRange[0] > 0 ||
    filters.attendanceRange[1] < 100 ||
    filters.finalMarksRange[0] > 0 ||
    filters.finalMarksRange[1] < 100 ||
    filters.gpaRange[0] > 0 ||
    filters.gpaRange[1] < 10 ||
    filters.studyHoursRange[0] > 0 ||
    filters.studyHoursRange[1] < 12;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 transition-all">
      {/* Primary Row: Search, Main Filters, Count and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search student ID (e.g. STU001) or dept..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges: Departments */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1 uppercase">
            Dept:
          </span>
          {DEPARTMENTS.map((dept) => {
            const isSelected = filters.departments.includes(dept);
            return (
              <button
                key={dept}
                onClick={() => toggleDepartment(dept)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Status Count and Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Users className="w-4 h-4 text-blue-500" />
            <span>
              <strong className="text-slate-900 dark:text-white font-bold">{filteredCount}</strong> of {totalStudents} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                showAdvanced || hasActiveFilters
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                title="Clear all filters"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filter Expansion */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Gender & Pass/Fail */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Gender
              </label>
              <div className="flex gap-2">
                {['Male', 'Female'].map((g) => {
                  const isSelected = filters.genders.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Pass / Fail Status
              </label>
              <div className="flex gap-2">
                {['Pass', 'Fail'].map((status) => {
                  const isSelected = filters.passFail.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => setPassFail(status)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? status === 'Pass'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grades */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Grade
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {GRADES.map((grade) => {
                const isSelected = filters.grades.includes(grade);
                return (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parent Education & Internet */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Parent Education
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PARENT_EDU.map((edu) => {
                  const isSelected = filters.parentEducation.includes(edu);
                  return (
                    <button
                      key={edu}
                      onClick={() => toggleParentEdu(edu)}
                      className={`px-2 py-0.5 text-xs font-medium rounded-md border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {edu}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Internet Access
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTERNET.map((net) => {
                  const isSelected = filters.internetAccess.includes(net);
                  return (
                    <button
                      key={net}
                      onClick={() => toggleInternet(net)}
                      className={`px-2 py-0.5 text-xs font-medium rounded-md border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {net}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sliders: Attendance & Final Marks */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Min Attendance</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{filters.attendanceRange[0]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.attendanceRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    attendanceRange: [Number(e.target.value), prev.attendanceRange[1]],
                  }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Min Final Marks</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{filters.finalMarksRange[0]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.finalMarksRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    finalMarksRange: [Number(e.target.value), prev.finalMarksRange[1]],
                  }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Min Daily Study</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{filters.studyHoursRange[0]} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.studyHoursRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    studyHoursRange: [Number(e.target.value), prev.studyHoursRange[1]],
                  }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
