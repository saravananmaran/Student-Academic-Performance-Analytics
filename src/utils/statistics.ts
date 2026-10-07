import {
  StudentRecord,
  NumericalVariableKey,
  FilterState,
  DescriptiveStats,
  DepartmentStat,
  CorrelationItem,
  AtRiskStudent,
  AlgorithmicInsight,
} from '../types';

export const NUMERICAL_VARIABLES: { key: NumericalVariableKey; label: string; unit: string }[] = [
  { key: 'Age', label: 'Age', unit: 'yrs' },
  { key: 'Attendance_Percentage', label: 'Attendance', unit: '%' },
  { key: 'Study_Hours_Per_Day', label: 'Study Hours', unit: 'hrs/day' },
  { key: 'Assignment_Score', label: 'Assignment Score', unit: 'pts' },
  { key: 'Internal_Marks', label: 'Internal Marks', unit: 'pts' },
  { key: 'Previous_Semester_GPA', label: 'Previous GPA', unit: 'GPA' },
  { key: 'Sleep_Hours_Per_Day', label: 'Sleep Hours', unit: 'hrs/day' },
  { key: 'Final_Marks', label: 'Final Marks', unit: 'marks' },
];

export function calculateMean(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Number((sum / values.length).toFixed(2));
}

export function calculateMedian(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return Number(median.toFixed(2));
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Number(Math.sqrt(variance).toFixed(2));
}

export function calculateQuantile(values: number[], q: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return Number((sorted[base] + rest * (sorted[base + 1] - sorted[base])).toFixed(2));
  }
  return Number(sorted[base].toFixed(2));
}

export function calculateIQR(values: number[]): {
  q1: number;
  q3: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
} {
  const q1 = calculateQuantile(values, 0.25);
  const q3 = calculateQuantile(values, 0.75);
  const iqr = Number((q3 - q1).toFixed(2));
  const lowerBound = Number((q1 - 1.5 * iqr).toFixed(2));
  const upperBound = Number((q3 + 1.5 * iqr).toFixed(2));
  return { q1, q3, iqr, lowerBound, upperBound };
}

export function findOutliers(values: number[]): number[] {
  const { lowerBound, upperBound } = calculateIQR(values);
  return values.filter((val) => val < lowerBound || val > upperBound);
}

export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  return Number((numerator / denominator).toFixed(4));
}

export function calculateLinearRegression(
  x: number[],
  y: number[]
): { slope: number; intercept: number; r2: number; correlation: number } {
  if (x.length !== y.length || x.length < 2) {
    return { slope: 0, intercept: 0, r2: 0, correlation: 0 };
  }
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    den += dx * dx;
  }

  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;
  const r = calculateCorrelation(x, y);
  const r2 = Number((r * r).toFixed(4));

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    r2,
    correlation: r,
  };
}

export function calculateStatistics(
  variableKey: NumericalVariableKey,
  label: string,
  values: number[]
): DescriptiveStats {
  if (!values.length) {
    return {
      variable: variableKey,
      label,
      count: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      lowerBound: 0,
      upperBound: 0,
      outliersCount: 0,
      outlierPercentage: 0,
      outliers: [],
    };
  }

  const count = values.length;
  const mean = calculateMean(values);
  const median = calculateMedian(values);
  const stdDev = calculateStandardDeviation(values);
  const min = Number(Math.min(...values).toFixed(2));
  const max = Number(Math.max(...values).toFixed(2));
  const { q1, q3, iqr, lowerBound, upperBound } = calculateIQR(values);
  const outliers = findOutliers(values);
  const outliersCount = outliers.length;
  const outlierPercentage = Number(((outliersCount / count) * 100).toFixed(2));

  return {
    variable: variableKey,
    label,
    count,
    mean,
    median,
    stdDev,
    min,
    max,
    q1,
    q3,
    iqr,
    lowerBound,
    upperBound,
    outliersCount,
    outlierPercentage,
    outliers,
  };
}

