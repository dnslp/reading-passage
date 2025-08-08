// Text chunking utility for breaking passages into screen-sized portions

/**
 * Gets font-specific character width multipliers
 * @param {string} fontFamily - The font family
 * @returns {number} Character width multiplier
 */
const getFontWidthMultiplier = (fontFamily = '') => {
  const font = fontFamily.toLowerCase();
  
  // Font-specific character width multipliers (relative to fontSize)
  if (font.includes('georgia')) return 0.55;
  if (font.includes('times')) return 0.5;
  if (font.includes('arial')) return 0.52;
  if (font.includes('helvetica')) return 0.52;
  if (font.includes('verdana')) return 0.58;
  if (font.includes('courier')) return 0.6; // Monospace is wider
  if (font.includes('opendyslexic')) return 0.6;
  
  // Default for unknown fonts
  return 0.55;
};

/**
 * Measures actual text dimensions using a temporary canvas element
 * @param {string} text - Sample text to measure
 * @param {string} fontFamily - Font family
 * @param {number} fontSize - Font size in pixels
 * @returns {Object} Text dimensions
 */
const measureText = (text, fontFamily, fontSize) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px ${fontFamily}`;
  
  const metrics = context.measureText(text);
  return {
    width: metrics.width,
    height: fontSize // Approximate height as fontSize
  };
};

/**
 * Estimates how many words can fit on screen based on viewport and font settings
 * @param {Object} settings - Font and display settings
 * @returns {number} Estimated words per chunk
 */
export const estimateWordsPerChunk = (settings = {}) => {
  const {
    fontSize = 18,
    lineHeight = 1.6,
    columnView = false,
    fontFamily = 'Georgia, serif',
  } = settings;
  
  // Get viewport dimensions
  const viewportHeight = window.innerHeight || 800;
  const viewportWidth = window.innerWidth || 375;
  
  // Account for UI elements - be more conservative on mobile
  const isMobile = viewportWidth < 768;
  const reservedHeight = isMobile ? 280 : 200; // More space reserved on mobile for bottom nav
  const availableHeight = Math.max(300, viewportHeight - reservedHeight);
  
  // Calculate available width
  const padding = isMobile ? 16 : 32;
  const maxWidth = columnView ? (isMobile ? viewportWidth - padding : Math.min(viewportWidth - padding, 800)) : viewportWidth - padding;
  const availableWidth = Math.max(250, maxWidth);
  
  // Use more accurate font measurement
  const sampleText = "The quick brown fox jumps over the lazy dog";
  let avgCharWidth;
  
  try {
    // Try to measure actual text if canvas is available
    const measurements = measureText(sampleText, fontFamily, fontSize);
    avgCharWidth = measurements.width / sampleText.length;
  } catch (e) {
    // Fallback to font-specific multiplier
    avgCharWidth = fontSize * getFontWidthMultiplier(fontFamily);
  }
  
  // Calculate characters per line with some margin
  const charsPerLine = Math.floor(availableWidth / avgCharWidth * 0.95); // 95% to ensure margin
  
  // Calculate lines that fit on screen
  const lineHeightPx = fontSize * lineHeight;
  const linesPerScreen = Math.floor(availableHeight / lineHeightPx);
  
  // Average words per line (more conservative estimate)
  // English averages ~4.7 chars per word + 1 space = ~5.7 chars per word
  const wordsPerLine = Math.floor(charsPerLine / 6);
  
  // Total words that fit comfortably on screen (be more conservative)
  const wordsPerChunk = Math.max(30, Math.floor(wordsPerLine * linesPerScreen * 0.7)); // 70% for extra safety
  
  return wordsPerChunk;
};

/**
 * Validates if a text chunk fits within the available screen space
 * @param {string} text - Text to validate
 * @param {Object} settings - Display settings
 * @returns {boolean} Whether the text fits
 */
export const validateChunkSize = (text, settings = {}) => {
  const {
    fontSize = 18,
    lineHeight = 1.6,
    fontFamily = 'Georgia, serif',
  } = settings;
  
  const viewportHeight = window.innerHeight || 800;
  const viewportWidth = window.innerWidth || 375;
  const isMobile = viewportWidth < 768;
  const reservedHeight = isMobile ? 280 : 200;
  const availableHeight = Math.max(300, viewportHeight - reservedHeight);
  
  // Quick validation using line count
  const words = text.split(/\s+/);
  const avgWordsPerLine = Math.floor((viewportWidth - 32) / (fontSize * 0.55 * 6));
  const estimatedLines = Math.ceil(words.length / Math.max(1, avgWordsPerLine));
  const estimatedHeight = estimatedLines * fontSize * lineHeight;
  
  return estimatedHeight <= availableHeight * 0.9; // 90% safety margin
};

/**
 * Breaks text into chunks based on screen capacity
 * @param {string} text - The full text to chunk
 * @param {Object} settings - Display settings
 * @returns {Array} Array of text chunks
 */
export const createTextChunks = (text, settings = {}) => {
  let wordsPerChunk = estimateWordsPerChunk(settings);
  const words = text.split(/\s+/);
  const chunks = [];
  
  let i = 0;
  while (i < words.length) {
    let chunkSize = wordsPerChunk;
    let chunkWords, chunkText;
    
    // Create initial chunk
    chunkWords = words.slice(i, i + chunkSize);
    chunkText = chunkWords.join(' ');
    
    // Validate and adjust chunk size if needed
    let attempts = 0;
    while (!validateChunkSize(chunkText, settings) && chunkSize > 10 && attempts < 5) {
      chunkSize = Math.floor(chunkSize * 0.8); // Reduce by 20%
      chunkWords = words.slice(i, i + chunkSize);
      chunkText = chunkWords.join(' ');
      attempts++;
    }
    
    // Ensure we always make progress
    if (chunkSize === 0) chunkSize = 1;
    
    chunks.push({
      id: chunks.length,
      text: chunkText,
      wordStart: i,
      wordEnd: i + chunkWords.length - 1,
      wordCount: chunkWords.length,
    });
    
    i += chunkWords.length;
  }
  
  return chunks;
};

/**
 * Calculates reading progress through a passage
 * @param {number} currentChunk - Current chunk index (0-based)
 * @param {number} totalChunks - Total number of chunks
 * @returns {number} Progress percentage (0-100)
 */
export const calculateReadingProgress = (currentChunk, totalChunks) => {
  if (totalChunks === 0) return 0;
  return Math.round(((currentChunk + 1) / totalChunks) * 100);
};

/**
 * Gets reading time estimate for a passage
 * @param {number} totalWords - Total words in passage
 * @param {number} wpm - Words per minute reading speed
 * @returns {Object} Time estimate in minutes and seconds
 */
export const getReadingTimeEstimate = (totalWords, wpm = 200) => {
  const totalMinutes = totalWords / wpm;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  
  return {
    minutes,
    seconds,
    totalMinutes: Math.ceil(totalMinutes),
    display: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
  };
};