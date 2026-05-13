'use client';

import { useState, useRef } from 'react';
import { Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
  room: string;
  color: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
const COLORS = ['#6366F1', '#A78BFA', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899'];

export default function TimetableBuilder() {
  const [slots, setSlots] = useLocalStorage<TimeSlot[]>('timetable-builder', []);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [formData, setFormData] = useState({ subject: '', room: '', color: COLORS[0] });
  const timetableRef = useRef<HTMLDivElement>(null);

  const getSlot = (day: string, time: string) => slots.find(s => s.day === day && s.time === time);

  const handleAddSlot = () => {
    if (!selectedSlot || !formData.subject.trim()) return;

    const existing = getSlot(selectedSlot.day, selectedSlot.time);
    if (existing) {
      setSlots(
        slots.map(s =>
          s.day === selectedSlot.day && s.time === selectedSlot.time
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      setSlots([...slots, { ...selectedSlot, ...formData }]);
    }

    setFormData({ subject: '', room: '', color: COLORS[0] });
    setSelectedSlot(null);
  };

  const handleDeleteSlot = (day: string, time: string) => {
    setSlots(slots.filter(s => !(s.day === day && s.time === time)));
  };

  const exportPNG = async () => {
    if (!timetableRef.current) return;

    try {
      const canvas = await html2canvas(timetableRef.current, { scale: 2, backgroundColor: '#111118' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'timetable.png';
      link.click();
    } catch (err) {
      console.error('PNG export failed:', err);
    }
  };

  const exportPDF = async () => {
    if (!timetableRef.current) return;

    try {
      const canvas = await html2canvas(timetableRef.current, { scale: 2, backgroundColor: '#111118' });
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 280, 190);
      pdf.save('timetable.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const clearAll = () => {
    setSlots([]);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      {selectedSlot && (
        <Card className="p-6 space-y-4 border-2 border-accent">
          <h3 className="font-semibold text-text">
            {selectedSlot.day} at {selectedSlot.time}
          </h3>

          <Input
            placeholder="Subject/Course Name"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />

          <Input
            placeholder="Room Number (optional)"
            value={formData.room}
            onChange={e => setFormData({ ...formData, room: e.target.value })}
          />

          <div>
            <label className="text-sm text-text-muted block mb-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition ${
                    formData.color === color ? 'ring-2 ring-accent' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddSlot} variant="primary" className="flex-1">
              Add Class
            </Button>
            <Button
              onClick={() => setSelectedSlot(null)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Timetable */}
      <div ref={timetableRef} className="overflow-x-auto bg-surface rounded-lg p-4">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-16 p-3 bg-surface-2 text-text-muted text-xs font-semibold border border-border">
                  Time
                </th>
                {DAYS.map(day => (
                  <th
                    key={day}
                    className="w-32 p-3 bg-surface-2 text-text text-xs font-semibold border border-border"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time => (
                <tr key={time}>
                  <td className="p-3 bg-surface-2 text-text-muted text-xs font-semibold border border-border">
                    {time}
                  </td>
                  {DAYS.map(day => {
                    const slot = getSlot(day, time);
                    return (
                      <td
                        key={`${day}-${time}`}
                        className="p-2 border border-border h-24 cursor-pointer hover:bg-surface-2/50 transition"
                        onClick={() =>
                          !slot && setSelectedSlot({ day, time })
                        }
                      >
                        {slot ? (
                          <div
                            className="h-full rounded-lg p-2 text-white text-xs flex flex-col justify-between group"
                            style={{ backgroundColor: slot.color }}
                          >
                            <div>
                              <p className="font-semibold">{slot.subject}</p>
                              {slot.room && <p className="text-xs opacity-90">Rm: {slot.room}</p>}
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteSlot(day, time);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-text-muted text-xs opacity-0 hover:opacity-100 transition">
                            + Add
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <p className="text-xs text-text-muted mb-3">Class Colors</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLORS.map((color, idx) => (
            <div key={color} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text">Color {idx + 1}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      {slots.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-accent/10 to-violet/10">
          <p className="text-sm text-text">
            <span className="font-semibold text-accent">{slots.length}</span> classes scheduled
          </p>
        </Card>
      )}

      {/* Export Buttons */}
      <div className="flex gap-3">
        <Button onClick={exportPNG} variant="outline" className="flex-1">
          <Download size={16} /> Export PNG
        </Button>
        <Button onClick={exportPDF} variant="outline" className="flex-1">
          <Download size={16} /> Export PDF
        </Button>
        <Button onClick={clearAll} variant="outline" className="text-danger">
          Clear All
        </Button>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-surface/50 border-dashed">
        <p className="text-xs text-text-muted">
          💡 <strong>Tip:</strong> Click on any time slot to add a class. Hover over a class to delete it. Your
          timetable is automatically saved.
        </p>
      </Card>
    </div>
  );
}
