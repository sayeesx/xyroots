import mammoth from 'mammoth';

/**
 * Extract text from DOCX buffer
 * @param buffer DOCX file buffer
 * @returns Extracted text content
 */
export async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ 
      arrayBuffer: buffer 
    });
    
    const text = result.value.trim();
    
    // Check if extracted text is meaningful
    if (text.length < 50) {
      throw new Error('Document appears to be empty or unreadable');
    }
    
    return text;
  } catch (error: any) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}
