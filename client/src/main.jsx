import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LogIn from './pages/LogIn.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <LogIn />
    
  </StrictMode>,
)