export function calculatePassRate(students: StudentRecord[]): number {
  if (!students.length) return 0;
  const passCount = students.filter((s) => s.Pass_Fail === 'Pass').length;
  return Number(((passCount / students.length) * 100).toFixed(2));
}

export function groupByDepartment(students: StudentRecord[]): DepartmentStat[] {
  const depts = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const grouped: Record<string, StudentRecord[]> = {};

  depts.forEach((d) => {
    grouped[d] = [];
  });

  students.forEach((s) => {
    if (!grouped[s.Department]) {
      grouped[s.Department] = [];
    }
    grouped[s.Department].push(s);
  });

  return Object.keys(grouped)
    .filter((dept) => grouped[dept].length > 0)
    .map((dept) => {
      const deptStudents = grouped[dept];
      const count = deptStudents.length;
      const marks = deptStudents.map((s) => s.Final_Marks);
      const gpas = deptStudents.map((s) => s.Previous_Semester_GPA);
      const attendances = deptStudents.map((s) => s.Attendance_Percentage);
      const studyHours = deptStudents.map((s) => s.Study_Hours_Per_Day);

      const passCount = deptStudents.filter((s) => s.Pass_Fail === 'Pass').length;
      const passRate = count > 0 ? Number(((passCount / count) * 100).toFixed(2)) : 0;
      const maleCount = deptStudents.filter((s) => s.Gender === 'Male').length;
      const femaleCount = deptStudents.filter((s) => s.Gender === 'Female').length;

      return {
        department: dept,
        count,
        avgMarks: calculateMean(marks),
        avgGPA: calculateMean(gpas),
        avgAttendance: calculateMean(attendances),
        avgStudyHours: calculateMean(studyHours),
        passRate,
        highestMark: marks.length ? Math.max(...marks) : 0,
        lowestMark: marks.length ? Math.min(...marks) : 0,
        maleCount,
        femaleCount,
      };
    })
    .sort((a, b) => b.avgMarks - a.avgMarks);
}

export function groupByGrade(students: StudentRecord[]): { grade: string; count: number; percentage: number; color: string }[] {
  const gradeOrder = ['A+', 'A', 'B', 'C', 'D', 'F'];
  const colors: Record<string, string> = {
    'A+': '#10b981', // emerald
    'A': '#3b82f6',  // blue
    'B': '#6366f1',  // indigo
    'C': '#f59e0b',  // amber
    'D': '#f97316',  // orange
    'F': '#ef4444',  // red
  };

  const counts: Record<string, number> = {};
  gradeOrder.forEach((g) => {
    counts[g] = 0;
  });

  students.forEach((s) => {
    if (counts[s.Grade] !== undefined) {
      counts[s.Grade]++;
    } else {
      counts[s.Grade] = (counts[s.Grade] || 0) + 1;
    }
  });

  const total = students.length || 1;
  return gradeOrder.map((g) => ({
    grade: g,
    count: counts[g] || 0,
    percentage: Number((((counts[g] || 0) / total) * 100).toFixed(1)),
    color: colors[g] || '#6b7280',
  }));
}

