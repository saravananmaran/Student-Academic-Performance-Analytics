import React from 'react';
import {
  Info,
  GraduationCap,
  FileCode2,
  Database,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Code,
  FolderGit2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'Python', role: 'Data Analysis & Scripting', badge: 'Core Python 3.12' },
    { name: 'Pandas', role: 'Dataframes, Null Audits & Aggregations', badge: 'v2.2+' },
    { name: 'NumPy', role: 'Numerical Operations & Linear Algebra', badge: 'v1.26+' },
    { name: 'Matplotlib & Seaborn', role: 'Statistical Plotting & Heatmaps', badge: 'Visualization' },
    { name: 'React & TypeScript', role: 'Frontend Architecture & Type Safety', badge: 'React 19 + TS' },
    { name: 'Recharts', role: 'Interactive SVG Chart Engine', badge: 'v2.15+' },
    { name: 'Tailwind CSS', role: 'Modern Responsive Design System', badge: 'v4.0' },
  ];

  const analysisTypes = [
    { title: 'Data Cleaning & Profiling', desc: 'Verified 0 missing values, verified 0 duplicates, cataloged 16 attributes.' },
    { title: 'Descriptive Statistics', desc: 'Parametric (mean, std dev) and non-parametric (median, IQR, min, max) evaluations.' },
    { title: 'Univariate Analysis', desc: 'Frequency histograms, grade distributions, and GPA tier spreads.' },
    { title: 'Bivariate Regression', desc: 'Ordinary Least Squares (OLS) regression between attendance and final marks.' },
    { title: 'Correlation Heatmap', desc: '8x8 Pearson correlation coefficient matrix analyzing continuous numerical factors.' },
    { title: 'Tukey IQR Outlier Detection', desc: 'Identified upper and lower fences with John Tukey’s 1.5x IQR formula.' },
    { title: 'Multi-Department Comparison', desc: 'Comparative benchmarking across CSE, IT, ECE, EEE, MECH, and CIVIL.' },
    { title: 'At-Risk Diagnostic Engine', desc: 'Early warning heuristic flag based on attendance, marks, and GPA criteria.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/20">
            <GraduationCap className="w-4 h-4" /> B.Tech IT Academic Capstone Project
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Exploratory Data Analysis of Student Academic Performance Using Python
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
            A comprehensive, data-driven investigation into academic achievement, classroom attendance, study behaviors, and demographic factors across 500 undergraduate engineering students.
          </p>
        </div>
      </div>

      {/* Objective & Dataset Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objective */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Project Objective
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            &ldquo;To analyze student academic performance and identify relationships between academic, attendance, study-habit, demographic and lifestyle factors using exploratory data analysis and statistical modeling.&rdquo;
          </p>
          <div className="pt-2 text-xs text-slate-500 space-y-1">
            <p>&bull; Identify modifiable behaviors impacting student marks.</p>
            <p>&bull; Establish empirical correlations between attendance and GPA.</p>
            <p>&bull; Build an early detection system for at-risk learners.</p>
          </div>
        </div>

        {/* Dataset Profile */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" /> Dataset Specification
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Structured observational dataset comprising <strong>500 undergraduate students</strong> across 6 technical departments.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Total Records</span>
              <strong className="text-slate-900 dark:text-white">500 Students</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Attributes</span>
              <strong className="text-slate-900 dark:text-white">16 Columns</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Departments</span>
              <strong className="text-slate-900 dark:text-white">6 Branches</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Data Completeness</span>
              <strong className="text-emerald-600">100% (No Nulls)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" /> Technologies &amp; Analytical Tooling
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs">{tech.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                  {tech.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analyses Performed Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" /> Exploratory Analyses Performed
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysisTypes.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1"
            >
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Outcomes & Educational Implications */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-blue-950 dark:text-blue-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" /> Project Outcomes &amp; Educational Impact
        </h3>
        <p className="text-xs sm:text-sm text-blue-900/90 dark:text-blue-200/90 leading-relaxed">
          Through Exploratory Data Analysis, this project demonstrates that academic performance is not arbitrary; rather, it is strongly driven by attendance regularity, continuous formative evaluation (internal tests &amp; assignments), and structured daily study routines.
        </p>
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-blue-200 dark:border-blue-800">
            <strong className="block text-blue-900 dark:text-blue-300 mb-1">For Academic Counselors:</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Enables early identification of students falling below 75% attendance before semester exams occur.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-blue-200 dark:border-blue-800">
            <strong className="block text-blue-900 dark:text-blue-300 mb-1">For Department Heads:</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Provides data-driven branch comparative analytics to allocate remedial tutoring and tutorial sessions.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-blue-200 dark:border-blue-800">
            <strong className="block text-blue-900 dark:text-blue-300 mb-1">For Students:</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Clear empirical evidence that devoting 3.5+ hours of daily study directly correlates with higher GPAs.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Footer */}
      <footer className="pt-6 pb-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Student Academic Performance Analytics • Exploratory Data Analysis Using Python
        </p>
        <p>B.Tech Information Technology Academic Capstone &bull; Cohort 2026</p>
      </footer>
    </div>
  );
};
