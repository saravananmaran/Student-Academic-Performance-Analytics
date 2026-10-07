import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Award,
  Sparkles,
  TrendingUp,
  Download,
  RotateCcw,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  SemesterData,
  CourseEntry,
  StudentCalculatorProfile,
  LetterGrade,
  CourseType,
} from '../types';
import {
  LICET_2024_GRADE_MAPPING,
  COURSE_TYPES,
  ALL_LETTER_GRADES,
  evaluateCourseEligibility,
  calculateSemesterGPA,
  calculateCumulativeCGPA,
  getSampleLicetData,
} from '../utils/gpaCalculator';

export const GpaCalculatorPage: React.FC = () => {
  const sample = useMemo(() => getSampleLicetData(), []);

  // Student Profile state
  const [profile, setProfile] = useState<StudentCalculatorProfile>(sample.profile);

  // Semesters & Courses state
  const [semesters, setSemesters] = useState<SemesterData[]>(sample.semesters);

  // Active semester tab index
  const [activeSemNumber, setActiveSemNumber] = useState<number>(1);

  // Accordion state
  const [showGpaBreakdown, setShowGpaBreakdown] = useState<boolean>(true);
  const [showCgpaBreakdown, setShowCgpaBreakdown] = useState<boolean>(true);
  const [showGradeScheme, setShowGradeScheme] = useState<boolean>(false);

  // Active Semester Data
  const currentSemester = useMemo(() => {
    return (
      semesters.find((s) => s.semesterNumber === activeSemNumber) ||
      semesters[0] || {
        semesterNumber: 1,
        semesterName: 'Semester 1',
        courses: [],
      }
    );
  }, [semesters, activeSemNumber]);

  // Calculations
  const currentSemCalc = useMemo(() => {
    return calculateSemesterGPA(currentSemester, profile.honsMinorCompleted);
  }, [currentSemester, profile.honsMinorCompleted]);

  const cgpaSummary = useMemo(() => {
    return calculateCumulativeCGPA(semesters, profile.honsMinorCompleted);
  }, [semesters, profile.honsMinorCompleted]);

  // Handler: Add Semester
  const handleAddSemester = () => {
    const nextNum = semesters.length + 1;
    if (nextNum > 8) {
      alert('Maximum of 8 semesters reached for undergraduate B.E./B.Tech. program.');
      return;
    }
    const newSem: SemesterData = {
      semesterNumber: nextNum,
      semesterName: `Semester ${nextNum}`,
      courses: [
        {
          id: `s${nextNum}-c1`,
          courseCode: '',
          courseName: '',
          credits: 3,
          courseType: 'Curricular Course',
          grade: '',
        },
      ],
    };
    setSemesters([...semesters, newSem]);
    setActiveSemNumber(nextNum);
  };

  // Handler: Add Course to active semester
  const handleAddCourse = () => {
    const newCourse: CourseEntry = {
      id: `s${activeSemNumber}-c${Date.now()}`,
      courseCode: '',
      courseName: '',
      credits: 3,
      courseType: 'Curricular Course',
      grade: '',
    };
    setSemesters((prev) =>
      prev.map((s) =>
        s.semesterNumber === activeSemNumber
          ? { ...s, courses: [...s.courses, newCourse] }
          : s
      )
    );
  };

  // Handler: Update Course
  const handleUpdateCourse = (courseId: string, updates: Partial<CourseEntry>) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.semesterNumber === activeSemNumber
          ? {
              ...s,
              courses: s.courses.map((c) =>
                c.id === courseId ? { ...c, ...updates } : c
              ),
            }
          : s
      )
    );
  };

  // Handler: Remove Course
  const handleRemoveCourse = (courseId: string, course: CourseEntry) => {
    const hasData = course.courseCode.trim() || course.courseName.trim() || course.grade;
    if (hasData) {
      const confirmDelete = window.confirm(
        `Are you sure you want to remove ${course.courseCode || 'this course'} (${course.courseName || 'Untitled'})?`
      );
      if (!confirmDelete) return;
    }

    setSemesters((prev) =>
      prev.map((s) =>
        s.semesterNumber === activeSemNumber
          ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
          : s
      )
    );
  };

  // Reset to Sample
  const handleResetToSample = () => {
    const freshSample = getSampleLicetData();
    setProfile(freshSample.profile);
    setSemesters(freshSample.semesters);
    setActiveSemNumber(1);
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('Clear all entered courses and reset to empty Semester 1?')) {
      setSemesters([
        {
          semesterNumber: 1,
          semesterName: 'Semester 1',
          courses: [
            {
              id: 's1-c1',
              courseCode: '',
              courseName: '',
              credits: 3,
              courseType: 'Curricular Course',
              grade: '',
            },
          ],
        },
      ]);
      setActiveSemNumber(1);
    }
  };

  // GPA Chart Data
  const gpaChartData = useMemo(() => {
    return cgpaSummary.semesters
      .filter((s) => s.eligibleCredits > 0)
      .map((s) => ({
        name: `Sem ${s.semesterNumber}`,
        gpa: s.gpa,
        credits: s.eligibleCredits,
      }));
  }, [cgpaSummary]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/20">
              <Calculator className="w-3.5 h-3.5" /> LICET Regulations 2024
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              GPA &amp; CGPA Calculator
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Calculate your semester GPA and cumulative CGPA using the official LICET Regulations 2024 credit-weighted method.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetToSample}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md border border-white/30 transition-all shadow-sm"
              title="Populate with LICET IT curriculum data"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Load LICET Sample Data</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-rose-500/80 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all"
              title="Clear all courses and start empty"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: Student Details & Regulation Rules Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Step 1 — Student &amp; Academic Program Specification
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Regulation 2024
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Saravanan K"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Register Number
            </label>
            <input
              type="text"
              value={profile.registerNumber}
              onChange={(e) => setProfile({ ...profile, registerNumber: e.target.value })}
              placeholder="e.g. 311124205001"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="CSE">CSE — Computer Science</option>
              <option value="IT">IT — Information Technology</option>
              <option value="ECE">ECE — Electronics &amp; Comm.</option>
              <option value="EEE">EEE — Electrical &amp; Electronics</option>
              <option value="MECH">MECH — Mechanical</option>
              <option value="CIVIL">CIVIL — Civil Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Current Semester
            </label>
            <select
              value={profile.currentSemester}
              onChange={(e) => setProfile({ ...profile, currentSemester: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Hons. / Minor Completed?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, honsMinorCompleted: false })}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  !profile.honsMinorCompleted
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, honsMinorCompleted: true })}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  profile.honsMinorCompleted
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Regulation Policy Alert */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>LICET Regulation Rule:</strong> Additional courses, Hons. courses, Minor courses, and grades <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">U</code> (Re-appearance) &amp; <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">SA</code> (Shortage of Attendance) are excluded from normal semester GPA and CGPA. They are considered in cumulative CGPA only when the applicable B.E./B.Tech. (Hons.) or Minor degree requirements have been verified as completed.
          </div>
        </div>
      </div>

      {/* Grade Mapping Reference Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setShowGradeScheme(!showGradeScheme)}
          className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>LICET Regulations 2024 Centralized Grade Point Configuration Reference</span>
          </div>
          {showGradeScheme ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGradeScheme && (
          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 overflow-x-auto animate-fade-in">
            <table className="w-full text-center text-xs mt-2">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <th className="py-2 px-3">Letter Grade</th>
                  <th className="py-2 px-3">Grade Point</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Calculation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ALL_LETTER_GRADES.map((g) => {
                  const cfg = LICET_2024_GRADE_MAPPING[g];
                  return (
                    <tr key={g} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                          {g}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-extrabold text-blue-600 dark:text-blue-400">
                        {cfg.gradePoint !== null ? cfg.gradePoint : '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                        {cfg.description}
                      </td>
                      <td className="py-2 px-3">
                        {cfg.isEligible ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Excluded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEMESTER TABS & COURSE ENTRY TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Semester Selection Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {semesters.map((sem) => (
              <button
                key={sem.semesterNumber}
                onClick={() => setActiveSemNumber(sem.semesterNumber)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeSemNumber === sem.semesterNumber
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sem.semesterName}
              </button>
            ))}

            <button
              onClick={handleAddSemester}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all border border-blue-200 dark:border-blue-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Semester</span>
            </button>
          </div>

          <button
            onClick={handleAddCourse}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course to {currentSemester.semesterName}</span>
          </button>
        </div>

        {/* Validation Errors Notice */}
        {currentSemCalc.validationErrors.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              Validation Notice ({currentSemCalc.validationErrors.length} required field(s)):
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
              {currentSemCalc.validationErrors.slice(0, 3).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {currentSemCalc.validationErrors.length > 3 && (
                <li>...and {currentSemCalc.validationErrors.length - 3} more items.</li>
              )}
            </ul>
          </div>
        )}

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-2 w-28">Course Code *</th>
                <th className="py-2.5 px-2">Course Name *</th>
                <th className="py-2.5 px-2 w-20">Credits *</th>
                <th className="py-2.5 px-2 w-36">Course Type *</th>
                <th className="py-2.5 px-2 w-24">Grade *</th>
                <th className="py-2.5 px-2 w-24 text-center">Grade Point</th>
                <th className="py-2.5 px-2 w-32">Include in GPA</th>
                <th className="py-2.5 px-2 w-32">Include in CGPA</th>
                <th className="py-2.5 px-2 w-16 text-center">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentSemester.courses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No courses added yet for {currentSemester.semesterName}. Click &ldquo;+ Add Course&rdquo; above.
                  </td>
                </tr>
              ) : (
                currentSemester.courses.map((course, idx) => {
                  const status = evaluateCourseEligibility(course, profile.honsMinorCompleted);

                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Course Code */}
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={course.courseCode}
                          onChange={(e) =>
                            handleUpdateCourse(course.id, { courseCode: e.target.value.toUpperCase() })
                          }
                          placeholder="e.g. IT24101"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white uppercase focus:outline-none"
                        />
                      </td>

                      {/* Course Name */}
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={course.courseName}
                          onChange={(e) =>
                            handleUpdateCourse(course.id, { courseName: e.target.value })
                          }
                          placeholder="e.g. Data Structures"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        />
                      </td>

                      {/* Credits */}
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={course.credits || ''}
                          onChange={(e) =>
                            handleUpdateCourse(course.id, { credits: Number(e.target.value) })
                          }
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-center text-slate-900 dark:text-white focus:outline-none"
                        />
                      </td>

                      {/* Course Type */}
                      <td className="py-2 px-2">
                        <select
                          value={course.courseType}
                          onChange={(e) =>
                            handleUpdateCourse(course.id, { courseType: e.target.value as CourseType })
                          }
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        >
                          {COURSE_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Grade */}
                      <td className="py-2 px-2">
                        <select
                          value={course.grade}
                          onChange={(e) =>
                            handleUpdateCourse(course.id, { grade: e.target.value as LetterGrade })
                          }
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="">Select</option>
                          {ALL_LETTER_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Grade Point (Calculated, Readonly) */}
                      <td className="py-2 px-2 text-center font-extrabold text-blue-600 dark:text-blue-400">
                        {status.gradePoint !== null ? status.gradePoint : '—'}
                      </td>

                      {/* Include in GPA */}
                      <td className="py-2 px-2">
                        {status.includeInGPA ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Eligible ({status.weightedPoints} pts)
                          </span>
                        ) : (
                          <span
                            title={status.exclusionReasonGPA || 'Excluded'}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 truncate max-w-[140px]"
                          >
                            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                            <span className="truncate">{status.exclusionReasonGPA}</span>
                          </span>
                        )}
                      </td>

                      {/* Include in CGPA */}
                      <td className="py-2 px-2">
                        {status.includeInCGPA ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            <CheckCircle2 className="w-3 h-3 text-purple-600" />
                            Eligible
                          </span>
                        ) : (
                          <span
                            title={status.exclusionReasonCGPA || 'Excluded'}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 truncate max-w-[140px]"
                          >
                            <XCircle className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{status.exclusionReasonCGPA}</span>
                          </span>
                        )}
                      </td>

                      {/* Remove Button */}
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course.id, course)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Remove course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEMESTER GPA SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Semester GPA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {currentSemester.semesterName} GPA
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {currentSemCalc.gpa.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">
              Formula: &Sigma;(Credits &times; GP) &divide; &Sigma;Credits
            </p>
          </div>
          <div className="absolute top-4 right-4 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Eligible Credits */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Eligible Credits
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {currentSemCalc.eligibleCredits}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Curricular pass courses only
          </p>
        </div>

        {/* Weighted Points */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Weighted Grade Points
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {currentSemCalc.totalWeightedPoints.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            &Sigma;(Course Credits &times; Grade Point)
          </p>
        </div>

        {/* Courses Summary */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Course Audit Breakdown
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentSemCalc.eligibleCoursesCount}{' '}
            <span className="text-xs font-normal text-slate-400">Eligible</span> /{' '}
            {currentSemCalc.excludedCoursesCount}{' '}
            <span className="text-xs font-normal text-rose-500">Excluded</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {currentSemCalc.totalCoursesEntered} total courses entered
          </p>
        </div>
      </div>

      {/* CUMULATIVE CGPA SUMMARY SECTION */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Cumulative CGPA Summary (LICET Regulations 2024)
            </h3>
            <p className="text-xs text-slate-300">
              Evaluated across all {semesters.length} entered semesters using total credit-weighted sums.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              Calculated Cumulative CGPA
            </span>
            <span className="text-4xl font-extrabold text-amber-400">
              {cgpaSummary.cgpa.toFixed(2)}
            </span>
            <span className="block text-[11px] text-slate-300">
              Based on {cgpaSummary.totalCumulativeCredits} Total Eligible Credits
            </span>
          </div>
        </div>

        {/* Semesters Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-3">Semester</th>
                <th className="py-2.5 px-3">Courses Entered</th>
                <th className="py-2.5 px-3">Eligible Credits</th>
                <th className="py-2.5 px-3">Weighted Points</th>
                <th className="py-2.5 px-3">Semester GPA</th>
                <th className="py-2.5 px-3">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cgpaSummary.semesters.map((s) => {
                const isHighest =
                  cgpaSummary.highestGpaSemester &&
                  cgpaSummary.highestGpaSemester.name === s.semesterName;
                const isLowest =
                  cgpaSummary.lowestGpaSemester &&
                  cgpaSummary.lowestGpaSemester.name === s.semesterName &&
                  cgpaSummary.semesters.length > 1;

                return (
                  <tr key={s.semesterNumber} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{s.semesterName}</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {s.totalCoursesEntered} ({s.eligibleCoursesCount} eligible)
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-semibold">{s.eligibleCredits}</td>
                    <td className="py-2.5 px-3 text-indigo-300">{s.totalWeightedPoints.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-extrabold text-white text-sm">
                      {s.gpa.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      {isHighest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Highest GPA
                        </span>
                      )}
                      {isLowest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Lowest GPA
                        </span>
                      )}
                      {!isHighest && !isLowest && (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/20 font-bold text-slate-200">
                <td className="py-3 px-3 uppercase text-[11px]">Cumulative Total</td>
                <td className="py-3 px-3">
                  {cgpaSummary.semesters.reduce((acc, s) => acc + s.totalCoursesEntered, 0)} courses
                </td>
                <td className="py-3 px-3 text-amber-300 text-sm">
                  {cgpaSummary.totalCumulativeCredits} credits
                </td>
                <td className="py-3 px-3 text-indigo-300">
                  {cgpaSummary.totalCumulativeWeightedPoints.toFixed(2)} pts
                </td>
                <td className="py-3 px-3 text-amber-400 text-base font-extrabold">
                  {cgpaSummary.cgpa.toFixed(2)} CGPA
                </td>
                <td className="py-3 px-3 text-emerald-400 text-[11px]">Credit-Weighted</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* VISUALIZATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Progress Trend Line Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                GPA Progression Across Semesters
              </h3>
              <p className="text-xs text-slate-500">Semester-by-semester academic trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
              Line Chart
            </span>
          </div>
          <div className="h-64">
            {gpaChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Enter at least one semester with eligible courses to render trajectory.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[5.0, 10.0]} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `${Number(val).toFixed(2)} GPA (${item.payload.credits} credits)`,
                      'Semester GPA',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#2563eb' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Student Grade Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                Student Cumulative Grade Distribution
              </h3>
              <p className="text-xs text-slate-500">Frequency of letter grades earned by student</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600">
              Grade Counts
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cgpaSummary.gradeDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="grade" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} course(s) [GP: ${item.payload.points !== null ? item.payload.points : 'Excluded'}]`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {cgpaSummary.gradeDistribution.map((entry) => {
                    const isEx = entry.grade === 'U' || entry.grade === 'SA';
                    return (
                      <Cell
                        key={entry.grade}
                        fill={isEx ? '#ef4444' : '#6366f1'}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DETAILED CALCULATION BREAKDOWN ACCORDIONS */}
      <div className="space-y-4">
        {/* Semester GPA Calculation Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <button
            onClick={() => setShowGpaBreakdown(!showGpaBreakdown)}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>How was my {currentSemester.semesterName} GPA calculated?</span>
            </div>
            {showGpaBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGpaBreakdown && (
            <div className="pt-2 text-xs space-y-3 animate-fade-in">
              <p className="text-slate-600 dark:text-slate-400">
                Under LICET Regulations 2024, each eligible curricular course contributes weighted grade points equal to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">Course Credits &times; Grade Point</code>:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono space-y-1.5 text-slate-800 dark:text-slate-200">
                {currentSemester.courses.length === 0 ? (
                  <p className="text-slate-400">No courses in this semester.</p>
                ) : (
                  currentSemester.courses.map((c, i) => {
                    const status = evaluateCourseEligibility(c, profile.honsMinorCompleted);
                    if (status.includeInGPA && status.gradePoint !== null) {
                      return (
                        <div key={i} className="flex justify-between items-center py-0.5">
                          <span>
                            {c.courseCode || `Course #${i + 1}`} ({c.courseName || 'Untitled'}):
                          </span>
                          <span>
                            {c.credits} Credits &times; {status.gradePoint} GP = <strong>{status.weightedPoints.toFixed(2)}</strong>
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div key={i} className="flex justify-between items-center py-0.5 text-slate-400">
                          <span>
                            {c.courseCode || `Course #${i + 1}`} ({c.courseName || 'Untitled'}):
                          </span>
                          <span className="italic">
                            [{status.exclusionReasonGPA || 'Excluded'}] = 0 pts
                          </span>
                        </div>
                      );
                    }
                  })
                )}

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-blue-600 dark:text-blue-400">
                  <span>Total Weighted Grade Points (&Sigma; Credits &times; GP):</span>
                  <span>{currentSemCalc.totalWeightedPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>Total Eligible Credits (&Sigma; Credits):</span>
                  <span>{currentSemCalc.eligibleCredits}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-blue-200 font-mono text-center">
                GPA = {currentSemCalc.totalWeightedPoints.toFixed(2)} &divide; {currentSemCalc.eligibleCredits || 1} ={' '}
                <strong className="text-base text-blue-700 dark:text-blue-400 font-bold">
                  {currentSemCalc.gpa.toFixed(2)}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Cumulative CGPA Calculation Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <button
            onClick={() => setShowCgpaBreakdown(!showCgpaBreakdown)}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>How was my Cumulative CGPA calculated?</span>
            </div>
            {showCgpaBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCgpaBreakdown && (
            <div className="pt-2 text-xs space-y-3 animate-fade-in">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Crucial LICET Regulation Standard:</strong> CGPA is <strong>NOT</strong> calculated as a simple arithmetic average of semester GPAs (i.e. not <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">(GPA1 + GPA2 + ...)/N</code>). Rather, it is strictly computed across all semesters by dividing total cumulative weighted grade points by total cumulative eligible credits:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono space-y-2 text-slate-800 dark:text-slate-200">
                {cgpaSummary.semesters.map((s) => (
                  <div key={s.semesterNumber} className="flex justify-between items-center py-0.5">
                    <span>{s.semesterName}:</span>
                    <span>
                      Weighted Points = {s.totalWeightedPoints.toFixed(2)}, Credits = {s.eligibleCredits}
                    </span>
                  </div>
                ))}

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-purple-600 dark:text-purple-400">
                  <span>Total Cumulative Weighted Points across all semesters:</span>
                  <span>{cgpaSummary.totalCumulativeWeightedPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>Total Cumulative Eligible Credits across all semesters:</span>
                  <span>{cgpaSummary.totalCumulativeCredits}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-purple-950 dark:text-purple-200 font-mono text-center">
                CGPA = {cgpaSummary.totalCumulativeWeightedPoints.toFixed(2)} &divide; {cgpaSummary.totalCumulativeCredits || 1} ={' '}
                <strong className="text-base text-purple-700 dark:text-purple-400 font-bold">
                  {cgpaSummary.cgpa.toFixed(2)}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
