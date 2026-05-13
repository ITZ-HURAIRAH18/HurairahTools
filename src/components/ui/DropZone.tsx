'use client';

import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
}

export function DropZone({
  onFileSelect,
  accept,
  multiple = false,
  maxSizeMB = 50,
  className,
  ...props
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    Array.from(files).forEach((file) => {
      if (file.size <= maxBytes) {
        validFiles.push(file);
      } else {
        alert(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
      }
    });

    if (validFiles.length > 0) {
      if (!multiple) {
        onFileSelect([validFiles[0]]);
      } else {
        onFileSelect(validFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors',
        isDragActive
          ? 'border-accent bg-accent/5'
          : 'border-border-soft bg-surface hover:border-accent/50 hover:bg-surface-2',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted mb-4 shadow-sm">
        <UploadCloud className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">
        Click to upload or drag and drop
      </h3>
      <p className="text-sm text-text-muted">
        {accept ? `Accepted formats: ${accept}` : 'All files supported'}
      </p>
      <p className="mt-1 text-xs text-text-faint">Maximum file size: {maxSizeMB}MB</p>
    </div>
  );
}
