import { createContext, useContext, useReducer, useEffect } from 'react';
import { createTextChunks, calculateReadingProgress } from '../utils/textChunking';
import { useUserSettings } from './UserSettingsContext';

const ReadingContext = createContext();

// Action types
const ACTIONS = {
  START_SESSION: 'START_SESSION',
  END_SESSION: 'END_SESSION',
  NEXT_CHUNK: 'NEXT_CHUNK',
  PREVIOUS_CHUNK: 'PREVIOUS_CHUNK',
  GO_TO_CHUNK: 'GO_TO_CHUNK',
  REGENERATE_CHUNKS: 'REGENERATE_CHUNKS',
  
  // Display settings
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_LINE_HEIGHT: 'SET_LINE_HEIGHT',
  SET_FONT_FAMILY: 'SET_FONT_FAMILY',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  TOGGLE_FOCUS_MODE: 'TOGGLE_FOCUS_MODE',
  TOGGLE_COLUMN_VIEW: 'TOGGLE_COLUMN_VIEW',
  
  // Reading controls
  TOGGLE_AUTO_SCROLL: 'TOGGLE_AUTO_SCROLL',
  SET_SCROLL_SPEED: 'SET_SCROLL_SPEED',
  
  // UI state
  TOGGLE_CONTROLS: 'TOGGLE_CONTROLS',
  SET_SESSION_PROGRESS: 'SET_SESSION_PROGRESS',
};

// URL parameter utilities
const updateUrlParams = (passageId, chunkIndex) => {
  const url = new URL(window.location);
  url.searchParams.set('passageId', passageId);
  url.searchParams.set('chunk', chunkIndex);
  window.history.replaceState({}, '', url);
};

const getUrlParams = () => {
  const url = new URL(window.location);
  return {
    passageId: parseInt(url.searchParams.get('passageId')) || null,
    chunk: parseInt(url.searchParams.get('chunk')) || 0,
  };
};

