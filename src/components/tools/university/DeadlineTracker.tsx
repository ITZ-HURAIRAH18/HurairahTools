'use client';

import { useState } from 'react';
import { Trash2, Plus, Download, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  subject: string;
  task: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Done';
}

const getPriorityColor = (priority: string): 'red' | 'amber' | 'blue' => {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'amber';
  return 'blue';
};

const getUrgency = (dueDate: string): string => {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  if (due < today) return 'Overdue';
  if (due <= today) return 'Today';
  if (due <= tomorrow) return 'Tomorrow';
  if (due <= nextWeek) return 'This Week';
  return 'Later';
};

export default function DeadlineTracker() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('deadline-tracker', []);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    subject: '',
    task: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
  });

  const addTask = () => {
    if (!newTask.subject || !newTask.task || !newTask.dueDate) return;

    const task: Task = {
      id: Date.now().toString(),
      subject: newTask.subject || '',
      task: newTask.task || '',
      dueDate: newTask.dueDate || '',
      priority: newTask.priority as 'High' | 'Medium' | 'Low',
      status: 'Pending',
    };

    setTasks([...tasks, task]);
    setNewTask({ subject: '', task: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, status: t.status === 'Done' ? 'Pending' : 'Done' } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'Pending' ? -1 : 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const exportCSV = () => {
    const csv = [
      'Subject,Task,Due Date,Priority,Status',
      ...tasks.map(t => `"${t.subject}","${t.task}","${t.dueDate}","${t.priority}","${t.status}"`),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deadlines.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-text">Add New Task</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Subject"
            value={newTask.subject || ''}
            onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
          />
          <Input
            placeholder="Task description"
            value={newTask.task || ''}
            onChange={e => setNewTask({ ...newTask, task: e.target.value })}
          />
          <Input
            type="date"
            value={newTask.dueDate || ''}
            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <select
            value={newTask.priority}
            onChange={e =>
              setNewTask({ ...newTask, priority: e.target.value as 'High' | 'Medium' | 'Low' })
            }
            className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <Button onClick={addTask} variant="primary" className="w-full">
          <Plus size={16} /> Add Task
        </Button>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {sortedTasks.map(task => {
          const urgency = getUrgency(task.dueDate);
          const urgencyColor =
            urgency === 'Overdue' || urgency === 'Today'
              ? 'red'
              : urgency === 'Tomorrow' || urgency === 'This Week'
              ? 'amber'
              : 'blue';

          return (
            <Card
              key={task.id}
              className={`p-4 transition ${
                task.status === 'Done'
                  ? 'opacity-60 bg-surface/50'
                  : 'hover:bg-surface-2'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-accent mt-1 flex-shrink-0"
                >
                  {task.status === 'Done' ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Circle size={20} className="opacity-50" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-semibold ${
                        task.status === 'Done'
                          ? 'line-through text-text-muted'
                          : 'text-text'
                      }`}
                    >
                      {task.subject}
                    </h4>
                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className={task.status === 'Done' ? 'line-through text-text-muted' : 'text-text-muted'}>
                    {task.task}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-text-muted">{task.dueDate}</span>
                    <Badge variant={urgencyColor as 'red' | 'amber' | 'blue'} className="text-xs">
                      {urgency}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          );
        })}

        {tasks.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-muted">No tasks yet. Add one to get started!</p>
          </Card>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={exportCSV} variant="outline" className="flex-1">
          <Download size={16} /> Export CSV
        </Button>
        <Button
          onClick={() => setTasks([])}
          variant="outline"
          className="text-danger"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
