import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. FORZAR SCROLL ARRIBA AL RECARGAR (Reset de memoria del navegador)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 2. Garantizar que empiece en 0,0 antes de pintar nada
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)