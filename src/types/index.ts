export interface StudentRecord {
  Student_ID: string;
  Age: number;
  Gender: 'Male' | 'Female' | string;
  Department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | string;
  Attendance_Percentage: number;
  Study_Hours_Per_Day: number;
  Assignment_Score: number;
  Internal_Marks: number;
  Previous_Semester_GPA: number;
  Parent_Education: 'School' | 'Diploma' | 'UG' | 'PG' | string;
  Internet_Access: 'Poor' | 'Average' | 'Good' | 'Excellent' | string;
  Extracurricular_Activities: 'Yes' | 'No' | string;
  Sleep_Hours_Per_Day: number;
  Final_Marks: number;
  Grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' | string;
  Pass_Fail: 'Pass' | 'Fail' | string;
}

export type NumericalVariableKey =
  | 'Age'
  | 'Attendance_Percentage'
  | 'Study_Hours_Per_Day'
  | 'Assignment_Score'
  | 'Internal_Marks'
  | 'Previous_Semester_GPA'
  | 'Sleep_Hours_Per_Day'
  | 'Final_Marks';

export interface FilterState {
  search: string;
  departments: string[];
  genders: string[];
  grades: string[];
  passFail: string[];
  parentEducation: string[];
  internetAccess: string[];
  extracurricular: string[];
  attendanceRange: [number, number];
  studyHoursRange: [number, number];
  gpaRange: [number, number];
  finalMarksRange: [number, number];
  sleepHoursRange: [number, number];
}

export interface DescriptiveStats {
  variable: string;
  label: string;
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
  outliersCount: number;
  outlierPercentage: number;
  outliers: number[];
}

export interface DepartmentStat {
  department: string;
  count: number;
  avgMarks: number;
  avgGPA: number;
  avgAttendance: number;
  avgStudyHours: number;
  passRate: number;
  highestMark: number;
  lowestMark: number;
  maleCount: number;
  femaleCount: number;
}

export interface CorrelationItem {
  var1: string;
  var2: string;
  correlation: number;
  strength: 'Strong Positive' | 'Moderate Positive' | 'Weak / None' | 'Moderate Negative' | 'Strong Negative';
}

export interface AtRiskStudent {
  student: StudentRecord;
  riskReasons: string[];
  riskSeverity: 'High' | 'Medium' | 'Low';
}

export interface AlgorithmicInsight {
  id: string;
  category: 'performance' | 'attention' | 'finding' | 'recommendation';
  title: string;
  message: string;
  metricLabel?: string;
  metricValue?: string;
  impact: 'High' | 'Medium' | 'Neutral';
}

export type LetterGrade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'U' | 'SA';

export type CourseType =
  | 'Curricular Course'
  | 'Additional Course'
  | 'Hons. Course'
  | 'Minor Course';

export interface CourseEntry {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  courseType: CourseType;
  grade: LetterGrade | '';
}

export interface SemesterData {
  semesterNumber: number;
  semesterName: string;
  courses: CourseEntry[];
}

export interface StudentCalculatorProfile {
  name: string;
  registerNumber: string;
  department: string;
  regulation: string;
  currentSemester: number;
  honsMinorCompleted: boolean;
}

export type ActiveTab =
  | 'overview'
  | 'gpa_calculator'
  | 'students'
  | 'performance'
  | 'attendance'
  | 'study_lifestyle'
  | 'department'
  | 'demographics'
  | 'correlation'
  | 'statistics'
  | 'data_quality'
  | 'eda_pipeline'
  | 'insights'
  | 'about';

