"use client";

import { useState, useRef } from 'react';
import { FaUpload, FaSpinner, FaCircleCheck, FaCircleExclamation, FaTrash } from 'react-icons/fa6';
import { validateResumeFile } from '@/lib/validations';
import type { ResumeData } from '@/lib/resume/schema';

interface ResumeUploadProps {
  onExtracted: (data: ResumeData) => void;
  className?: string;
}

type UploadState = 'idle' | 'selected' | 'processing' | 'success' | 'error';

export default function ResumeUpload({ onExtracted, className = '' }: ResumeUploadProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setState('idle');
      setError(null);
      return;
    }

    // Validate file
    const validationError = validateResumeFile(file);
    if (validationError) {
      setError(validationError);
      setState('error');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setState('selected');
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setState('idle');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setState('processing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/resume/extract', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        setState('error');
        setError(result.error || 'Failed to analyze resume. Please try again.');
        return;
      }

      setState('success');
      
      // Call the parent callback with extracted data
      setTimeout(() => {
        onExtracted(result.data);
      }, 800); // Small delay for UX

    } catch (err: any) {
      console.error('Resume analysis error:', err);
      setState('error');
      setError('We couldn\'t analyze this resume. Please try another PDF or DOCX file.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-black mb-1">Autofill from Resume</h3>
        <p className="text-xs text-xyroots-muted">
          Upload your resume and we'll fill in your teacher profile automatically.
        </p>
      </div>

      {/* Upload Area */}
      {state === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-xyroots-border rounded-2xl p-8 text-center bg-xyroots-cream/30 hover:border-xyroots-teal cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FaUpload className="w-10 h-10 text-xyroots-teal mx-auto mb-3" />
          <p className="text-sm font-bold text-black mb-1">Upload Resume</p>
          <p className="text-xs text-xyroots-muted mb-1">
            Drag & drop PDF or DOCX here
          </p>
          <p className="text-xs text-xyroots-muted">or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">Maximum size: 10 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* File Selected */}
      {state === 'selected' && selectedFile && (
        <div className="border-2 border-xyroots-teal rounded-2xl p-6 bg-xyroots-mint">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-black truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-xyroots-muted mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="ml-2 p-2 hover:bg-white/50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
              aria-label="Remove file"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full py-2.5 bg-xyroots-teal text-white rounded-xl font-semibold text-sm hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2"
          >
            <FaUpload className="w-4 h-4" />
            Auto Fill from Resume
          </button>
        </div>
      )}

      {/* Processing */}
      {state === 'processing' && (
        <div className="border-2 border-xyroots-border rounded-2xl p-8 bg-blue-50 text-center">
          <FaSpinner className="w-10 h-10 text-xyroots-teal mx-auto mb-3 animate-spin" />
          <p className="text-sm font-bold text-black mb-1">Auto-filling from your resume...</p>
          <p className="text-xs text-xyroots-muted">
            Extracting your teacher information
          </p>
        </div>
      )}

      {/* Success */}
      {state === 'success' && (
        <div className="border-2 border-green-300 rounded-2xl p-8 bg-green-50 text-center">
          <FaCircleCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-black mb-1">Resume analyzed</p>
          <p className="text-xs text-green-700">
            We've filled in the information we found. Please review everything before submitting.
          </p>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="border-2 border-red-300 rounded-2xl p-6 bg-red-50">
          <div className="flex items-start gap-3 mb-4">
            <FaCircleExclamation className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-black mb-1">
                We couldn't analyze this resume
              </p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleRemoveFile();
              fileInputRef.current?.click();
            }}
            className="w-full py-2.5 bg-white border border-red-300 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            Try Another File
          </button>
        </div>
      )}
    </div>
  );
}
