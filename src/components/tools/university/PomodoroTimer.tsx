'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Settings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
}

type SessionType = 'work' | 'break' | 'longBreak';

export default function PomodoroTimer() {
  const [settings, setSettings] = useLocalStorage<Settings>('pomodoro-settings', {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [sessions, setSessions] = useLocalStorage('pomodoro-sessions', 0);
  const [totalTime, setTotalTime] = useLocalStorage('pomodoro-total-time', 0);
  const [sound, setSound] = useState<'none' | 'whitenoise' | 'rain' | 'cafe'>('none');
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleSessionEnd = () => {
    setIsRunning(false);

    // Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('UniToolKit Pomodoro', {
        body:
          sessionType === 'work'
            ? 'Great work! Take a break.'
            : 'Break time is over. Ready for another session?',
      });
    }

    // Switch session
    if (sessionType === 'work') {
      const isLongBreak = sessions % 4 === 3;
      setSessionType(isLongBreak ? 'longBreak' : 'break');
      setTimeLeft((isLongBreak ? settings.longBreakDuration : settings.breakDuration) * 60);
      setSessions(sessions + 1);
      setTotalTime(totalTime + settings.workDuration);
    } else {
      setSessionType('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (sound === 'none') {
      setSound('whitenoise');
    } else {
      audioRef.current.pause();
      setSound('none');
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (sound !== 'none') {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [sound]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    setIsRunning(false);
    setSessionType('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const getSessionColor = (): 'from-accent' | 'from-success' | 'from-amber' => {
    if (sessionType === 'work') return 'from-accent';
    if (sessionType === 'break') return 'from-success';
    return 'from-amber';
  };

  const progress = ((
    (sessionType === 'work' ? settings.workDuration * 60 : sessionType === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60) -
    timeLeft
  ) /
    (sessionType === 'work' ? settings.workDuration * 60 : sessionType === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60)) *
    100 || 0;

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card className={`p-12 bg-gradient-to-br ${getSessionColor()} to-transparent border-2`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-text-muted uppercase tracking-widest text-sm">
            {sessionType === 'work' ? 'Work Session' : sessionType === 'break' ? 'Short Break' : 'Long Break'}
          </p>

          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className="text-accent transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-7xl font-bold text-text">{formatTime(timeLeft)}</p>
              <p className="text-text-muted mt-2">
                Session: {sessions + 1}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="primary"
          className="flex-1"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetSession} variant="outline" className="flex-1">
          <RotateCcw size={16} /> Reset
        </Button>
      </div>

      {/* Sound Options */}
      <Card className="p-4 space-y-3">
        <p className="text-sm font-semibold text-text">Ambient Sound</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['none', 'whitenoise', 'rain', 'cafe'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSound(s)}
              className={`p-3 rounded-lg border transition text-sm ${
                sound === s
                  ? 'bg-accent text-white border-accent'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {s === 'none' ? 'None' : s === 'whitenoise' ? 'White Noise' : s === 'rain' ? 'Rain' : 'Cafe'}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-muted">
          Note: Ambient sounds would be played here. Add audio files in production.
        </p>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5">
          <p className="text-text-muted text-xs">Completed Sessions</p>
          <p className="text-3xl font-bold text-accent mt-2">{sessions}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-violet/10 to-violet/5">
          <p className="text-text-muted text-xs">Total Focus Time</p>
          <p className="text-3xl font-bold text-violet mt-2">{totalTime} min</p>
        </Card>
      </div>

      {/* Settings */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-text">Customize Durations</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-2">Work (minutes)</label>
            <Input
              type="number"
              min="1"
              max="120"
              value={settings.workDuration}
              onChange={e => setSettings({ ...settings, workDuration: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-2">Break (minutes)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.breakDuration}
              onChange={e => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-2">Long Break (minutes)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={e => setSettings({ ...settings, longBreakDuration: Number(e.target.value) })}
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={requestNotificationPermission}
        variant="outline"
        className="w-full"
      >
        Enable Notifications
      </Button>

      <audio ref={audioRef} loop />
    </div>
  );
}
