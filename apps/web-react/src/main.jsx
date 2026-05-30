import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Mobile POS React Workspace</h1>
      <p>Shared web components and fallback POS UI.</p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
