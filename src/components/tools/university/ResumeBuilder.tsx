'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  details?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  education: Section[];
  experience: Section[];
  skills: Section[];
  projects: Section[];
  certifications: Section[];
  languages: Section[];
}

const emptyCV: CVData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '' },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export default function ResumeBuilder() {
  const [cvData, setCVData] = useLocalStorage<CVData>('resume-builder', emptyCV);
  const previewRef = useRef<HTMLDivElement>(null);

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setCVData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, ...updates },
    });
  };

  const addSection = (section: keyof Omit<CVData, 'personalInfo'>) => {
    const newItem: Section = {
      id: Date.now().toString(),
      title: '',
      description: '',
      details: '',
    };
    setCVData({
      ...cvData,
      [section]: [...(cvData[section] || []), newItem],
    });
  };

  const updateSection = (
    section: keyof Omit<CVData, 'personalInfo'>,
    id: string,
    updates: Partial<Section>
  ) => {
    setCVData({
      ...cvData,
      [section]: (cvData[section] || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const removeSection = (section: keyof Omit<CVData, 'personalInfo'>, id: string) => {
    setCVData({
      ...cvData,
      [section]: (cvData[section] || []).filter(item => item.id !== id),
    });
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: '#FFFFFF', // Ensure white background
        useCORS: true, // Handle cross-origin images
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions to maintain aspect ratio
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const renderSection = (section: keyof Omit<CVData, 'personalInfo'>, label: string) => {
    const items = cvData[section] || [];

    return (
      <Card key={section} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text">{label}</h3>
          <Button
            onClick={() => addSection(section)}
            variant="ghost"
            size="sm"
          >
            <Plus size={14} />
          </Button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="p-4 bg-surface/50 rounded-lg border border-border space-y-3">
              <Input
                placeholder="Title"
                value={item.title}
                onChange={e => updateSection(section, item.id, { title: e.target.value })}
              />
              <Input
                placeholder="Subtitle/Company/Duration"
                value={item.description}
                onChange={e => updateSection(section, item.id, { description: e.target.value })}
              />
              {(section === 'experience' || section === 'projects') && (
                <Textarea
                  placeholder="Description"
                  value={item.details || ''}
                  onChange={e => updateSection(section, item.id, { details: e.target.value })}
                  className="min-h-20"
                />
              )}
              <button
                onClick={() => removeSection(section, item.id)}
                className="text-danger text-sm hover:bg-danger/10 p-2 rounded"
              >
                <Trash2 size={16} className="inline mr-1" /> Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Panel */}
      <div className="space-y-6 order-2 lg:order-1">
        {/* Personal Info */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-text">Personal Information</h3>
          <Input
            placeholder="Full Name"
            value={cvData.personalInfo.fullName}
            onChange={e => updatePersonalInfo({ fullName: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={cvData.personalInfo.email}
            onChange={e => updatePersonalInfo({ email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={cvData.personalInfo.phone}
            onChange={e => updatePersonalInfo({ phone: e.target.value })}
          />
          <Input
            placeholder="Location"
            value={cvData.personalInfo.location}
            onChange={e => updatePersonalInfo({ location: e.target.value })}
          />
          <Textarea
            placeholder="Professional Summary"
            value={cvData.personalInfo.summary}
            onChange={e => updatePersonalInfo({ summary: e.target.value })}
            className="min-h-20"
          />
        </Card>

        {/* Sections */}
        {renderSection('education', 'Education')}
        {renderSection('experience', 'Work Experience')}
        {renderSection('skills', 'Skills')}
        {renderSection('projects', 'Projects')}
        {renderSection('certifications', 'Certifications')}
        {renderSection('languages', 'Languages')}
      </div>

      {/* Preview Panel */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-4 lg:h-screen overflow-y-auto">
        <div ref={previewRef} className="bg-white text-black p-12 rounded-lg shadow-lg min-h-screen">
          {/* Header */}
          <div className="border-b-2 border-gray-300 pb-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{cvData.personalInfo.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
              {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
            </div>
          </div>

          {/* Summary */}
          {cvData.personalInfo.summary && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">{cvData.personalInfo.summary}</p>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2">
                Education
              </h2>
              {cvData.education.map(item => (
                <div key={item.id} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">{item.title}</span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2">
                Experience
              </h2>
              {cvData.experience.map(item => (
                <div key={item.id} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-900">{item.title}</span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                  {item.details && <p className="text-sm text-gray-700">{item.details}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map(item => (
                  <span key={item.id} className="text-sm bg-gray-100 px-3 py-1 rounded">
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cvData.projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2">
                Projects
              </h2>
              {cvData.projects.map(item => (
                <div key={item.id} className="mb-3">
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  {item.details && <p className="text-sm text-gray-700 mt-1">{item.details}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {cvData.languages.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {cvData.languages.map(item => (
                  <span key={item.id} className="text-sm">{item.title}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="sticky bottom-0 mt-4 flex gap-3">
          <Button onClick={exportPDF} variant="primary" className="flex-1">
            <Download size={16} /> Export PDF
          </Button>
          <Button
            onClick={() => setCVData(emptyCV)}
            variant="outline"
            className="text-danger"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
