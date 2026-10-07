import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle,
  Copy,
  Check,
  Terminal,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface EdaStep {
  step: number;
  title: string;
  category: string;
  description: string;
  pythonSnippet: string;
  findings: string;
}

export const EdaPipelinePage: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const steps: EdaStep[] = [
    {
      step: 1,
      title: 'Data Collection & Ingestion',
      category: 'Stage 1: Collection',
      description: 'Loading the student academic performance dataset containing 500 records and 16 features from CSV format into an analytical DataFrame.',
      pythonSnippet: `import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv('student_academic_performance_500.csv')
print("Dataset Shape:", df.shape)
print("Features:", df.columns.tolist())
df.head()`,
      findings: 'Successfully loaded 500 student records across 16 academic, demographic, and behavioral columns.',
    },
    {
      step: 2,
      title: 'Data Cleaning & Verification',
      category: 'Stage 2: Cleaning',
      description: 'Auditing missing values, checking data type conformity, testing primary key uniqueness, and verifying zero duplicate rows.',
      pythonSnippet: `# Check for null values
null_counts = df.isnull().sum()
print("Missing values per column:\n", null_counts)

# Check duplicate Student IDs
duplicates = df['Student_ID'].duplicated().sum()
print("Duplicate Student IDs:", duplicates)

# Validate data types
print(df.dtypes)`,
      findings: 'Zero missing values (df.isnull().sum() == 0) and zero duplicate primary keys. 100% data completeness.',
    },
    {
      step: 3,
      title: 'Data Preparation & Transformation',
      category: 'Stage 3: Preparation',
      description: 'Categorical encoding, range standardization, and setting up numeric vectors for statistical computations.',
      pythonSnippet: `# Identify numerical & categorical columns
num_cols = ['Age', 'Attendance_Percentage', 'Study_Hours_Per_Day',
            'Assignment_Score', 'Internal_Marks', 'Previous_Semester_GPA',
            'Sleep_Hours_Per_Day', 'Final_Marks']

cat_cols = ['Gender', 'Department', 'Parent_Education',
            'Internet_Access', 'Extracurricular_Activities', 'Grade', 'Pass_Fail']

# Categorical distributions
for col in cat_cols:
    print(f"\\n--- {col} ---")
    print(df[col].value_counts(normalize=True).round(3) * 100)`,
      findings: 'Identified 8 continuous numeric variables and 8 categorical attributes. 6 branches with CSE leading enrollment.',
    },
    {
      step: 4,
      title: 'Descriptive Statistics Computation',
      category: 'Stage 4: Summary Statistics',
      description: 'Calculating central tendency (mean, median), dispersion (standard deviation, variance), and five-number summary (min, Q1, median, Q3, max).',
      pythonSnippet: `# Compute 5-number summary & standard deviations
desc_stats = df[num_cols].describe().T[['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']]
desc_stats['IQR'] = desc_stats['75%'] - desc_stats['25%']
print(desc_stats.round(2))`,
      findings: 'Cohort average marks = 71.59 (std = 8.66), average attendance = 82.43%, daily study = 3.81 hrs, previous GPA = 7.43.',
    },
    {
      step: 5,
      title: 'Univariate Analysis',
      category: 'Stage 5: Univariate EDA',
      description: 'Visualizing single-variable distributions using histograms, kernel density estimations (KDE), and bar charts.',
      pythonSnippet: `import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
sns.histplot(df['Final_Marks'], kde=True, bins=15, color='royalblue')
plt.title('Final Marks Distribution')

plt.subplot(1, 2, 2)
sns.countplot(data=df, x='Grade', order=['A+', 'A', 'B', 'C', 'D', 'F'], palette='Blues_r')
plt.title('Letter Grade Distribution')
plt.tight_layout()
plt.show()`,
      findings: 'Final Marks display a near-Gaussian normal distribution centered around 71.6. Grade B constitutes the largest single academic tier.',
    },
    {
      step: 6,
      title: 'Bivariate Analysis',
      category: 'Stage 6: Bivariate EDA',
      description: 'Examining relationships between pairs of variables: Attendance vs Final Marks, Study Hours vs GPA, Sleep vs Marks.',
      pythonSnippet: `plt.figure(figsize=(10, 6))
sns.regplot(data=df, x='Attendance_Percentage', y='Final_Marks',
            scatter_kws={'alpha':0.6, 'color':'#2563eb'},
            line_kws={'color':'#dc2626', 'linewidth':2})
plt.title('Attendance % vs Final Marks with OLS Trendline')
plt.xlabel('Attendance Percentage (%)')
plt.ylabel('Final Examination Marks')
plt.show()`,
      findings: 'Attendance shows strong positive correlation with final marks. Trendline confirms students above 90% attendance achieve significant score premiums.',
    },
    {
      step: 7,
      title: 'Multivariate & Demographic Analysis',
      category: 'Stage 7: Multivariate EDA',
      description: 'Disaggregating academic metrics across branches, gender, parental education, and digital access levels.',
      pythonSnippet: `# Department-wise academic aggregation
dept_summary = df.groupby('Department').agg({
    'Final_Marks': ['mean', 'max'],
    'Attendance_Percentage': 'mean',
    'Previous_Semester_GPA': 'mean',
    'Student_ID': 'count'
}).round(2)
print("Department Standings:\n", dept_summary)`,
      findings: 'CSE and IT achieve leading departmental marks; performance remains resilient across parental education and extracurricular status.',
    },
    {
      step: 8,
      title: 'Correlation Matrix & Heatmap',
      category: 'Stage 8: Statistical Correlation',
      description: 'Computing Pearson product-moment correlation matrix and plotting heatmap to pinpoint primary determinants of success.',
      pythonSnippet: `corr_matrix = df[num_cols].corr()

plt.figure(figsize=(9, 7))
sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='Blues', vmin=-1, vmax=1)
plt.title('Pearson Correlation Heatmap (8 Numerical Variables)')
plt.show()`,
      findings: 'Internal Marks, Attendance %, and Study Hours display the highest positive correlations with Final Examination Marks.',
    },
    {
      step: 9,
      title: 'Outlier & Anomaly Detection',
      category: 'Stage 9: Outliers',
      description: 'Applying John Tukey’s IQR fences (1.5 × IQR) to flag anomalies and at-risk students requiring early faculty intervention.',
      pythonSnippet: `for col in num_cols:
    q1 = df[col].quantile(0.25)
    q3 = df[col].quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    outliers = df[(df[col] < lower) | (df[col] > upper)]
    print(f"{col}: {len(outliers)} outliers detected ({len(outliers)/len(df)*100:.1f}%)")`,
      findings: 'Only minor outlier counts identified, confirming high data coherence with realistic educational variation.',
    },
    {
      step: 10,
      title: 'Synthesis, Conclusion & Insights',
      category: 'Stage 10: Conclusion',
      description: 'Deriving actionable pedagogical recommendations, institutional insights, and predictive indicators for academic enhancement.',
      pythonSnippet: `# Key algorithmic conclusions
high_att_marks = df[df['Attendance_Percentage'] >= 90]['Final_Marks'].mean()
low_att_marks = df[df['Attendance_Percentage'] < 75]['Final_Marks'].mean()
print(f"Attendance Delta: +{high_att_marks - low_att_marks:.2f} marks")

high_study_marks = df[df['Study_Hours_Per_Day'] >= 5]['Final_Marks'].mean()
low_study_marks = df[df['Study_Hours_Per_Day'] < 2.5]['Final_Marks'].mean()
print(f"Study Delta: +{high_study_marks - low_study_marks:.2f} marks")`,
      findings: 'Data confirms attendance and consistent daily study as the primary modifiable levers for improving student academic achievement.',
    },
  ];

  const currentStep = steps[activeStepIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentStep.pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-blue-600" /> Python EDA Workflow &amp; Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Step-by-step Exploratory Data Analysis methodology with executable Python code snippets (Pandas, NumPy, Seaborn).
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map((st, idx) => (
            <button
              key={st.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeStepIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeStepIndex === idx
                    ? 'bg-white text-blue-600'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {st.step}
              </span>
              <span>{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Explanation Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentStep.category}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Step {currentStep.step} of 10
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentStep.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              Observed Analytical Outcome:
            </h4>
            <p className="text-xs text-blue-950/80 dark:text-blue-200/80 leading-relaxed">
              {currentStep.findings}
            </p>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              Previous Step
            </button>
            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Python Code Snippet Terminal */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  eda_pipeline_step_{currentStep.step}.py
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-96">
              <pre>
                <code>{currentStep.pythonSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="p-3 bg-slate-900/50 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dependencies: pandas &bull; numpy &bull; matplotlib &bull; seaborn</span>
            <span className="text-emerald-400">Validated with Python 3.12+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