// Reducer function
function readingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_SESSION:
      const passage = action.payload.passage;
      const initialChunkIndex = action.payload.initialChunkIndex || 0;
      
      // Generate chunks based on current display settings
      const chunks = createTextChunks(passage.text, {
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        columnView: state.columnView,
        fontFamily: state.fontFamily,
      });
      
      const validChunkIndex = Math.min(initialChunkIndex, chunks.length - 1);
      const progress = calculateReadingProgress(validChunkIndex, chunks.length);
      
      // Update URL with passage and chunk
      updateUrlParams(passage.id, validChunkIndex);
      
      return {
        ...state,
        currentSession: {
          id: Date.now(),
          startTime: new Date(),
          passageId: passage.id,
        },
        currentPassage: passage,
        chunks: chunks,
        currentChunkIndex: validChunkIndex,
        readingProgress: progress,
      };
      
    case ACTIONS.END_SESSION:
      // Clear URL parameters when session ends
      const url = new URL(window.location);
      url.searchParams.delete('passageId');
      url.searchParams.delete('chunk');
      window.history.replaceState({}, '', url);
      
      return {
        ...state,
        currentSession: null,
        currentPassage: null,
        chunks: [],
        currentChunkIndex: 0,
        readingProgress: 0,
      };
      
    case ACTIONS.NEXT_CHUNK:
      const nextChunkIndex = Math.min(state.currentChunkIndex + 1, state.chunks.length - 1);
      const nextProgress = calculateReadingProgress(nextChunkIndex, state.chunks.length);
      
      // Update URL
      if (state.currentPassage) {
        updateUrlParams(state.currentPassage.id, nextChunkIndex);
      }
      
      return {
        ...state,
        currentChunkIndex: nextChunkIndex,
        readingProgress: nextProgress,
      };
      
    case ACTIONS.PREVIOUS_CHUNK:
      const prevChunkIndex = Math.max(state.currentChunkIndex - 1, 0);
      const prevProgress = calculateReadingProgress(prevChunkIndex, state.chunks.length);
      
      // Update URL
      if (state.currentPassage) {
        updateUrlParams(state.currentPassage.id, prevChunkIndex);
      }
      
      return {
        ...state,
        currentChunkIndex: prevChunkIndex,
        readingProgress: prevProgress,
      };
      
    case ACTIONS.GO_TO_CHUNK:
      const targetChunkIndex = Math.max(0, Math.min(action.payload, state.chunks.length - 1));
      const targetProgress = calculateReadingProgress(targetChunkIndex, state.chunks.length);
      
      // Update URL
      if (state.currentPassage) {
        updateUrlParams(state.currentPassage.id, targetChunkIndex);
      }
      
      return {
        ...state,
        currentChunkIndex: targetChunkIndex,
        readingProgress: targetProgress,
      };
      
    case ACTIONS.REGENERATE_CHUNKS:
      // Regenerate chunks when display settings change
      if (!state.currentPassage) return state;
      
      const newChunks = createTextChunks(state.currentPassage.text, {
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        columnView: state.columnView,
        fontFamily: state.fontFamily,
      });
      
      // Adjust current chunk index to maintain relative position
      const currentWordPosition = state.chunks[state.currentChunkIndex]?.wordStart || 0;
      let newChunkIndex = 0;
      
      for (let i = 0; i < newChunks.length; i++) {
        if (newChunks[i].wordStart <= currentWordPosition && 
            newChunks[i].wordEnd >= currentWordPosition) {
          newChunkIndex = i;
          break;
        }
      }
      
      const newProgress = calculateReadingProgress(newChunkIndex, newChunks.length);
      
      // Update URL
      updateUrlParams(state.currentPassage.id, newChunkIndex);
      
      return {
        ...state,
        chunks: newChunks,
        currentChunkIndex: newChunkIndex,
        readingProgress: newProgress,
      };
      
    case ACTIONS.SET_FONT_SIZE:
      const newState1 = { ...state, fontSize: action.payload };
      // Regenerate chunks if in session
      return newState1;
      
    case ACTIONS.SET_LINE_HEIGHT:
      const newState2 = { ...state, lineHeight: action.payload };
      return newState2;
      
    case ACTIONS.SET_FONT_FAMILY:
      return { ...state, fontFamily: action.payload };
      
    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
      
    case ACTIONS.TOGGLE_FOCUS_MODE:
      return { 
        ...state, 
        focusMode: !state.focusMode,
        showControls: state.focusMode, // Show controls when exiting focus mode
      };
      
    case ACTIONS.TOGGLE_COLUMN_VIEW:
      const newState3 = { ...state, columnView: !state.columnView };
      return newState3;
      
      
    case ACTIONS.TOGGLE_AUTO_SCROLL:
      return { ...state, autoScroll: !state.autoScroll };
      
    case ACTIONS.SET_SCROLL_SPEED:
      return { ...state, scrollSpeed: action.payload };
      
    case ACTIONS.TOGGLE_CONTROLS:
      return { ...state, showControls: !state.showControls };
      
    case ACTIONS.SET_SESSION_PROGRESS:
      return { ...state, sessionProgress: action.payload };
      
    default:
      return state;
  }
}

// Context Provider
export function ReadingProvider({ children }) {
  const { settings } = useUserSettings();

  const initialState = {
    // Session management
    currentSession: null,
    currentPassage: null,
    currentChunkIndex: 0,
    chunks: [],
    readingProgress: 0,

    // Display preferences from UserSettingsContext
    ...settings,

    // Reading controls
    autoScroll: false,

    // UI state
    showControls: true,
    showProgress: true,
  };

  const [state, dispatch] = useReducer(readingReducer, initialState);

  // Regenerate chunks when display settings change during active session
  useEffect(() => {
    if (state.currentSession && state.currentPassage) {
      dispatch({ type: ACTIONS.REGENERATE_CHUNKS });
    }
  }, [settings.fontSize, settings.lineHeight, settings.columnView, settings.fontFamily, state.currentSession, state.currentPassage]);
  
  const value = {
    state: { ...state, ...settings }, // Combine reading state with user settings
    dispatch,
    actions: ACTIONS,
    urlUtils: { getUrlParams, updateUrlParams },
  };
  
  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
}

// Custom hook to use the reading context
export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
}

// Export utilities for external use
export { getUrlParams, updateUrlParams };