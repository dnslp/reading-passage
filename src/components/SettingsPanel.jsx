import { useReading } from '../context/ReadingContext';

function SettingsPanel({ isOpen, onClose }) {
  const { state, dispatch, actions } = useReading();
  const {
    fontSize,
    lineHeight,
    fontFamily,
    darkMode,
    columnView,
    contrast,
    scrollSpeed,
  } = state;

  const fontOptions = [
    { value: 'Georgia', label: 'Georgia (Serif)' },
    { value: 'Arial', label: 'Arial (Sans-serif)' },
    { value: 'Helvetica', label: 'Helvetica (Sans-serif)' },
    { value: '"Times New Roman"', label: 'Times New Roman (Serif)' },
    { value: 'Verdana', label: 'Verdana (Sans-serif)' },
    { value: '"Courier New"', label: 'Courier New (Monospace)' },
  ];

  const contrastOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Contrast' },
    { value: 'low', label: 'Low Contrast' },
  ];

  const handleFontSizeChange = (e) => {
    dispatch({ type: actions.SET_FONT_SIZE, payload: parseInt(e.target.value) });
  };

  const handleLineHeightChange = (e) => {
    dispatch({ type: actions.SET_LINE_HEIGHT, payload: parseFloat(e.target.value) });
  };

  const handleFontFamilyChange = (e) => {
    dispatch({ type: actions.SET_FONT_FAMILY, payload: e.target.value });
  };

  const toggleDarkMode = () => {
    dispatch({ type: actions.TOGGLE_DARK_MODE });
  };

  const toggleColumnView = () => {
    dispatch({ type: actions.TOGGLE_COLUMN_VIEW });
  };

  const handleContrastChange = (e) => {
    dispatch({ type: actions.SET_CONTRAST, payload: e.target.value });
  };

  const handleScrollSpeedChange = (e) => {
    dispatch({ type: actions.SET_SCROLL_SPEED, payload: parseInt(e.target.value) });
  };

  const resetToDefaults = () => {
    dispatch({ type: actions.SET_FONT_SIZE, payload: 18 });
    dispatch({ type: actions.SET_LINE_HEIGHT, payload: 1.6 });
    dispatch({ type: actions.SET_FONT_FAMILY, payload: 'Georgia' });
    dispatch({ type: actions.SET_CONTRAST, payload: 'normal' });
    dispatch({ type: actions.SET_SCROLL_SPEED, payload: 50 });
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className={`settings-panel ${darkMode ? 'dark' : ''}`}>
        <div className="settings-header">
          <h2>Display Settings</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Text Appearance</h3>
            
            <div className="setting-group">
              <label htmlFor="fontSize">Font Size: {fontSize}px</label>
              <input
                id="fontSize"
                type="range"
                min="12"
                max="32"
                step="1"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="slider"
              />
              <div className="range-labels">
                <span>12px</span>
                <span>32px</span>
              </div>
            </div>

            <div className="setting-group">
              <label htmlFor="lineHeight">Line Spacing: {lineHeight}</label>
              <input
                id="lineHeight"
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={lineHeight}
                onChange={handleLineHeightChange}
                className="slider"
              />
              <div className="range-labels">
                <span>Tight</span>
                <span>Loose</span>
              </div>
            </div>

            <div className="setting-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                value={fontFamily}
                onChange={handleFontFamilyChange}
                className="select"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Layout & Theme</h3>
            
            <div className="setting-group">
              <div className="toggle-setting">
                <label htmlFor="darkMode">Dark Mode</label>
                <button
                  id="darkMode"
                  onClick={toggleDarkMode}
                  className={`toggle-btn ${darkMode ? 'active' : ''}`}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>

            <div className="setting-group">
              <div className="toggle-setting">
                <label htmlFor="columnView">Column Layout</label>
                <button
                  id="columnView"
                  onClick={toggleColumnView}
                  className={`toggle-btn ${columnView ? 'active' : ''}`}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
              <small className="setting-description">
                Centers text in a readable column width
              </small>
            </div>

            <div className="setting-group">
              <label htmlFor="contrast">Contrast</label>
              <select
                id="contrast"
                value={contrast}
                onChange={handleContrastChange}
                className="select"
              >
                {contrastOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Reading Controls</h3>
            
            <div className="setting-group">
              <label htmlFor="scrollSpeed">Auto-scroll Speed: {scrollSpeed} WPM</label>
              <input
                id="scrollSpeed"
                type="range"
                min="25"
                max="400"
                step="25"
                value={scrollSpeed}
                onChange={handleScrollSpeedChange}
                className="slider"
              />
              <div className="range-labels">
                <span>25 WPM</span>
                <span>400 WPM</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Preview</h3>
            <div 
              className="preview-text"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontFamily: fontFamily,
                maxWidth: columnView ? '65ch' : '100%',
                margin: columnView ? '0 auto' : '0',
              }}
            >
              The quick brown fox jumps over the lazy dog. This text demonstrates 
              your current font and spacing settings. You can adjust the settings 
              above to see how they affect readability.
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={resetToDefaults} className="reset-btn">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="apply-btn">
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;