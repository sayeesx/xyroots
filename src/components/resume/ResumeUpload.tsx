"use client";

import { useState, useRef, useCallback } from "react";
import { FaUpload, FaFileAlt, FaTrash, FaSpinner, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import type { ResumeData } from "@/lib/resume/schema";

type UploadState = "idle" | "selected" | "processing" | "success" | "error";

interface ResumeUploadProps {
  onExtracted: (data: ResumeData) => void;
  onError?: (error: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export default function ResumeUpload({ onExtracted, onError }: ResumeUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF or DOCX file.";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `This file is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`;
    }

    return null;
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      setState("error");
      setSelectedFile(null);
      if (onError) onError(validationError);
      return;
    }

    setSelectedFile(file);
    setState("selected");
    setError(null);
  }, [validateFile, onError]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setState("idle");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setState("processing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setState("success");
        onExtracted(result.data);
      } else {
        const errorMsg = result.error || "Failed to analyze resume. Please try again.";
        setError(errorMsg);
        setState("error");
        if (onError) onError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      setState("error");
      if (onError) onError(errorMsg);
    }
  }, [selectedFile, onExtracted, onError]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-black mb-1">Autofill from Resume (Optional)</h3>
        <p className="text-xs text-xyroots-muted">
          Upload your resume and we'll automatically fill in your teacher profile.
        </p>
      </div>

      {/* Upload Area */}
      {(state === "idle" || state === "error") && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-xyroots-border rounded-2xl p-8 text-center bg-xyroots-cream/30 hover:border-xyroots-teal cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FaUpload className="w-10 h-10 text-xyroots-teal mx-auto mb-3" />
          <p className="text-sm font-bold text-black mb-1">Upload Resume</p>
          <p className="text-xs text-xyroots-muted mb-3">
            Drag & drop your PDF or DOCX here, or click to browse
          </p>
          <p className="text-xs text-xyroots-muted">
            Maximum file size: 10 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* File Selected */}
      {state === "selected" && selectedFile && (
        <div className="bg-white rounded-xl border border-xyroots-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-xyroots-mint text-xyroots-teal flex items-center justify-center shrink-0">
              <FaFileAlt className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-xyroots-muted">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="text-xyroots-muted hover:text-red-600 transition-colors p-2"
              aria-label="Remove file"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-sm bg-xyroots-teal text-white hover:bg-xyroots-dark transition-all flex items-center justify-center gap-2"
          >
            Analyze Resume
          </button>
        </div>
      )}

      {/* Processing */}
      {state === "processing" && (
        <div className="bg-white rounded-xl border border-xyroots-border p-6 text-center">
          <FaSpinner className="w-8 h-8 text-xyroots-teal mx-auto mb-3 animate-spin" />
          <p className="text-sm font-bold text-black mb-1">Analyzing your resume...</p>
          <p className="text-xs text-xyroots-muted">
            Extracting your teacher information. This may take a moment.
          </p>
        </div>
      )}

      {/* Success */}
      {state === "success" && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-start gap-3">
            <FaCircleCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-900 mb-1">Resume analyzed successfully!</p>
              <p className="text-xs text-green-700">
                We've filled in the information we found. Please review everything before submitting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {state === "error" && error && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <FaCircleExclamation className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 mb-1">Unable to analyze resume</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="w-full mt-3 py-2 px-4 rounded-xl font-semibold text-sm bg-white border border-red-200 text-red-900 hover:bg-red-50 transition-all"
          >
            Try Another File
          </button>
        </div>
      )}
    </div>
  );
}
