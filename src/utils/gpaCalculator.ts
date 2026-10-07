import {
  LetterGrade,
  CourseType,
  CourseEntry,
  SemesterData,
  StudentCalculatorProfile,
} from '../types';

/**
 * LICET Regulations 2024 Grade Point Configuration
 * Centralized mapping to allow easy institutional modification.
 */
export const LICET_2024_GRADE_MAPPING: Record<
  LetterGrade,
  { gradePoint: number | null; isEligible: boolean; description: string }
> = {
  'O': { gradePoint: 10, isEligible: true, description: 'Outstanding (91-100)' },
  'A+': { gradePoint: 9, isEligible: true, description: 'Excellent (81-90)' },
  'A': { gradePoint: 8, isEligible: true, description: 'Very Good (71-80)' },
  'B+': { gradePoint: 7, isEligible: true, description: 'Good (61-70)' },
  'B': { gradePoint: 6, isEligible: true, description: 'Average (50-60)' },
  'C': { gradePoint: 5, isEligible: true, description: 'Satisfactory (Pass)' },
  'U': { gradePoint: null, isEligible: false, description: 'Re-appearance (Excluded)' },
  'SA': { gradePoint: null, isEligible: false, description: 'Shortage of Attendance (Excluded)' },
};

export const COURSE_TYPES: CourseType[] = [
  'Curricular Course',
  'Additional Course',
  'Hons. Course',
  'Minor Course',
];

