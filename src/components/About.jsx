function About() {
  return (
    <div className="about">
      <h2>About This Project</h2>
      <p>
        This is a React application built with Vite and configured for deployment on GitHub Pages.
      </p>
      
      <div className="tech-stack">
        <h3>Technology Stack:</h3>
        <ul>
          <li><strong>React 19:</strong> Frontend JavaScript library</li>
          <li><strong>Vite:</strong> Fast build tool and development server</li>
          <li><strong>React Router:</strong> Client-side routing</li>
          <li><strong>GitHub Pages:</strong> Static site hosting</li>
          <li><strong>GitHub Actions:</strong> Automated deployment</li>
        </ul>
      </div>

      <div className="deployment">
        <h3>Deployment:</h3>
        <p>
          This app is automatically deployed to GitHub Pages using GitHub Actions 
          whenever changes are pushed to the main branch.
        </p>
      </div>
    </div>
  )
}

export default About