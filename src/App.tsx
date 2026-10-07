import React, { useState, useEffect, useMemo } from 'react';
import { RAW_STUDENTS_DATA } from './data/studentRecords';
import { StudentRecord, ActiveTab, FilterState } from './types';
import { filterStudents, calculateMean } from './utils/statistics';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { StudentProfileModal } from './components/StudentProfileModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { StudentsPage } from './pages/StudentsPage';
import { PerformancePage } from './pages/PerformancePage';
import { AttendancePage } from './pages/AttendancePage';
import { StudyLifestylePage } from './pages/StudyLifestylePage';
import { DepartmentPage } from './pages/DepartmentPage';
import { DemographicsPage } from './pages/DemographicsPage';
import { CorrelationPage } from './pages/CorrelationPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { InsightsPage } from './pages/InsightsPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { EdaPipelinePage } from './pages/EdaPipelinePage';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Filter State
  const defaultFilters: FilterState = {
    search: '',
    departments: [],
    genders: [],
    grades: [],
    passFail: [],
    parentEducation: [],
    internetAccess: [],
    extracurricular: [],
    attendanceRange: [0, 100],
    studyHoursRange: [0, 12],
    gpaRange: [0, 10],
    finalMarksRange: [0, 100],
    sleepHoursRange: [0, 12],
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Reactive filtering
  const allStudents = RAW_STUDENTS_DATA;
  const filteredStudents = useMemo(() => {
    return filterStudents(allStudents, filters);
  }, [allStudents, filters]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.departments.length) count += filters.departments.length;
    if (filters.genders.length) count += filters.genders.length;
    if (filters.grades.length) count += filters.grades.length;
    if (filters.passFail.length) count += filters.passFail.length;
    if (filters.parentEducation.length) count += filters.parentEducation.length;
    if (filters.internetAccess.length) count += filters.internetAccess.length;
    if (filters.extracurricular.length) count += filters.extracurricular.length;
    if (filters.attendanceRange[0] > 0 || filters.attendanceRange[1] < 100) count++;
    if (filters.finalMarksRange[0] > 0 || filters.finalMarksRange[1] < 100) count++;
    if (filters.studyHoursRange[0] > 0 || filters.studyHoursRange[1] < 12) count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Compute department & cohort averages for selected student modal
  const cohortAverageMarks = useMemo(() => {
    return calculateMean(allStudents.map((s) => s.Final_Marks));
  }, [allStudents]);

  const selectedStudentDeptAvgMarks = useMemo(() => {
    if (!selectedStudent) return 0;
    const deptStudents = allStudents.filter((s) => s.Department === selectedStudent.Department);
    return calculateMean(deptStudents.map((s) => s.Final_Marks));
  }, [selectedStudent, allStudents]);

  const selectedStudentDeptAvgAtt = useMemo(() => {
    if (!selectedStudent) return 0;
    const deptStudents = allStudents.filter((s) => s.Department === selectedStudent.Department);
    return calculateMean(deptStudents.map((s) => s.Attendance_Percentage));
  }, [selectedStudent, allStudents]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        totalStudents={allStudents.length}
        filteredCount={filteredStudents.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          filteredStudents={filteredStudents}
          allStudents={allStudents}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {/* Universal Global Filter Bar */}
          {activeTab !== 'about' &&
            activeTab !== 'eda_pipeline' &&
            activeTab !== 'data_quality' &&
            activeTab !== 'gpa_calculator' && (
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                totalStudents={allStudents.length}
                filteredCount={filteredStudents.length}
                onReset={handleResetFilters}
              />
            )}

          {/* Active View Router */}
          {activeTab === 'overview' && (
            <OverviewPage
              students={filteredStudents}
              allStudents={allStudents}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'gpa_calculator' && <GpaCalculatorPage />}

          {activeTab === 'students' && (
            <StudentsPage
              students={filteredStudents}
              allStudents={allStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'performance' && (
            <PerformancePage
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendancePage
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'study_lifestyle' && (
            <StudyLifestylePage
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'department' && (
            <DepartmentPage students={filteredStudents} />
          )}

          {activeTab === 'demographics' && (
            <DemographicsPage students={filteredStudents} />
          )}

          {activeTab === 'correlation' && (
            <CorrelationPage students={filteredStudents} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsPage
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsPage
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {activeTab === 'data_quality' && (
            <DataQualityPage students={allStudents} />
          )}

          {activeTab === 'eda_pipeline' && <EdaPipelinePage />}

          {activeTab === 'about' && <AboutPage />}
        </main>
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        deptAverageMarks={selectedStudentDeptAvgMarks}
        deptAverageAttendance={selectedStudentDeptAvgAtt}
        cohortAverageMarks={cohortAverageMarks}
      />
    </div>
  );
}

export default App;
