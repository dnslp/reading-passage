import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import About from './components/About'

function App() {
  return (
    <Router basename="/reading-passage">
      <div className="app">
        <nav className="navbar">
          <h1>Reading Passage</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
