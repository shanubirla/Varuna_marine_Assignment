import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'  // ✅ default import, no curly braces

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

