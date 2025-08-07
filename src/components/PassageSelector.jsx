import { useState, useEffect } from 'react';
import { passages, getPassagesByDifficulty, getTotalWordCount } from '../data/passages';
import { useReading, getUrlParams } from '../context/ReadingContext';

function PassageSelector() {
  const { dispatch, actions } = useReading();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPassages, setSelectedPassages] = useState([]);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Check for URL parameters on mount to pre-select passages
  useEffect(() => {
    const urlParams = getUrlParams();
    if (urlParams.passageId) {
      // If there's a specific passage in URL, select it
      setSelectedPassages([urlParams.passageId]);
    }
  }, []);
  
  const getFilteredPassages = () => {
    if (selectedDifficulty === 'all') return passages;
    return getPassagesByDifficulty(selectedDifficulty);
  };

  const handlePassageToggle = (passageId) => {
    setSelectedPassages(prev => 
      prev.includes(passageId)
        ? prev.filter(id => id !== passageId)
        : [...prev, passageId]
    );
  };

  const handleSelectAll = () => {
    const filteredPassages = getFilteredPassages();
    const allIds = filteredPassages.map(p => p.id);
    setSelectedPassages(
      selectedPassages.length === allIds.length ? [] : allIds
    );
  };

  const startSession = () => {
    const sessionPassages = passages.filter(p => selectedPassages.includes(p.id));
    const urlParams = getUrlParams();
    
    // Find initial passage index from URL parameters
    let initialPassageIndex = 0;
    if (urlParams.passageId) {
      const foundIndex = sessionPassages.findIndex(p => p.id === urlParams.passageId);
      if (foundIndex !== -1) {
        initialPassageIndex = foundIndex;
      }
    }
    
    dispatch({
      type: actions.START_SESSION,
      payload: {
        passages: sessionPassages,
        difficulty: selectedDifficulty,
        initialPassageIndex: initialPassageIndex,
      },
    });
  };

  const filteredPassages = getFilteredPassages();
  const selectedPassageData = passages.filter(p => selectedPassages.includes(p.id));
  const totalWords = getTotalWordCount(selectedPassageData);
  const estimatedTime = Math.ceil(totalWords / 150); // Assuming 150 words per minute

  return (
    <div className="passage-selector">
      <div className="selector-header">
        <h2>Select Reading Passages</h2>
        <p>Choose the passages you want to practice reading</p>
      </div>

      <div className="difficulty-filter">
        <label>Filter by difficulty:</label>
        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="difficulty-select"
        >
          {difficulties.map(diff => (
            <option key={diff} value={diff}>
              {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="passage-list">
        <div className="list-controls">
          <button 
            onClick={handleSelectAll}
            className="select-all-btn"
          >
            {selectedPassages.length === filteredPassages.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="passage-count">
            {filteredPassages.length} passages available
          </span>
        </div>

        {filteredPassages.map(passage => (
          <div 
            key={passage.id} 
            className={`passage-item ${selectedPassages.includes(passage.id) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              id={`passage-${passage.id}`}
              checked={selectedPassages.includes(passage.id)}
              onChange={() => handlePassageToggle(passage.id)}
              className="passage-checkbox"
            />
            <label htmlFor={`passage-${passage.id}`} className="passage-label">
              <div className="passage-info">
                <h3 className="passage-title">{passage.title}</h3>
                <div className="passage-meta">
                  <span className={`difficulty-badge ${passage.difficulty}`}>
                    {passage.difficulty}
                  </span>
                  <span className="word-count">{passage.wordCount} words</span>
                </div>
                <p className="passage-preview">
                  {passage.text.substring(0, 120)}...
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {selectedPassages.length > 0 && (
        <div className="session-summary">
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Selected Passages:</span>
              <span className="stat-value">{selectedPassages.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Words:</span>
              <span className="stat-value">{totalWords}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Estimated Time:</span>
              <span className="stat-value">{estimatedTime} min</span>
            </div>
          </div>
          <button 
            onClick={startSession}
            className="start-session-btn"
          >
            Start Reading Session
          </button>
        </div>
      )}
    </div>
  );
}

export default PassageSelector;