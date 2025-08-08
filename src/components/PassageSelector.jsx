import { useState, useEffect } from 'react';
import { passages, getPassagesByTag, getUniqueTags } from '../data/passages';
import { useReading, getUrlParams } from '../context/ReadingContext';
import { getReadingTimeEstimate } from '../utils/textChunking';

function PassageSelector() {
  const { dispatch, actions } = useReading();
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedPassageId, setSelectedPassageId] = useState(null);

const tags = Array.from(new Set(['all', ...getUniqueTags()]));

  // Pre-select from URL
  useEffect(() => {
    const { passageId } = getUrlParams();
    if (passageId) setSelectedPassageId(passageId);
  }, []);

  const filteredPassages = getPassagesByTag(selectedTag);
  const selectedPassage = passages.find(p => p.id === selectedPassageId);
  const timeEstimate = selectedPassage ? getReadingTimeEstimate(selectedPassage.wordCount) : null;

  const handlePassageSelect = (id) => {
    setSelectedPassageId(prev => (prev === id ? null : id));
  };

  const startSession = () => {
    if (!selectedPassage) return;
    const { chunk = 0 } = getUrlParams();
    dispatch({
      type: actions.START_SESSION,
      payload: { passage: selectedPassage, initialChunkIndex: chunk }
    });
  };

  return (
    <div className="passage-selector">
      <header className="selector-header">
        <h3>Select a Passage</h3>
        {/* <p>Practice reading: choose a passage below.</p> */}
      </header>

      {/* Tag Filter as Buttons */}
      <div className="filter-controls">
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Passage List */}
      <ul className="passage-list">
        {filteredPassages.map(passage => (
          <li
            key={passage.id}
            className={`passage-item ${selectedPassageId === passage.id ? 'selected' : ''}`}
            onClick={() => handlePassageSelect(passage.id)}
          >
            <div className="passage-info">
              <h3 className="passage-title">{passage.title}</h3>
              <div className="passage-meta">
                {passage.tags.map(tag => (
                  <span key={tag} className="tag-badge">{tag}</span>
                ))}
                <span className="reading-time">
                  🕒 ~{getReadingTimeEstimate(passage.wordCount).display}
                </span>
              </div>
              <p className="passage-preview">{passage.text.slice(0, 100)}…</p>
              {selectedPassageId === passage.id && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    startSession();
                  }} 
                  className="start-session-btn-inline"
                >
                  Start Reading →
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PassageSelector;
