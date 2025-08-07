import { useState } from 'react';
import { ReadingProvider, useReading } from './context/ReadingContext';
import PassageSelector from './components/PassageSelector';
import ReadingInterface from './components/ReadingInterface';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function AppContent() {
  const { state } = useReading();
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  const { currentSession, darkMode } = state;

  const handleStartNewSession = () => {
    // Reset to passage selector
    window.location.reload();
  };

  if (currentSession && currentSession.passages.length > 0) {
    // Session is active, show reading interface
    return (
      <>
        <ReadingInterface />
        <SettingsPanel 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </>
    );
  }

  // Default view: passage selector
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <nav className="navbar">
        <h1>📚 Reading Passage Recorder</h1>
        <div className="nav-controls">
          <button 
            onClick={() => setShowSettings(true)}
            className="nav-btn settings-btn"
            title="Display Settings"
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={() => setShowAbout(true)}
            className="nav-btn about-btn"
            title="About this app"
          >
            ℹ️ About
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <div className="app-intro">
          <h2>Mobile Reading Practice</h2>
          <p>
            Select passages for reading practice. Optimized for mobile with 
            touch navigation, customizable display, and teleprompter-style scrolling.
          </p>
          <div className="features-list">
            <div className="feature">📱 Mobile-first touch interface</div>
            <div className="feature">✨ Auto-scroll teleprompter mode</div>
            <div className="feature">🎨 Customizable fonts & themes</div>
            <div className="feature">🔗 URL-based passage tracking</div>
          </div>
        </div>
        
        <PassageSelector />
      </main>

      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {showAbout && (
        <div className="about-overlay">
          <div className="about-panel">
            <div className="about-header">
              <h2>About Reading Passage Recorder</h2>
              <button onClick={() => setShowAbout(false)} className="close-btn">×</button>
            </div>
            <div className="about-content">
              <p>
                A mobile-optimized reading practice app designed to work seamlessly with 
                iOS applications. Select passages at different difficulty levels and practice 
                reading with customizable display settings and intuitive touch navigation.
              </p>
              <h3>Features:</h3>
              <ul>
                <li><strong>Mobile-First Design:</strong> Optimized for touch devices and small screens</li>
                <li><strong>Multiple Difficulty Levels:</strong> From beginner to advanced passages</li>
                <li><strong>Auto-scroll:</strong> Teleprompter-style automatic scrolling</li>
                <li><strong>Touch Navigation:</strong> Swipe or tap to navigate passages</li>
                <li><strong>Focus Mode:</strong> Distraction-free reading environment</li>
                <li><strong>URL Tracking:</strong> Current passage tracked in URL for iOS integration</li>
                <li><strong>Customization:</strong> Adjust fonts, colors, and layout for optimal readability</li>
              </ul>
              <h3>Navigation:</h3>
              <ul>
                <li><strong>Swipe Left/Right:</strong> Navigate between passages</li>
                <li><strong>Tap Sides:</strong> Alternative navigation method</li>
                <li><strong>Tap Center (Focus Mode):</strong> Show/hide controls</li>
                <li><strong>Auto-scroll:</strong> Automatic text scrolling at adjustable speed</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ReadingProvider>
      <AppContent />
    </ReadingProvider>
  );
}

export default App
