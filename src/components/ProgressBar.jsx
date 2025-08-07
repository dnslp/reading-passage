import { useReading } from '../context/ReadingContext';

function ProgressBar() {
  const { state } = useReading();
  const { readingProgress, chunks, currentChunkIndex, currentPassage } = state;

  if (!currentPassage || !chunks.length) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-text">
          {currentPassage.title}
        </span>
        <span className="progress-details">
          Part {currentChunkIndex + 1} of {chunks.length} • {readingProgress}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${readingProgress}%` }}
        />
        <div className="chunk-markers">
          {chunks.map((_, index) => (
            <div
              key={index}
              className={`chunk-marker ${index <= currentChunkIndex ? 'completed' : ''}`}
              style={{ left: `${((index + 1) / chunks.length) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;