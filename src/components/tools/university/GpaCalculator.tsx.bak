'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Download, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Course {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
  points: number;
}

interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

interface GradeScale {
  name: string;
  grades: { label: string; points: number }[];
}

const PRESET_SCALES: Record<string, GradeScale> = {
  'Standard US (4.0)': {
    name: 'Standard US (4.0)',
    grades: [
      { label: 'A+', points: 4.0 },
      { label: 'A', points: 4.0 },
      { label: 'A-', points: 3.7 },
      { label: 'B+', points: 3.3 },
      { label: 'B', points: 3.0 },
      { label: 'B-', points: 2.7 },
      { label: 'C+', points: 2.3 },
      { label: 'C', points: 2.0 },
      { label: 'C-', points: 1.7 },
      { label: 'D+', points: 1.3 },
      { label: 'D', points: 1.0 },
      { label: 'F', points: 0.0 },
    ],
  },
  'Pakistani (4.0)': {
    name: 'Pakistani (4.0)',
    grades: [
      { label: 'A+', points: 4.0 },
      { label: 'A', points: 4.0 },
      { label: 'B+', points: 3.5 },
      { label: 'B', points: 3.0 },
      { label: 'C+', points: 2.5 },
      { label: 'C', points: 2.0 },
      { label: 'D', points: 1.0 },
      { label: 'F', points: 0.0 },
    ],
  },
  'Honors/AP (5.0)': {
    name: 'Honors/AP (5.0)',
    grades: [
      { label: 'A+', points: 5.0 },
      { label: 'A', points: 5.0 },
      { label: 'A-', points: 4.7 },
      { label: 'B+', points: 4.3 },
      { label: 'B', points: 4.0 },
      { label: 'B-', points: 3.7 },
      { label: 'C+', points: 3.3 },
      { label: 'C', points: 3.0 },
      { label: 'C-', points: 2.7 },
      { label: 'D+', points: 2.3 },
      { label: 'D', points: 2.0 },
      { label: 'F', points: 0.0 },
    ],
  },
  'Custom': {
    name: 'Custom',
    grades: [
      { label: 'A+', points: 4.0 },
      { label: 'A', points: 4.0 },
      { label: 'B+', points: 3.5 },
      { label: 'B', points: 3.0 },
      { label: 'C+', points: 2.5 },
      { label: 'C', points: 2.0 },
      { label: 'D', points: 1.0 },
      { label: 'F', points: 0.0 },
    ],
  },
};

