import React from 'react';
import {
  Menu,
  Moon,
  Sun,
  Download,
  Printer,
  Sparkles,
  Filter,
} from 'lucide-react';
import { StudentRecord } from '../types';
import { exportToCSV, groupByDepartment } from '../utils/statistics';

interface HeaderProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  filteredStudents: StudentRecord[];
  allStudents: StudentRecord[];
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
  filteredStudents,
  allStudents,
  activeFilterCount,
  onResetFilters,
}) => {
  const handleExportFiltered = () => {
    exportToCSV(filteredStudents, `students_filtered_${filteredStudents.length}`);
  };

  const handleExportSummary = () => {
    const deptSummary = groupByDepartment(filteredStudents);
    exportToCSV(deptSummary, `department_summary_${filteredStudents.length}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              Student Academic Performance Analytics
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Python EDA
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
            Exploratory analysis of academic performance across {allStudents.length} students
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Filter Badge */}
        {activeFilterCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Filter className="w-3.5 h-3.5" />
            <span>{activeFilterCount} active filters</span>
            <button
              onClick={onResetFilters}
              className="ml-1 text-[11px] underline hover:text-amber-900 dark:hover:text-amber-100"
            >
              Clear
            </button>
          </div>
        )}

        {/* Export Data Button */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportFiltered}
            title="Export filtered records as CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          <button
            onClick={handleExportSummary}
            title="Export Department Summary as CSV"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-all"
          >
            <span>Summary CSV</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save Dashboard as PDF"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Print Dashboard"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Academic Project Badge / User Profile */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            IT
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
              B.Tech IT Project
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Academic Viva Ready
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