export const ALL_LETTER_GRADES: LetterGrade[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U', 'SA'];

/**
 * Determine grade point from letter grade
 */
export function getGradePoint(grade: LetterGrade | ''): number | null {
  if (!grade || !LICET_2024_GRADE_MAPPING[grade]) return null;
  return LICET_2024_GRADE_MAPPING[grade].gradePoint;
}

export interface CourseEligibilityStatus {
  includeInGPA: boolean;
  includeInCGPA: boolean;
  exclusionReasonGPA: string | null;
  exclusionReasonCGPA: string | null;
  gradePoint: number | null;
  weightedPoints: number;
}

/**
 * Evaluates whether an individual course is eligible for Semester GPA and Cumulative CGPA
 * strictly adhering to LICET Regulations 2024.
 */
export function evaluateCourseEligibility(
  course: CourseEntry,
  honsMinorCompleted = false
): CourseEligibilityStatus {
  const gradePoint = getGradePoint(course.grade);
  const isValidGrade =
    course.grade !== '' &&
    course.grade !== 'U' &&
    course.grade !== 'SA' &&
    gradePoint !== null;

  const hasValidCredits = typeof course.credits === 'number' && course.credits > 0;

  // GPA Eligibility: Only Curricular Course AND Grade not U/SA AND Credits > 0
  let includeInGPA = false;
  let exclusionReasonGPA: string | null = null;

  if (course.courseType !== 'Curricular Course') {
    exclusionReasonGPA = `Excluded — ${course.courseType}`;
  } else if (!course.grade) {
    exclusionReasonGPA = 'Grade Pending';
  } else if (course.grade === 'U') {
    exclusionReasonGPA = 'Excluded — U Grade (Re-appearance)';
  } else if (course.grade === 'SA') {
    exclusionReasonGPA = 'Excluded — SA Grade (Shortage of Attendance)';
  } else if (!hasValidCredits) {
    exclusionReasonGPA = 'Invalid Credits (Must be > 0)';
  } else {
    includeInGPA = true;
  }

  // CGPA Eligibility:
  // By default: Same as GPA (only Curricular Courses)
  // If honsMinorCompleted === true: allows additional/Hons/Minor courses that have valid grades
  let includeInCGPA = false;
  let exclusionReasonCGPA: string | null = null;

  if (!isValidGrade) {
    if (!course.grade) exclusionReasonCGPA = 'Grade Pending';
    else if (course.grade === 'U') exclusionReasonCGPA = 'Excluded — U Grade';
    else if (course.grade === 'SA') exclusionReasonCGPA = 'Excluded — SA Grade';
  } else if (!hasValidCredits) {
    exclusionReasonCGPA = 'Invalid Credits';
  } else {
    if (course.courseType === 'Curricular Course') {
      includeInCGPA = true;
    } else {
      if (honsMinorCompleted) {
        includeInCGPA = true;
      } else {
        exclusionReasonCGPA = `Excluded — ${course.courseType} (Hons./Minor not completed)`;
      }
    }
  }

  const weightedPoints =
    includeInGPA && gradePoint !== null && hasValidCredits
      ? Number((course.credits * gradePoint).toFixed(2))
      : 0;

  return {
    includeInGPA,
    includeInCGPA,
    exclusionReasonGPA,
    exclusionReasonCGPA,
    gradePoint,
    weightedPoints,
  };
}

export interface SemesterCalculationDetails {
  semesterNumber: number;
  semesterName: string;
  totalCoursesEntered: number;
  eligibleCoursesCount: number;
  excludedCoursesCount: number;
  eligibleCredits: number;
  totalWeightedPoints: number;
  gpa: number;
  isValid: boolean;
  validationErrors: string[];
}

/**
 * Calculates Semester GPA based on LICET Regulations 2024:
 * GPA = Σ(Course Credits × Grade Point) / Σ(Credits)
 * for all eligible curricular courses.
 */
export function calculateSemesterGPA(
  semester: SemesterData,
  honsMinorCompleted = false
): SemesterCalculationDetails {
  const errors: string[] = [];
  let eligibleCredits = 0;
  let totalWeightedPoints = 0;
  let eligibleCoursesCount = 0;
  let excludedCoursesCount = 0;

  semester.courses.forEach((course, index) => {
    // Validation checks
    const courseRef = course.courseCode || `Course #${index + 1}`;
    if (!course.courseCode.trim()) {
      errors.push(`${courseRef}: Course Code is required.`);
    }
    if (!course.courseName.trim()) {
      errors.push(`${courseRef}: Course Name is required.`);
    }
    if (typeof course.credits !== 'number' || course.credits <= 0) {
      errors.push(`${courseRef}: Credits must be greater than 0.`);
    }
    if (!course.grade) {
      errors.push(`${courseRef}: Please select a valid letter grade.`);
    }

    const status = evaluateCourseEligibility(course, honsMinorCompleted);

    if (status.includeInGPA && status.gradePoint !== null) {
      eligibleCredits += course.credits;
      totalWeightedPoints += course.credits * status.gradePoint;
      eligibleCoursesCount++;
    } else {
      excludedCoursesCount++;
    }
  });

  const gpa =
    eligibleCredits > 0
      ? Number((totalWeightedPoints / eligibleCredits).toFixed(2))
      : 0.0;

  return {
    semesterNumber: semester.semesterNumber,
    semesterName: semester.semesterName,
    totalCoursesEntered: semester.courses.length,
    eligibleCoursesCount,
    excludedCoursesCount,
    eligibleCredits,
    totalWeightedPoints: Number(totalWeightedPoints.toFixed(2)),
    gpa,
    isValid: errors.length === 0,
    validationErrors: errors,
  };
}

export interface CgpaSummaryResult {
  cgpa: number;
  totalCumulativeCredits: number;
  totalCumulativeWeightedPoints: number;
  semesters: SemesterCalculationDetails[];
  highestGpaSemester: { name: string; gpa: number } | null;
  lowestGpaSemester: { name: string; gpa: number } | null;
  gradeDistribution: { grade: LetterGrade; count: number; points: number | null }[];
  excludedGradesCount: { uCount: number; saCount: number };
}

/**
 * Calculates Cumulative CGPA:
 * CGPA = Σ(Credits × Grade Points across all semesters) / Σ(Credits across all semesters)
 * Strictly does NOT compute average of semester GPAs!
 */
export function calculateCumulativeCGPA(
  semesters: SemesterData[],
  honsMinorCompleted = false
): CgpaSummaryResult {
  let totalCumulativeCredits = 0;
  let totalCumulativeWeightedPoints = 0;

  const gradeCounts: Record<LetterGrade, number> = {
    'O': 0,
    'A+': 0,
    'A': 0,
    'B+': 0,
    'B': 0,
    'C': 0,
    'U': 0,
    'SA': 0,
  };

  const semesterCalculations = semesters.map((sem) => {
    // For CGPA, accumulate credits and points for all eligible courses in this semester
    sem.courses.forEach((c) => {
      if (c.grade && gradeCounts[c.grade] !== undefined) {
        gradeCounts[c.grade]++;
      }

      const status = evaluateCourseEligibility(c, honsMinorCompleted);
      if (status.includeInCGPA && status.gradePoint !== null && c.credits > 0) {
        totalCumulativeCredits += c.credits;
        totalCumulativeWeightedPoints += c.credits * status.gradePoint;
      }
    });

    return calculateSemesterGPA(sem, honsMinorCompleted);
  });

  const cgpa =
    totalCumulativeCredits > 0
      ? Number((totalCumulativeWeightedPoints / totalCumulativeCredits).toFixed(2))
      : 0.0;

  // Find highest and lowest GPA semesters with valid credits
  const validSems = semesterCalculations.filter((s) => s.eligibleCredits > 0);
  let highestGpaSemester: { name: string; gpa: number } | null = null;
  let lowestGpaSemester: { name: string; gpa: number } | null = null;

  if (validSems.length > 0) {
    const sorted = [...validSems].sort((a, b) => b.gpa - a.gpa);
    highestGpaSemester = { name: sorted[0].semesterName, gpa: sorted[0].gpa };
    lowestGpaSemester = {
      name: sorted[sorted.length - 1].semesterName,
      gpa: sorted[sorted.length - 1].gpa,
    };
  }

  const gradeDistribution = ALL_LETTER_GRADES.map((g) => ({
    grade: g,
    count: gradeCounts[g] || 0,
    points: LICET_2024_GRADE_MAPPING[g].gradePoint,
  }));

  return {
    cgpa,
    totalCumulativeCredits,
    totalCumulativeWeightedPoints: Number(totalCumulativeWeightedPoints.toFixed(2)),
    semesters: semesterCalculations,
    highestGpaSemester,
    lowestGpaSemester,
    gradeDistribution,
    excludedGradesCount: {
      uCount: gradeCounts['U'] || 0,
      saCount: gradeCounts['SA'] || 0,
    },
  };
}

/**
 * Preloaded Sample LICET Curriculum Data for quick one-click testing
 */
export function getSampleLicetData(): {
  profile: StudentCalculatorProfile;
  semesters: SemesterData[];
} {
  return {
    profile: {
      name: 'Saravanan K',
      registerNumber: '311124205001',
      department: 'IT',
      regulation: '2024',
      currentSemester: 3,
      honsMinorCompleted: false,
    },
    semesters: [
      {
        semesterNumber: 1,
        semesterName: 'Semester 1',
        courses: [
          {
            id: 's1-c1',
            courseCode: 'MA24101',
            courseName: 'Matrices and Calculus',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's1-c2',
            courseCode: 'PH24101',
            courseName: 'Engineering Physics',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'A+',
          },
          {
            id: 's1-c3',
            courseCode: 'GE24101',
            courseName: 'Problem Solving and Python Programming',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'A',
          },
          {
            id: 's1-c4',
            courseCode: 'GE24102',
            courseName: 'Python Programming Laboratory',
            credits: 2,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's1-c5',
            courseCode: 'HS24101',
            courseName: 'Communicative English',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'A',
          },
          {
            id: 's1-c6',
            courseCode: 'GE24103',
            courseName: 'Engineering Graphics',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'B+',
          },
          {
            id: 's1-c7',
            courseCode: 'AD24101',
            courseName: 'French for Engineers (Additional)',
            credits: 2,
            courseType: 'Additional Course',
            grade: 'A+',
          },
        ],
      },
      {
        semesterNumber: 2,
        semesterName: 'Semester 2',
        courses: [
          {
            id: 's2-c1',
            courseCode: 'MA24201',
            courseName: 'Statistics and Numerical Methods',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'A+',
          },
          {
            id: 's2-c2',
            courseCode: 'IT24201',
            courseName: 'Data Structures and Algorithms',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's2-c3',
            courseCode: 'IT24202',
            courseName: 'Data Structures Laboratory',
            credits: 2,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's2-c4',
            courseCode: 'EE24201',
            courseName: 'Basic Electrical and Electronics Engineering',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'B+',
          },
          {
            id: 's2-c5',
            courseCode: 'CY24201',
            courseName: 'Environmental Science and Engineering',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'A',
          },
          {
            id: 's2-c6',
            courseCode: 'GE24201',
            courseName: 'Engineering Practices Laboratory',
            credits: 2,
            courseType: 'Curricular Course',
            grade: 'A+',
          },
        ],
      },
      {
        semesterNumber: 3,
        semesterName: 'Semester 3',
        courses: [
          {
            id: 's3-c1',
            courseCode: 'IT24301',
            courseName: 'Database Management Systems',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'A+',
          },
          {
            id: 's3-c2',
            courseCode: 'IT24302',
            courseName: 'Design and Analysis of Algorithms',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'A',
          },
          {
            id: 's3-c3',
            courseCode: 'IT24303',
            courseName: 'Object Oriented Programming in Java',
            credits: 3,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's3-c4',
            courseCode: 'MA24301',
            courseName: 'Discrete Mathematics',
            credits: 4,
            courseType: 'Curricular Course',
            grade: 'B+',
          },
          {
            id: 's3-c5',
            courseCode: 'IT24304',
            courseName: 'DBMS Laboratory',
            credits: 2,
            courseType: 'Curricular Course',
            grade: 'O',
          },
          {
            id: 's3-c6',
            courseCode: 'MN24301',
            courseName: 'Cyber Security Essentials (Minor)',
            credits: 3,
            courseType: 'Minor Course',
            grade: 'A',
          },
        ],
      },
    ],
  };
}
