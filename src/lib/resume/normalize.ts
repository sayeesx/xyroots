/**
 * Normalize extracted text for better LLM processing
 * - Removes excessive whitespace
 * - Fixes line endings
 * - Removes repeated blank lines
 * - Preserves meaningful structure
 */
export function normalizeResumeText(text: string): string {
  return text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive spaces (but keep single spaces)
    .replace(/[ \t]+/g, ' ')
    // Remove trailing whitespace from each line
    .replace(/[ \t]+$/gm, '')
    // Replace multiple blank lines with maximum 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim start and end
    .trim();
}

/**
 * Check if the text has meaningful content
 */
export function hasMeaningfulContent(text: string): boolean {
  const trimmed = text.trim();
  
  // Must have minimum length
  if (trimmed.length < 100) {
    return false;
  }
  
  // Should have some word-like patterns
  const words = trimmed.split(/\s+/);
  if (words.length < 20) {
    return false;
  }
  
  return true;
}