export function filterStudents(students: StudentRecord[], filters: FilterState): StudentRecord[] {
  return students.filter((student) => {
    // Search filter
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      const matchId = student.Student_ID.toLowerCase().includes(term);
      const matchDept = student.Department.toLowerCase().includes(term);
      const matchGrade = student.Grade.toLowerCase().includes(term);
      if (!matchId && !matchDept && !matchGrade) return false;
    }

    // Departments
    if (filters.departments.length > 0 && !filters.departments.includes(student.Department)) {
      return false;
    }

    // Genders
    if (filters.genders.length > 0 && !filters.genders.includes(student.Gender)) {
      return false;
    }

    // Grades
    if (filters.grades.length > 0 && !filters.grades.includes(student.Grade)) {
      return false;
    }

    // Pass / Fail
    if (filters.passFail.length > 0 && !filters.passFail.includes(student.Pass_Fail)) {
      return false;
    }

    // Parent Education
    if (filters.parentEducation.length > 0 && !filters.parentEducation.includes(student.Parent_Education)) {
      return false;
    }

    // Internet Access
    if (filters.internetAccess.length > 0 && !filters.internetAccess.includes(student.Internet_Access)) {
      return false;
    }

    // Extracurricular
    if (filters.extracurricular.length > 0 && !filters.extracurricular.includes(student.Extracurricular_Activities)) {
      return false;
    }

    // Attendance Range
    if (
      student.Attendance_Percentage < filters.attendanceRange[0] ||
      student.Attendance_Percentage > filters.attendanceRange[1]
    ) {
      return false;
    }

    // Study Hours Range
    if (
      student.Study_Hours_Per_Day < filters.studyHoursRange[0] ||
      student.Study_Hours_Per_Day > filters.studyHoursRange[1]
    ) {
      return false;
    }

    // GPA Range
    if (
      student.Previous_Semester_GPA < filters.gpaRange[0] ||
      student.Previous_Semester_GPA > filters.gpaRange[1]
    ) {
      return false;
    }

    // Final Marks Range
    if (
      student.Final_Marks < filters.finalMarksRange[0] ||
      student.Final_Marks > filters.finalMarksRange[1]
    ) {
      return false;
    }

    // Sleep Hours Range
    if (
      student.Sleep_Hours_Per_Day < filters.sleepHoursRange[0] ||
      student.Sleep_Hours_Per_Day > filters.sleepHoursRange[1]
    ) {
      return false;
    }

    return true;
  });
}

export function identifyAtRiskStudents(students: StudentRecord[]): AtRiskStudent[] {
  return students
    .map((student) => {
      const riskReasons: string[] = [];

      if (student.Final_Marks < 50) {
        riskReasons.push(`Critically low final marks (${student.Final_Marks} < 50)`);
      }
      if (student.Attendance_Percentage < 75) {
        riskReasons.push(`Shortage of attendance (${student.Attendance_Percentage.toFixed(1)}% < 75%)`);
      }
      if (student.Previous_Semester_GPA < 5.5) {
        riskReasons.push(`Low previous semester GPA (${student.Previous_Semester_GPA.toFixed(2)} < 5.50)`);
      }
      if (student.Internal_Marks < 50) {
        riskReasons.push(`Low internal assessment marks (${student.Internal_Marks.toFixed(1)} < 50)`);
      }

      if (riskReasons.length === 0) return null;

      let riskSeverity: 'High' | 'Medium' | 'Low' = 'Low';
      if (student.Final_Marks < 50 || riskReasons.length >= 3) {
        riskSeverity = 'High';
      } else if (riskReasons.length >= 2 || student.Attendance_Percentage < 65) {
        riskSeverity = 'Medium';
      }

      return {
        student,
        riskReasons,
        riskSeverity,
      };
    })
    .filter((item): item is AtRiskStudent => item !== null)
    .sort((a, b) => {
      const rank = { High: 3, Medium: 2, Low: 1 };
      return rank[b.riskSeverity] - rank[a.riskSeverity] || a.student.Final_Marks - b.student.Final_Marks;
    });
}

export function getTopPerformers(students: StudentRecord[], topN = 10): StudentRecord[] {
  return [...students]
    .sort((a, b) => b.Final_Marks - a.Final_Marks || b.Previous_Semester_GPA - a.Previous_Semester_GPA)
    .slice(0, topN);
}

