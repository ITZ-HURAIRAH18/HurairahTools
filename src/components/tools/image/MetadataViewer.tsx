'use client';

import React, { useState } from 'react';
import exifr from 'exifr';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Camera, MapPin, Calendar, HardDrive } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function MetadataViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const { isProcessing, error, process, reset } = useFileProcessor<File, any>();

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    
    process(selected, async (inputFile) => {
      try {
        // Parse all metadata blocks: EXIF, IPTC, XMP, GPS
        const parsed = await exifr.parse(inputFile, {
          exif: true,
          gps: true,
          ifd0: true,
        });
        
        if (!parsed || Object.keys(parsed).length === 0) {
          throw new Error("No readable EXIF metadata found in this image.");
        }
        
        setMetadata(parsed);
        return parsed;
      } catch (err: any) {
        throw new Error(err.message || "Failed to parse metadata");
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    setMetadata(null);
    reset();
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return 'N/A';
    if (val instanceof Date) return val.toLocaleString();
    if (Array.isArray(val)) return val.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'number') {
      // Don't format integer-like numbers heavily, but limit decimals
      return val % 1 === 0 ? val.toString() : val.toFixed(3);
    }
    return String(val);
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="image/jpeg, image/png, image/tiff, image/heic" 
          maxSizeMB={50}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Summary Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between rounded-lg border border-border-soft bg-surface-2 p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-6 w-6 text-accent shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium text-text truncate text-sm">{file.name}</p>
                    <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
              </div>

              {isProcessing && (
                <div className="text-center text-sm text-text-muted py-8">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent mb-2"></div>
                  Extracting EXIF data...
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-danger/10 p-4 text-sm text-danger flex flex-col items-center text-center">
                  <span className="font-bold mb-1">No Metadata</span>
                  {error}
                </div>
              )}

              {metadata && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-2">Key Info</h3>
                  
                  {metadata.Make || metadata.Model ? (
                    <div className="flex items-start gap-3 text-sm">
                      <Camera className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <span className="block text-text">{metadata.Make} {metadata.Model}</span>
                        <span className="block text-xs text-text-muted">Camera</span>
                      </div>
                    </div>
                  ) : null}

                  {metadata.DateTimeOriginal || metadata.CreateDate ? (
                    <div className="flex items-start gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <span className="block text-text">{renderValue(metadata.DateTimeOriginal || metadata.CreateDate)}</span>
                        <span className="block text-xs text-text-muted">Date Taken</span>
                      </div>
                    </div>
                  ) : null}

                  {metadata.latitude && metadata.longitude ? (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <span className="block text-text">
                          {metadata.latitude.toFixed(4)}, {metadata.longitude.toFixed(4)}
                        </span>
                        <span className="block text-xs text-text-muted">GPS Coordinates</span>
                      </div>
                    </div>
                  ) : null}

                  {metadata.ImageWidth && metadata.ImageHeight ? (
                    <div className="flex items-start gap-3 text-sm">
                      <HardDrive className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <span className="block text-text">{metadata.ImageWidth} × {metadata.ImageHeight} px</span>
                        <span className="block text-xs text-text-muted">Dimensions</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </Card>
          </div>

          {/* Full Data Column */}
          <div className="lg:col-span-8">
            <Card className="h-full">
              <div className="border-b border-border-soft bg-surface px-6 py-4">
                <h3 className="text-sm font-medium text-text">Full Raw EXIF Data</h3>
              </div>
              <div className="p-6">
                {!metadata && !error && !isProcessing && (
                  <p className="text-sm text-text-muted text-center py-10">Select an image to view its EXIF metadata.</p>
                )}
                
                {metadata && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-text">
                      <thead className="bg-surface-2 text-text-muted border-b border-border-soft">
                        <tr>
                          <th className="px-4 py-2 font-medium">Property</th>
                          <th className="px-4 py-2 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft">
                        {Object.entries(metadata).map(([key, val]) => {
                          // Skip complex binary buffers like thumbnails
                          if (key === 'thumbnail' || key === 'MakerNote' || key === 'UserComment' || String(val).includes('Uint8Array')) return null;
                          return (
                            <tr key={key} className="hover:bg-surface-2/50 transition-colors">
                              <td className="px-4 py-2 font-mono text-xs text-accent whitespace-nowrap">{key}</td>
                              <td className="px-4 py-2 break-all">{renderValue(val)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
