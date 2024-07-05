import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <body className="antialiased bg-[#121212]">
      <App />
    </body>
  </React.StrictMode>
)