export function calculateCorrelationMatrix(students: StudentRecord[]): {
  variables: { key: NumericalVariableKey; label: string }[];
  matrix: number[][];
  flatCorrelations: CorrelationItem[];
} {
  const vars = NUMERICAL_VARIABLES;
  const n = vars.length;
  const matrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
  const flatCorrelations: CorrelationItem[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else if (j > i) {
        const x = students.map((s) => s[vars[i].key] as number);
        const y = students.map((s) => s[vars[j].key] as number);
        const corr = calculateCorrelation(x, y);
        matrix[i][j] = corr;
        matrix[j][i] = corr;

        let strength: CorrelationItem['strength'] = 'Weak / None';
        if (corr >= 0.7) strength = 'Strong Positive';
        else if (corr >= 0.3) strength = 'Moderate Positive';
        else if (corr <= -0.7) strength = 'Strong Negative';
        else if (corr <= -0.3) strength = 'Moderate Negative';

        flatCorrelations.push({
          var1: vars[i].label,
          var2: vars[j].label,
          correlation: corr,
          strength,
        });
      }
    }
  }

  flatCorrelations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

  return {
    variables: vars.map((v) => ({ key: v.key, label: v.label })),
    matrix,
    flatCorrelations,
  };
}

export function generateAlgorithmicInsights(students: StudentRecord[]): AlgorithmicInsight[] {
  if (!students.length) return [];

  const insights: AlgorithmicInsight[] = [];
  const deptStats = groupByDepartment(students);
  const total = students.length;
  const passRate = calculatePassRate(students);
  const avgAttendance = calculateMean(students.map((s) => s.Attendance_Percentage));
  const avgMarks = calculateMean(students.map((s) => s.Final_Marks));
  const avgStudy = calculateMean(students.map((s) => s.Study_Hours_Per_Day));

  // Department insights
  if (deptStats.length > 0) {
    const topDept = deptStats[0];
    const lowestDept = deptStats[deptStats.length - 1];

    insights.push({
      id: 'top-dept',
      category: 'performance',
      title: 'Top Performing Department',
      message: `${topDept.department} leads all engineering branches with an average final mark of ${topDept.avgMarks.toFixed(1)} and a ${topDept.passRate.toFixed(1)}% pass rate across ${topDept.count} enrolled students.`,
      metricLabel: `${topDept.department} Avg`,
      metricValue: `${topDept.avgMarks.toFixed(1)}`,
      impact: 'High',
    });

    if (deptStats.length > 1) {
      insights.push({
        id: 'lag-dept',
        category: 'attention',
        title: 'Department Needing Focused Intervention',
        message: `${lowestDept.department} exhibits the lowest departmental average mark at ${lowestDept.avgMarks.toFixed(1)} (lagging ${topDept.department} by ${(topDept.avgMarks - lowestDept.avgMarks).toFixed(1)} marks). Focused tutorial and remedial sessions are recommended.`,
        metricLabel: `${lowestDept.department} Avg`,
        metricValue: `${lowestDept.avgMarks.toFixed(1)}`,
        impact: 'High',
      });
    }
  }

  // Correlation with Final Marks
  const marks = students.map((s) => s.Final_Marks);
  const attendance = students.map((s) => s.Attendance_Percentage);
  const internal = students.map((s) => s.Internal_Marks);
  const assignment = students.map((s) => s.Assignment_Score);
  const study = students.map((s) => s.Study_Hours_Per_Day);
  const gpa = students.map((s) => s.Previous_Semester_GPA);

  const corrAttendance = calculateCorrelation(marks, attendance);
  const corrInternal = calculateCorrelation(marks, internal);
  const corrAssignment = calculateCorrelation(marks, assignment);
  const corrStudy = calculateCorrelation(marks, study);
  const corrGPA = calculateCorrelation(marks, gpa);

  const correlationsList = [
    { name: 'Internal Marks', val: corrInternal },
    { name: 'Attendance', val: corrAttendance },
    { name: 'Assignment Score', val: corrAssignment },
    { name: 'Study Hours', val: corrStudy },
    { name: 'Previous GPA', val: corrGPA },
  ].sort((a, b) => Math.abs(b.val) - Math.abs(a.val));

  const strongest = correlationsList[0];

  insights.push({
    id: 'strongest-factor',
    category: 'finding',
    title: 'Primary Determinant of Academic Success',
    message: `${strongest.name} exhibits the highest correlation (r = ${strongest.val >= 0 ? '+' : ''}${strongest.val.toFixed(2)}) with Final Marks, validating that continuous formative evaluation directly reflects summative examination mastery.`,
    metricLabel: 'Correlation (r)',
    metricValue: `${strongest.val >= 0 ? '+' : ''}${strongest.val.toFixed(2)}`,
    impact: 'High',
  });

  // Attendance Impact Insight
  const highAttendance = students.filter((s) => s.Attendance_Percentage >= 90);
  const lowAttendance = students.filter((s) => s.Attendance_Percentage < 75);
  const avgHighAttMarks = calculateMean(highAttendance.map((s) => s.Final_Marks));
  const avgLowAttMarks = calculateMean(lowAttendance.map((s) => s.Final_Marks));
  const diffAtt = Number((avgHighAttMarks - avgLowAttMarks).toFixed(1));

  insights.push({
    id: 'attendance-impact',
    category: 'finding',
    title: 'Attendance Direct Academic Premium',
    message: `Students maintaining ≥90% attendance achieve an average final mark of ${avgHighAttMarks.toFixed(1)}, outpacing peers below 75% attendance (${avgLowAttMarks.toFixed(1)}) by ${diffAtt} marks. Regular lecture participation shows a direct positive association.`,
    metricLabel: 'Score Delta',
    metricValue: `+${diffAtt} pts`,
    impact: 'High',
  });

  // Study Hours Threshold
  const highStudy = students.filter((s) => s.Study_Hours_Per_Day >= 5);
  const lowStudy = students.filter((s) => s.Study_Hours_Per_Day < 2.5);
  const avgHighStudyMarks = calculateMean(highStudy.map((s) => s.Final_Marks));
  const avgLowStudyMarks = calculateMean(lowStudy.map((s) => s.Final_Marks));

  insights.push({
    id: 'study-habit-impact',
    category: 'recommendation',
    title: 'Dedicated Study Hours Yield Measurable Gains',
    message: `Students devoting 5+ hours daily achieve an average of ${avgHighStudyMarks.toFixed(1)} marks versus ${avgLowStudyMarks.toFixed(1)} marks for those studying <2.5 hours. Advising students to maintain structured daily study routines will raise overall cohort performance.`,
    metricLabel: 'High vs Low Study Delta',
    metricValue: `+${(avgHighStudyMarks - avgLowStudyMarks).toFixed(1)} pts`,
    impact: 'Medium',
  });

  // At-Risk Attention
  const atRisk = identifyAtRiskStudents(students);
  insights.push({
    id: 'at-risk-count',
    category: 'attention',
    title: 'Identified At-Risk Academic Cohort',
    message: `${atRisk.length} students (${((atRisk.length / total) * 100).toFixed(1)}% of cohort) satisfy at-risk criteria (attendance < 75%, GPA < 5.5, or final mark < 50). Targeted counseling and early monitoring are strongly advised.`,
    metricLabel: 'Students At-Risk',
    metricValue: `${atRisk.length} (${((atRisk.length / total) * 100).toFixed(1)}%)`,
    impact: 'High',
  });

  // Overall Cohort Pass Rate
  insights.push({
    id: 'cohort-pass-rate',
    category: 'performance',
    title: 'Institutional Cohort Success Rate',
    message: `The active cohort demonstrates a robust pass percentage of ${passRate.toFixed(1)}% with an aggregate mean final score of ${avgMarks.toFixed(1)}/100 and overall average attendance of ${avgAttendance.toFixed(1)}%.`,
    metricLabel: 'Pass Rate',
    metricValue: `${passRate.toFixed(1)}%`,
    impact: 'Medium',
  });

  return insights;
}

export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          let value = row[fieldName] ?? '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
