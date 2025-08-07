import { useState, useEffect, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import ProgressBar from './ProgressBar';
import NavigationControls from './NavigationControls';
import ReadingText from './ReadingText';

function ReadingInterface() {
  const { state, dispatch, actions } = useReading();
  const readingAreaRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const { 
    passages, 
    currentPassageIndex, 
    sessionProgress, 
    showControls, 
    focusMode,
    autoScroll,
    scrollSpeed,
    darkMode,
  } = state;

  const currentPassage = passages[currentPassageIndex];
  const isFirstPassage = currentPassageIndex === 0;
  const isLastPassage = currentPassageIndex === passages.length - 1;

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || !readingAreaRef.current) return;

    const scrollSpeed_ms = (60000 / scrollSpeed) * 0.1; // Convert WPM to ms per scroll
    const interval = setInterval(() => {
      if (readingAreaRef.current) {
        readingAreaRef.current.scrollBy(0, 1);
        
        // Check if we've reached the bottom
        const { scrollTop, scrollHeight, clientHeight } = readingAreaRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          // Auto-advance to next passage if available
          if (!isLastPassage) {
            handleNextPassage();
          } else {
            dispatch({ type: actions.TOGGLE_AUTO_SCROLL });
          }
        }
      }
    }, scrollSpeed_ms);

    return () => clearInterval(interval);
  }, [autoScroll, scrollSpeed, isLastPassage, dispatch, actions]);

  // Touch gesture handling
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && !isLastPassage) {
      handleNextPassage();
    }
    if (isRightSwipe && !isFirstPassage) {
      handlePreviousPassage();
    }
  };

  // Tap navigation handling
  const handleTapNavigation = (e) => {
    if (focusMode) {
      dispatch({ type: actions.TOGGLE_FOCUS_MODE });
      return;
    }

    const rect = readingAreaRef.current.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (tapX > centerX && !isLastPassage) {
      handleNextPassage();
    } else if (tapX <= centerX && !isFirstPassage) {
      handlePreviousPassage();
    }
  };

  const handleNextPassage = () => {
    dispatch({ type: actions.NEXT_PASSAGE });
    if (readingAreaRef.current) {
      readingAreaRef.current.scrollTop = 0;
    }
  };

  const handlePreviousPassage = () => {
    dispatch({ type: actions.PREVIOUS_PASSAGE });
    if (readingAreaRef.current) {
      readingAreaRef.current.scrollTop = 0;
    }
  };

  const handleEndSession = () => {
    dispatch({ type: actions.END_SESSION });
  };

  if (!currentPassage) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`reading-interface ${darkMode ? 'dark' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {!focusMode && <ProgressBar />}
      
      <div className="reading-container">
        <div 
          className="reading-area"
          ref={readingAreaRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleTapNavigation}
        >
          <div className="passage-header">
            {!focusMode && (
              <>
                <h2 className="passage-title">{currentPassage.title}</h2>
                <div className="passage-meta">
                  <span className={`difficulty-badge ${currentPassage.difficulty}`}>
                    {currentPassage.difficulty}
                  </span>
                  <span className="passage-counter">
                    Passage {currentPassageIndex + 1} of {passages.length}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <ReadingText text={currentPassage.text} />
        </div>

        {!focusMode && showControls && (
          <div className="controls-container">
            <NavigationControls
              onPrevious={handlePreviousPassage}
              onNext={handleNextPassage}
              canGoBack={!isFirstPassage}
              canGoNext={!isLastPassage}
              onEndSession={handleEndSession}
            />
          </div>
        )}
      </div>

      {!focusMode && (
        <div className="reading-instructions">
          <p>
            <strong>Navigation:</strong> Swipe left/right or tap sides to navigate • 
            Tap center in focus mode to show controls
          </p>
        </div>
      )}
    </div>
  );
}

export default ReadingInterface;