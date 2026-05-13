'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Download } from 'lucide-react';
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

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

const GRADES = Object.keys(GRADE_POINTS);

export default function GpaCalculator() {
  const [semesters, setSemesters] = useLocalStorage<Semester[]>('gpa-calculator', []);
  const [error, setError] = useState('');

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
                  grade: 'A',
                  points: 4.0,
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
                course.id === courseId ? { ...course, ...updates } : course
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

  const calculateSemesterGPA = (courses: Course[]): number => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce((sum, c) => sum + GRADE_POINTS[c.grade] * c.creditHours, 0);
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
                          points: GRADE_POINTS[e.target.value],
                        })
                      }
                      className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm"
                    >
                      {GRADES.map(grade => (
                        <option key={grade} value={grade}>
                          {grade}
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
