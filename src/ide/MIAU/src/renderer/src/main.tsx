import './assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BlockProvider } from './context/sound'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BlockProvider>
      <App />
    </BlockProvider>
  </React.StrictMode>
)
