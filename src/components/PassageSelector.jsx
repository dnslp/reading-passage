import { useState, useEffect } from 'react';
import { passages, getPassagesByTag, getUniqueTags } from '../data/passages';
import { useReading, getUrlParams } from '../context/ReadingContext';
import { getReadingTimeEstimate } from '../utils/textChunking';

function PassageSelector() {
  const { dispatch, actions } = useReading();
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedPassageId, setSelectedPassageId] = useState(null);

  const tags = getUniqueTags();

  // Check for URL parameters on mount to pre-select passage
  useEffect(() => {
    const urlParams = getUrlParams();
    if (urlParams.passageId) {
      setSelectedPassageId(urlParams.passageId);
    }
  }, []);
  
  const getFilteredPassages = () => {
    return getPassagesByTag(selectedTag);
  };

  const handlePassageSelect = (passageId) => {
    setSelectedPassageId(passageId === selectedPassageId ? null : passageId);
  };

  const startSession = () => {
    const selectedPassage = passages.find(p => p.id === selectedPassageId);
    if (!selectedPassage) return;
    
    const urlParams = getUrlParams();
    const initialChunkIndex = urlParams.chunk || 0;
    
    dispatch({
      type: actions.START_SESSION,
      payload: {
        passage: selectedPassage,
        initialChunkIndex: initialChunkIndex,
      },
    });
  };

  const filteredPassages = getFilteredPassages();
  const selectedPassage = passages.find(p => p.id === selectedPassageId);
  const timeEstimate = selectedPassage ? getReadingTimeEstimate(selectedPassage.wordCount) : null;

  return (
    <div className="passage-selector">
      <div className="selector-header">
        <h2>Select Reading Passages</h2>
        <p>Choose the passages you want to practice reading</p>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="tag-filter">Filter by Tag:</label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-select"
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Passages' : tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="passage-list">
        <div className="list-controls">
          <span className="passage-count">
            {filteredPassages.length} passages available
          </span>
        </div>

        {filteredPassages.map(passage => (
          <div 
            key={passage.id} 
            className={`passage-item ${selectedPassageId === passage.id ? 'selected' : ''}`}
            onClick={() => handlePassageSelect(passage.id)}
          >
            <div className="passage-info">
              <h3 className="passage-title">{passage.title}</h3>
              <div className="passage-meta">
                <div className="passage-tags">
                  {passage.tags.map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
                <span className="word-count">{passage.wordCount} words</span>
                <span className="reading-time">
                  ~{getReadingTimeEstimate(passage.wordCount).display}
                </span>
              </div>
              <p className="passage-preview">
                {passage.text.substring(0, 120)}...
              </p>
            </div>
            {selectedPassageId === passage.id && (
              <div className="selection-indicator">✓</div>
            )}
          </div>
        ))}
      </div>

      {selectedPassage && (
        <div className="session-summary">
          <div className="selected-passage-info">
            <h3>Selected Passage:</h3>
            <div className="passage-details">
              <span className="passage-name">{selectedPassage.title}</span>
              <div className="passage-stats">
                <div className="passage-tags">
                  {selectedPassage.tags.map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
                <span>{selectedPassage.wordCount} words</span>
                <span>~{timeEstimate.display} reading time</span>
              </div>
            </div>
          </div>
          <button 
            onClick={startSession}
            className="start-session-btn"
          >
            Start Reading
          </button>
        </div>
      )}
    </div>
  );
}

export default PassageSelector;