import { useUserSettings } from '../context/UserSettingsContext';

// Ensure your global CSS includes theme overrides, e.g.:
//
// [data-theme="light"] { /* defaults from :root */ }
// [data-theme="dark"] { /* dark variables */ }
// [data-theme="sepia"] { /* sepia variables */ }
// [data-theme="solarized"] { /* solarized variables */ }

function SettingsPanel({ isOpen, onClose }) {
  const { settings, setSettings } = useUserSettings();
  const {
    fontSize,
    lineHeight,
    fontFamily,
    columnView,
    scrollSpeed,
    theme,
  } = settings;

  const fontOptions = [
    { value: 'Georgia, serif', label: 'Georgia (Serif)' },
    { value: 'Arial, sans-serif', label: 'Arial (Sans-serif)' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica (Sans-serif)' },
    { value: '"Times New Roman", serif', label: 'Times New Roman (Serif)' },
    { value: 'Verdana, sans-serif', label: 'Verdana (Sans-serif)' },
    { value: '"Courier New", monospace', label: 'Courier New (Monospace)' },
    { value: 'OpenDyslexic, serif', label: 'OpenDyslexic (Custom)' },
  ];


const themeOptions = [
  { value: 'light',      label: 'Light' },
  { value: 'dark',       label: 'Dark' },
  { value: 'sepia',      label: 'Sepia' },
  { value: 'solarized',  label: 'Solarized' },
  { value: 'midnight',   label: 'Midnight' },
  { value: 'forest',     label: 'Forest' },
  { value: 'dracula',    label: 'Dracula' },
  { value: 'high-contrast', label: 'High Contrast' },
];
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: 18,
      lineHeight: 1.6,
      fontFamily: 'Georgia, serif',
      scrollSpeed: 50,
      darkMode: false,
      columnView: false,
      theme: 'light',
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Display Settings</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="settings-content">
          {/* Mobile-optimized compact sections */}
          {/* Text Appearance */}
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
                onChange={e => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
                className="slider"
              />
              <div className="range-labels"><span>12px</span><span>32px</span></div>
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
                onChange={e => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                className="slider"
              />
              <div className="range-labels"><span>Tight</span><span>Loose</span></div>
            </div>

            <div className="setting-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                value={fontFamily}
                onChange={e => handleSettingChange('fontFamily', e.target.value)}
                className="select"
              >
                {fontOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Layout & Theme */}
          <div className="settings-section">
            <h3>Layout & Theme</h3>
            <div className="setting-group">
              <div className="toggle-setting">
                <label htmlFor="columnView">Column Layout</label>
                <button
                  id="columnView"
                  onClick={() => handleSettingChange('columnView', !columnView)}
                  className={`toggle-btn ${columnView ? 'active' : ''}`}
                ><div className="toggle-slider" /></button>
              </div>
              <small className="setting-description">Centers text in a readable column width</small>
            </div>


            <div className="setting-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={e => handleSettingChange('theme', e.target.value)}
                className="select"
              >
                {themeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>


          {/* Compact Preview */}
          <div className="settings-section">
            <h3>Preview</h3>
            <div
              className="preview-text mobile-compact"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight,
                fontFamily,
                maxWidth: columnView ? '65ch' : '100%',
                margin: columnView ? '0 auto' : '0',
              }}
            >
              Sample text showing your font settings.
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="settings-footer">
          <button onClick={resetToDefaults} className="reset-btn">Reset to Defaults</button>
          <button onClick={onClose} className="apply-btn">Apply Settings</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