export default function GpaCalculator() {
  const [semesters, setSemesters] = useLocalStorage<Semester[]>('gpa-calculator', []);
  const [gradeScale, setGradeScale] = useLocalStorage<GradeScale>('gpa-grade-scale', PRESET_SCALES['Pakistani (4.0)']);
  const [customScaleName, setCustomScaleName] = useLocalStorage('gpa-custom-scale-name', '');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');

  // Recalculate custom scale if name changed
  const effectiveScale = customScaleName && gradeScale.name === 'Custom' ? { ...gradeScale, name: customScaleName } : gradeScale;

  const gradePoints: Record<string, number> = {};
  effectiveScale.grades.forEach(g => { gradePoints[g.label] = g.points; });

  useEffect(() => {
    if (semesters.length === 0) {
      addSemester();
    }
  }, []);

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      courses: [],
    };
    setSemesters([...semesters, newSemester]);
  };

  const addCourse = (semesterId: string) => {
    const defaultGrade = effectiveScale.grades[0]?.label || 'A';
    setSemesters(
      semesters.map(sem =>
        sem.id === semesterId
          ? {
              ...sem,
              courses: [
                ...sem.courses,
                {
                  id: Date.now().toString(),
                  name: '',
                  creditHours: 3,
                  grade: defaultGrade,
                  points: gradePoints[defaultGrade],
                },
              ],
            }
          : sem
      )
    );
  };

  const updateCourse = (semesterId: string, courseId: string, updates: Partial<Course>) => {
    setSemesters(
      semesters.map(sem =>
        sem.id === semesterId
          ? {
              ...sem,
              courses: sem.courses.map(course =>
                course.id === courseId
                  ? {
                      ...course,
                      ...updates,
                      points: updates.grade ? (gradePoints[updates.grade] ?? course.points) : course.points,
                    }
                  : course
              ),
            }
          : sem
      )
    );
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setSemesters(
      semesters.map(sem =>
        sem.id === semesterId
          ? { ...sem, courses: sem.courses.filter(c => c.id !== courseId) }
          : sem
      )
    );
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(semesters.filter(s => s.id !== semesterId));
  };

  const addCustomGrade = () => {
    const newGrade = { label: 'A', points: 4.0 };
    setGradeScale({ ...gradeScale, grades: [...gradeScale.grades, newGrade] });
  };

  const updateCustomGrade = (index: number, field: 'label' | 'points', value: string | number) => {
    const newGrades = [...gradeScale.grades];
    newGrades[index] = { ...newGrades[index], [field]: field === 'points' ? Number(value) : value };
    setGradeScale({ ...gradeScale, grades: newGrades });
  };

  const removeCustomGrade = (index: number) => {
    const newGrades = gradeScale.grades.filter((_, i) => i !== index);
    setGradeScale({ ...gradeScale, grades: newGrades });
  };

  const selectScale = (scaleKey: string) => {
    if (scaleKey === 'Custom') {
      setGradeScale(PRESET_SCALES['Custom']);
    } else {
      setGradeScale(PRESET_SCALES[scaleKey]);
      setCustomScaleName('');
    }
  };

  const calculateSemesterGPA = (courses: Course[]): number => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce((sum, c) => sum + (gradePoints[c.grade] || 0) * c.creditHours, 0);
    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCGPA = (): number => {
    if (semesters.length === 0) return 0;
    const allCourses = semesters.flatMap(s => s.courses);
    return calculateSemesterGPA(allCourses);
  };

  const exportPDF = async () => {
    try {
      const element = document.getElementById('gpa-report');
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0A0A0F' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
      pdf.save('gpa-report.pdf');
    } catch (err) {
      setError('Failed to export PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="gap-2">
              <Settings size={16} />
              Grade Scale: {effectiveScale.name}
            </Button>
            {gradeScale.name === 'Custom' && customScaleName && (
              <span className="text-sm text-text-muted">({customScaleName})</span>
            )}
          </div>
          <div className="text-xs text-text-muted">
            {Object.keys(gradePoints).length} grades configured
          </div>
        </div>

        {showSettings && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Select Preset Scale</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PRESET_SCALES).filter(k => k !== 'Custom').map(key => (
                  <button
                    key={key}
                    onClick={() => selectScale(key)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                      gradeScale.name === key
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface border-border hover:border-accent'
                    }`}
                  >
                    {key}
                    {gradeScale.name === key && <Check size={14} className="inline ml-1" />}
                  </button>
                ))}
                <button
                  onClick={() => selectScale('Custom')}
                  className={`px-3 py-1.5 text-sm rounded-full border transition ${
                    gradeScale.name === 'Custom'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface border-border hover:border-accent'
                  }`}
                >
                  Custom
                  {gradeScale.name === 'Custom' && <Check size={14} className="inline ml-1" />}
                </button>
              </div>
            </div>

            {gradeScale.name === 'Custom' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text">Custom Scale Name</label>
                  <Button variant="ghost" size="sm" onClick={addCustomGrade}>Add Grade</Button>
                </div>
                <Input
                  placeholder="e.g., My University Scale"
                  value={customScaleName}
                  onChange={(e) => setCustomScaleName(e.target.value)}
                  className="max-w-xs"
                />
                <div className="grid grid-cols-2 gap-3">
                  {gradeScale.grades.map((g, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={g.label}
                        onChange={(e) => updateCustomGrade(idx, 'label', e.target.value)}
                        className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm"
                      >
                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={g.points}
                        onChange={(e) => updateCustomGrade(idx, 'points', e.target.value)}
                        className="w-20"
                      />
                      <button
                        onClick={() => removeCustomGrade(idx)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {gradeScale.grades.length === 0 && (
                  <p className="text-sm text-text-muted italic">Add at least one grade to your custom scale.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

  return (
    <div className="space-y-6">
      <div id="gpa-report" className="space-y-6 p-6 bg-gradient-to-b from-surface to-surface-2 rounded-lg">
        {semesters.map(semester => {
          const semesterGPA = calculateSemesterGPA(semester.courses);
          return (
            <Card key={semester.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text">{semester.name}</h3>
                  <p className="text-sm text-text-muted">
                    GPA: <span className="text-accent font-bold">{semesterGPA.toFixed(2)}</span>
                  </p>
                </div>
                <button
                  onClick={() => deleteSemester(semester.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {semester.courses.map(course => (
                  <div key={course.id} className="flex gap-3 items-end">
                    <Input
                      placeholder="Course name"
                      value={course.name}
                      onChange={e =>
                        updateCourse(semester.id, course.id, { name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Credits"
                      value={course.creditHours}
                      onChange={e =>
                        updateCourse(semester.id, course.id, { creditHours: Number(e.target.value) })
                      }
                      className="w-20"
                    />
                    <select
                      value={course.grade}
                      onChange={e =>
                        updateCourse(semester.id, course.id, {
                          grade: e.target.value,
                          points: gradePoints[e.target.value],
                        })
                      }
                      className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm"
                    >
                      {effectiveScale.grades.map(g => (
                        <option key={g.label} value={g.label}>
                          {g.label} ({g.points.toFixed(1)})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteCourse(semester.id, course.id)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => addCourse(semester.id)}
                variant="ghost"
                className="w-full text-accent border-dashed"
              >
                <Plus size={16} /> Add Course
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5">
          <p className="text-text-muted text-sm">Overall CGPA</p>
          <p className="text-3xl font-bold text-accent mt-2">{calculateCGPA().toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-violet/10 to-violet/5">
          <p className="text-text-muted text-sm">Total Semesters</p>
          <p className="text-3xl font-bold text-violet mt-2">{semesters.length}</p>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button onClick={addSemester} variant="primary" className="flex-1">
          <Plus size={16} /> Add Semester
        </Button>
        <Button onClick={exportPDF} variant="outline" className="flex-1">
          <Download size={16} /> Export PDF
        </Button>
        <Button
          onClick={() => setSemesters([])}
          variant="outline"
          className="text-danger"
        >
          Reset All
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-danger/10 border-danger/30">
          <p className="text-danger text-sm">{error}</p>
        </Card>
      )}
    </div>
  );
}
