import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserSettingsProvider } from './context/UserSettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserSettingsProvider>
      <App />
    </UserSettingsProvider>
  </StrictMode>,
)
