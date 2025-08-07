// Text chunking utility for breaking passages into screen-sized portions

/**
 * Estimates how many words can fit on screen based on viewport and font settings
 * @param {Object} settings - Font and display settings
 * @returns {number} Estimated words per chunk
 */
export const estimateWordsPerChunk = (settings = {}) => {
  const {
    fontSize = 20,
    lineHeight = 1.8,
    columnView = true,
  } = settings;
  
  // Get viewport dimensions
  const viewportHeight = window.innerHeight || 800;
  const viewportWidth = window.innerWidth || 375;
  
  // Account for UI elements (navigation, padding, etc.)
  const availableHeight = viewportHeight - 200; // Reserve space for controls
  const availableWidth = columnView ? Math.min(viewportWidth - 32, 800) : viewportWidth - 32;
  
  // Estimate characters per line based on font size and width
  const avgCharWidth = fontSize * 0.6; // Rough estimate for average character width
  const charsPerLine = Math.floor(availableWidth / avgCharWidth);
  
  // Estimate lines that fit on screen
  const lineHeightPx = fontSize * lineHeight;
  const linesPerScreen = Math.floor(availableHeight / lineHeightPx);
  
  // Average words per line (assuming ~5 chars per word + space)
  const wordsPerLine = Math.floor(charsPerLine / 6);
  
  // Total words that fit comfortably on screen
  const wordsPerChunk = Math.max(50, Math.floor(wordsPerLine * linesPerScreen * 0.8)); // 80% to ensure comfortable reading
  
  return wordsPerChunk;
};

/**
 * Breaks text into chunks based on screen capacity
 * @param {string} text - The full text to chunk
 * @param {Object} settings - Display settings
 * @returns {Array} Array of text chunks
 */
export const createTextChunks = (text, settings = {}) => {
  const wordsPerChunk = estimateWordsPerChunk(settings);
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunkWords = words.slice(i, i + wordsPerChunk);
    const chunkText = chunkWords.join(' ');
    
    chunks.push({
      id: i / wordsPerChunk,
      text: chunkText,
      wordStart: i,
      wordEnd: i + chunkWords.length - 1,
      wordCount: chunkWords.length,
    });
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