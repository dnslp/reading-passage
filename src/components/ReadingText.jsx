import { useReading } from '../context/ReadingContext';

function ReadingText({ text }) {
  const { state } = useReading();
  const { 
    fontSize, 
    lineHeight, 
    fontFamily, 
    columnView
  } = state;

  const textStyles = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    fontFamily: fontFamily,
    maxWidth: columnView ? '65ch' : '100%',
    margin: columnView ? '0 auto' : '0',
  };

  return (
    <div className="reading-text">
      <div style={textStyles} className="text-content">
        {text.split('\n').map((paragraph, index) => (
          <p key={index} className="text-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ReadingText;