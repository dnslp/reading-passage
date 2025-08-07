import { createContext, useContext, useReducer, useEffect } from 'react';

const ReadingContext = createContext();

// Initial state
const initialState = {
  // Session management
  currentSession: null,
  currentPassageIndex: 0,
  passages: [],
  sessionProgress: 0,
  
  // Display preferences
  fontSize: 20, // Larger default for mobile
  lineHeight: 1.8, // More spacing for mobile reading
  fontFamily: 'Georgia',
  darkMode: false,
  focusMode: false,
  columnView: true,
  contrast: 'normal',
  
  // Reading controls
  autoScroll: false,
  scrollSpeed: 50, // words per minute
  
  // UI state
  showControls: true,
  showProgress: true,
};

// Action types
const ACTIONS = {
  START_SESSION: 'START_SESSION',
  END_SESSION: 'END_SESSION',
  NEXT_PASSAGE: 'NEXT_PASSAGE',
  PREVIOUS_PASSAGE: 'PREVIOUS_PASSAGE',
  GO_TO_PASSAGE: 'GO_TO_PASSAGE',
  
  // Display settings
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_LINE_HEIGHT: 'SET_LINE_HEIGHT',
  SET_FONT_FAMILY: 'SET_FONT_FAMILY',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  TOGGLE_FOCUS_MODE: 'TOGGLE_FOCUS_MODE',
  TOGGLE_COLUMN_VIEW: 'TOGGLE_COLUMN_VIEW',
  SET_CONTRAST: 'SET_CONTRAST',
  
  // Reading controls
  TOGGLE_AUTO_SCROLL: 'TOGGLE_AUTO_SCROLL',
  SET_SCROLL_SPEED: 'SET_SCROLL_SPEED',
  
  // UI state
  TOGGLE_CONTROLS: 'TOGGLE_CONTROLS',
  SET_SESSION_PROGRESS: 'SET_SESSION_PROGRESS',
};

// URL parameter utilities
const updateUrlParams = (passageIndex, passageId) => {
  const url = new URL(window.location);
  url.searchParams.set('passage', passageIndex);
  url.searchParams.set('passageId', passageId);
  window.history.replaceState({}, '', url);
};

const getUrlParams = () => {
  const url = new URL(window.location);
  return {
    passage: parseInt(url.searchParams.get('passage')) || 0,
    passageId: parseInt(url.searchParams.get('passageId')) || null,
  };
};

// Reducer function
function readingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_SESSION:
      const initialPassageIndex = action.payload.initialPassageIndex || 0;
      const passages = action.payload.passages;
      const currentPassage = passages[initialPassageIndex];
      
      // Update URL with initial passage
      if (currentPassage) {
        updateUrlParams(initialPassageIndex, currentPassage.id);
      }
      
      return {
        ...state,
        currentSession: {
          id: Date.now(),
          startTime: new Date(),
          passages: passages,
          difficulty: action.payload.difficulty,
        },
        passages: passages,
        currentPassageIndex: initialPassageIndex,
        sessionProgress: ((initialPassageIndex + 1) / passages.length) * 100,
      };
      
    case ACTIONS.END_SESSION:
      // Clear URL parameters when session ends
      const url = new URL(window.location);
      url.searchParams.delete('passage');
      url.searchParams.delete('passageId');
      window.history.replaceState({}, '', url);
      
      return {
        ...state,
        currentSession: null,
        passages: [],
        currentPassageIndex: 0,
        sessionProgress: 0,
      };
      
    case ACTIONS.NEXT_PASSAGE:
      const nextIndex = Math.min(state.currentPassageIndex + 1, state.passages.length - 1);
      const nextPassage = state.passages[nextIndex];
      
      if (nextPassage) {
        updateUrlParams(nextIndex, nextPassage.id);
      }
      
      return {
        ...state,
        currentPassageIndex: nextIndex,
        sessionProgress: ((nextIndex + 1) / state.passages.length) * 100,
      };
      
    case ACTIONS.PREVIOUS_PASSAGE:
      const prevIndex = Math.max(state.currentPassageIndex - 1, 0);
      const prevPassage = state.passages[prevIndex];
      
      if (prevPassage) {
        updateUrlParams(prevIndex, prevPassage.id);
      }
      
      return {
        ...state,
        currentPassageIndex: prevIndex,
        sessionProgress: ((prevIndex + 1) / state.passages.length) * 100,
      };
      
    case ACTIONS.GO_TO_PASSAGE:
      const targetPassage = state.passages[action.payload];
      
      if (targetPassage) {
        updateUrlParams(action.payload, targetPassage.id);
      }
      
      return {
        ...state,
        currentPassageIndex: action.payload,
        sessionProgress: ((action.payload + 1) / state.passages.length) * 100,
      };
      
    case ACTIONS.SET_FONT_SIZE:
      return { ...state, fontSize: action.payload };
      
    case ACTIONS.SET_LINE_HEIGHT:
      return { ...state, lineHeight: action.payload };
      
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
      return { ...state, columnView: !state.columnView };
      
    case ACTIONS.SET_CONTRAST:
      return { ...state, contrast: action.payload };
      
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
  const [state, dispatch] = useReducer(readingReducer, initialState);
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('readingPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      Object.entries(preferences).forEach(([key, value]) => {
        const actionType = `SET_${key.toUpperCase()}`;
        if (ACTIONS[actionType]) {
          dispatch({ type: ACTIONS[actionType], payload: value });
        }
      });
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    const preferences = {
      fontSize: state.fontSize,
      lineHeight: state.lineHeight,
      fontFamily: state.fontFamily,
      darkMode: state.darkMode,
      columnView: state.columnView,
      contrast: state.contrast,
      scrollSpeed: state.scrollSpeed,
    };
    localStorage.setItem('readingPreferences', JSON.stringify(preferences));
  }, [state.fontSize, state.lineHeight, state.fontFamily, state.darkMode, 
      state.columnView, state.contrast, state.scrollSpeed]);
  
  const value = {
    state,
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