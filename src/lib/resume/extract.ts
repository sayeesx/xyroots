import { extractPdfText } from './extract-pdf';
import { extractDocxText } from './extract-docx';
import { normalizeResumeText, hasMeaningfulContent } from './normalize';
import { extractResumeWithGroq } from '@/lib/ai/groq';
import { ResumeSchema, type ResumeData } from './schema';

export type FileType = 'pdf' | 'docx';

/**
 * Main resume extraction function
 * Orchestrates the entire extraction pipeline
 */
export async function extractResume(
  buffer: ArrayBuffer,
  fileType: FileType
): Promise<ResumeData> {
  // Step 1: Extract raw text based on file type
  let rawText: string;
  
  try {
    if (fileType === 'pdf') {
      rawText = await extractPdfText(buffer);
    } else if (fileType === 'docx') {
      rawText = await extractDocxText(buffer);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error: any) {
    if (error.message === 'SCANNED_PDF') {
      throw new Error('This PDF appears to be scanned or image-based. Please upload a text-based PDF or DOCX resume.');
    }
    throw error;
  }
  
  // Step 2: Normalize the text
  const normalizedText = normalizeResumeText(rawText);
  
  // Step 3: Verify meaningful content
  if (!hasMeaningfulContent(normalizedText)) {
    throw new Error('Unable to extract readable text from this resume. Please upload a text-based PDF or DOCX file.');
  }
  
  // Step 4: Extract structured data using Groq
  let extractedData: any;
  
  try {
    extractedData = await extractResumeWithGroq(normalizedText);
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT') {
      throw new Error('Too many resume analysis requests. Please try again in a moment.');
    }
    if (error.message === 'TIMEOUT') {
      throw new Error('Resume analysis timed out. Please try again.');
    }
    throw new Error('We couldn\'t analyze the resume right now. Please try again.');
  }
  
  // Step 5: Validate with Zod
  const validationResult = ResumeSchema.safeParse(extractedData);
  
  if (!validationResult.success) {
    console.error('Resume validation error:', validationResult.error);
    throw new Error('Failed to validate extracted resume data.');
  }
  
  return validationResult.data;
}
