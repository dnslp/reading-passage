import { useReading } from '../context/ReadingContext';

function ProgressBar() {
  const { state } = useReading();
  const { sessionProgress, passages, currentPassageIndex } = state;

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-text">
          {currentPassageIndex + 1} / {passages.length} passages
        </span>
        <span className="progress-percentage">
          {Math.round(sessionProgress)}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${sessionProgress}%` }}
        />
        <div className="passage-markers">
          {passages.map((_, index) => (
            <div
              key={index}
              className={`passage-marker ${index <= currentPassageIndex ? 'completed' : ''}`}
              style={{ left: `${(index / (passages.length - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;