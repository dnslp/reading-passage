import { useReading } from '../context/ReadingContext';

function NavigationControls({ 
  onPrevious, 
  onNext, 
  canGoBack, 
  canGoNext, 
  onEndSession 
}) {
  const { state, dispatch, actions } = useReading();
  const { autoScroll, focusMode, scrollSpeed, chunks, currentChunkIndex, currentPassage, readingProgress } = state;

  const toggleAutoScroll = () => {
    dispatch({ type: actions.TOGGLE_AUTO_SCROLL });
  };

  const toggleFocusMode = () => {
    dispatch({ type: actions.TOGGLE_FOCUS_MODE });
  };

  const handleScrollSpeedChange = (e) => {
    dispatch({ 
      type: actions.SET_SCROLL_SPEED, 
      payload: parseInt(e.target.value) 
    });
  };

  if (!currentPassage || !chunks.length) return null;

  return (
    <div className="navigation-controls">
      {/* Chunk progress - prominent on mobile */}
      <div className="chunk-progress">
        <span className="chunk-counter">
          Part {currentChunkIndex + 1} of {chunks.length}
        </span>
        <div className="progress-summary">
          {readingProgress}% of "{currentPassage.title}"
        </div>
      </div>

      {/* Main navigation buttons - large touch targets */}
      <div className="nav-buttons">
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className="nav-btn prev"
          title="Previous part"
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="nav-btn next"
          title="Next part"
        >
          Next →
        </button>
      </div>

      {/* Reading controls - simplified for mobile */}
      <div className="reading-controls">
        <button
          onClick={toggleAutoScroll}
          className={`control-btn auto-scroll ${autoScroll ? 'active' : ''}`}
        >
          {autoScroll ? '⏸ Pause Scroll' : '▶ Auto Scroll'}
        </button>

        <button
          onClick={toggleFocusMode}
          className={`control-btn focus-mode ${focusMode ? 'active' : ''}`}
        >
          {focusMode ? '👁 Show UI' : '🎯 Focus'}
        </button>
        
        <button
          onClick={onEndSession}
          className="control-btn end-session"
        >
          ✕ End Session
        </button>
      </div>

      {/* Auto-scroll speed - only show when active */}
      {autoScroll && (
        <div className="scroll-speed-control">
          <label htmlFor="scrollSpeed">
            Reading Speed: {scrollSpeed} WPM
          </label>
          <input
            id="scrollSpeed"
            type="range"
            min="25"
            max="400"
            step="25"
            value={scrollSpeed}
            onChange={handleScrollSpeedChange}
            className="speed-slider"
          />
        </div>
      )}

      {/* Touch navigation hint */}
      <div className="navigation-hint">
        💡 Swipe left/right or tap sides of text to navigate
      </div>
    </div>
  );
}

export default NavigationControls;