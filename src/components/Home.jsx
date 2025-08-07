import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="home">
      <h2>Welcome to Reading Passage</h2>
      <p>This is a React application deployed on GitHub Pages.</p>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Click the button above to increment the counter.
        </p>
      </div>
      
      <div className="features">
        <h3>Features:</h3>
        <ul>
          <li>React 19 with Vite</li>
          <li>React Router for navigation</li>
          <li>GitHub Pages deployment</li>
          <li>GitHub Actions CI/CD</li>
        </ul>
      </div>
    </div>
  )
}

export default Home