function About() {
  return (
    <div className="about">
      <h2>About This App</h2>
      <p>
        A mobile-friendly reading app built with React for focused reading practice.
      </p>
      
      <div className="tech-stack">
        <h3>Built With:</h3>
        <ul className="tech-list">
          <li><strong>React 19</strong> - UI framework</li>
          <li><strong>Vite</strong> - Build tool</li>
          <li><strong>GitHub Pages</strong> - Hosting</li>
        </ul>
      </div>

      <div className="features">
        <h3>Features:</h3>
        <ul className="feature-list">
          <li>Customizable reading settings</li>
          <li>Progress tracking</li>
          <li>Multiple themes</li>
          <li>Mobile-optimized interface</li>
        </ul>
      </div>
    </div>
  )
}

export default About