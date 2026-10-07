# Student Academic Performance Analytics
### Exploratory Data Analysis Using Python & Interactive Modern Web Dashboard

> **Academic Capstone & Demonstration Dashboard — B.Tech IT**  
> An end-to-end, production-quality Exploratory Data Analysis (EDA) system built on an empirical cohort of **500 engineering students** across 16 academic, behavioral, and demographic features.

---

## 🚀 Quick Start Guide

### 1. Launch the Interactive Web Dashboard
```bash
cd "C:\Users\sarav\.gemini\antigravity-ide\scratch\student-performance-analytics"
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

### 2. Run the Standalone Python EDA Script
During Viva or technical project demonstration, execute the Python EDA pipeline in your terminal:
```bash
python eda_student_performance.py
```

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📊 Dataset Profile

- **Source File**: `student_academic_performance_500.csv`
- **Total Records**: 500 Students
- **Total Attributes**: 16 Features (8 continuous numerical, 8 categorical)
- **Data Integrity**: 100% complete — **0 missing values, 0 duplicate records**
- **Departments Analyzed**: CSE (125), IT (81), ECE (80), EEE (80), MECH (75), CIVIL (59)

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Data Science & EDA** | Python 3.12, Pandas, NumPy, Matplotlib, Seaborn, SciPy |
| **Frontend Framework** | React 19, TypeScript |
| **Build & Tooling** | Vite 8, Tailwind CSS v4, PostCSS |
| **Data Visualizations** | Recharts (Responsive SVG Charts, Histograms, Scatter & Donut) |
| **Icons & UI System** | Lucide React |

---

## 📑 Feature Modules & Architecture

1. **Overview Dashboard**
   - 8 dynamic KPI cards (Total Students, Mean Final Marks, Mean GPA, Mean Attendance, Pass Rate, Daily Study, Max Mark, Min Mark).
   - Grade Distribution (A+, A, B, C, D, F) Bar Chart.
   - Final Marks 10-point interval Histogram.
   - Pass vs Fail Donut Chart.

2. **GPA & CGPA Calculator (LICET Regulations 2024)**
   - **Credit-Weighted Calculation**: $\text{Weighted Grade Points} = \text{Credits} \times \text{Grade Point}$.
   - **Semester GPA**: $\text{GPA} = \frac{\sum (\text{Credits} \times \text{Grade Point})}{\sum \text{Credits}}$ for eligible curricular courses.
   - **Cumulative CGPA**: $\text{CGPA} = \frac{\sum (\text{Credits} \times \text{Grade Point})}{\sum \text{Credits}}$ across all semesters (strictly NOT a simple average of GPAs).
   - **Grade Scheme**: O (10), A+ (9), A (8), B+ (7), B (6), C (5), U (Excluded), SA (Excluded).
   - **Eligibility Filters**: Automatically excludes Additional/Hons./Minor courses and U/SA grades from normal GPA. Allows Hons./Minor inclusion when requirement verified.
   - **Multi-Semester Management**: Add Semesters 1 through 8, dynamic course additions/removals with confirmation, real-time recalculation.
   - **Visual Progress & Breakdown**: GPA line trajectory chart, student grade distribution bar chart, and step-by-step arithmetic transparency breakdown accordions.
   - Previous Semester GPA distribution.
   - Department standings table & Top 5 scorers preview.

2. **Interactive Student Data Explorer**
   - Search by Student ID (e.g., `STU001`) or Department.
   - Multi-column sorting (ascending/descending).
   - Configurable column visibility toggles.
   - Pagination (10, 20, 50, 100 per page).
   - Visual badges for at-risk learners and honors performers.
   - Full CSV export of active or filtered records.

3. **Student Profile Modal**
   - Click any student row or scatter point to inspect their full academic dossier.
   - Comparison benchmark bars (Student vs Department Mean vs Cohort Mean).
   - Behavioral & demographic background (Study hours, sleep, parental education, connectivity).
   - Risk indicator diagnostics.

4. **Attendance vs Final Marks Analysis**
   - Scatter plot with Ordinary Least Squares (OLS) linear regression trendline ($R^2$ variance explained).
   - Attendance shortage (<75%) vs High Attendance (≥90%) score delta calculation.
   - Empirically computed insight card.

5. **Study & Lifestyle Habits**
   - Bivariate scatter: Study Hours vs Final Marks ($r = +0.49$).
   - Study Hours vs Previous GPA.
   - Sleep duration frequency distribution and correlation analysis.

6. **Department Comparative Analytics**
   - Comparative bar charts for Average Marks, GPA, Attendance, and Pass %.
   - Interactive sortable department performance table.

7. **Demographics & Socio-Academic Factors**
   - Gender comparison (Male vs Female grouped metrics).
   - Parental education breakdown (School, Diploma, UG, PG).
   - Internet access quality impact (Poor, Average, Good, Excellent).
   - Extracurricular activity participation analysis.

8. **Pearson Correlation Matrix Heatmap**
   - 8×8 interactive matrix for all continuous numerical features.
   - Click any variable to see its strongest positive and negative correlates.
   - Color intensity coded by correlation coefficient strength.

9. **Descriptive Statistics & Outlier Detection**
   - 5-number summary: Mean, Median, Std Dev, Min, Max, Q1, Q3, IQR.
   - Tukey's 1.5×IQR outlier detection with lower and upper fences.
   - Identified outlier student records and visual box-plot spread.

10. **Automated Algorithmic Insights Engine**
    - Categorized into *Performance Insights*, *Attention Required*, *Key Findings*, and *Recommendations*.
    - Automated At-Risk identification using transparent educational rules (Marks < 50, Attendance < 75%, GPA < 5.50).
    - Top 10 Academic Performers Leaderboard.

11. **Data Quality & Schema Profiling**
    - Audit confirmation of 0 missing values and schema dictionary.

12. **Python EDA Pipeline & Code Viewer**
    - 10-step visual methodology with runnable Python snippets and copy-to-clipboard functionality.

13. **About Project (B.Tech IT Academic Capstone)**
    - Project objectives, scope, methodology, educational implications, and viva preparation summary.

---

## 🎨 Design & Accessibility Highlights

- **Dark & Light Mode**: Seamless theme toggle persisted in `localStorage`.
- **Global Multi-Filter System**: Filter by branch, gender, grade, pass status, parent education, internet access, and numerical sliders for attendance, study hours, GPA, and marks.
- **Export Capabilities**: Instant CSV downloads of filtered datasets or department summaries, plus full-dashboard print/PDF support.
- **Zero Hardcoding**: All numbers, averages, correlations, regressions, and insights are dynamically computed from dataset records.
