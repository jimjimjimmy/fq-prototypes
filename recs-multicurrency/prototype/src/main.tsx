import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from '@floqastinc/flow-ui_core/Theme'
import './index.css'
import App from './App.tsx'

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
Theme.apply(null, { standalone: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
