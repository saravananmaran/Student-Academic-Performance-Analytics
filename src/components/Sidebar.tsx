import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Coffee,
  Building2,
  PieChart,
  GitCompare,
  Calculator,
  AlertTriangle,
  ShieldCheck,
  FileCode2,
  Info,
  X,
  Database,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalStudents: number;
  filteredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  totalStudents,
  filteredCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; category?: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, category: 'Core Dashboards' },
    { id: 'gpa_calculator', label: 'GPA & CGPA Calculator', icon: Calculator, category: 'Core Dashboards', badge: 'LICET 2024' },
    { id: 'students', label: 'Student Data Explorer', icon: Users, category: 'Core Dashboards', badge: `${filteredCount}` },
    { id: 'performance', label: 'Performance Analysis', icon: GraduationCap, category: 'Analytical Modules' },
    { id: 'attendance', label: 'Attendance vs Marks', icon: CalendarCheck, category: 'Analytical Modules' },
    { id: 'study_lifestyle', label: 'Study & Lifestyle Habits', icon: Coffee, category: 'Analytical Modules' },
    { id: 'department', label: 'Department Analytics', icon: Building2, category: 'Analytical Modules' },
    { id: 'demographics', label: 'Demographics & Factors', icon: PieChart, category: 'Analytical Modules' },
    { id: 'correlation', label: 'Correlation Heatmap', icon: GitCompare, category: 'Statistical EDA' },
    { id: 'statistics', label: 'Descriptive & Outliers', icon: Calculator, category: 'Statistical EDA' },
    { id: 'insights', label: 'Insights & At-Risk Alert', icon: AlertTriangle, category: 'Decision Support' },
    { id: 'data_quality', label: 'Data Quality & Schema', icon: ShieldCheck, category: 'Data & Methodology' },
    { id: 'eda_pipeline', label: 'Python EDA Pipeline', icon: FileCode2, category: 'Data & Methodology', badge: 'Python' },
    { id: 'about', label: 'About Project (B.Tech)', icon: Info, category: 'Data & Methodology' },
  ];

  // Group items by category
  const categories = Array.from(new Set(navItems.map((item) => item.category || 'General')));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                AcademicPulse
              </h1>
              <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Student EDA & Analytics
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {categories.map((cat) => {
            const items = navItems.filter((i) => i.category === cat);
            return (
              <div key={cat} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {cat}
                </p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md border ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Dataset Status Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 m-2 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-600" /> Dataset
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(filteredCount / (totalStudents || 1)) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Filtered: {filteredCount}</span>
            <span>Total: {totalStudents}</span>
          </p>
        </div>
      </aside>
    </>
  );
};
