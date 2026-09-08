import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from '@floqastinc/flow-ui_core/Theme'
import './index.css'
import { App } from './showcase/App.tsx'

// Initialize FlowUI theme — injects the ~921 CSS token vars, fonts, and global styles
// onto :root. Must run before render so var(--flo-sem-*) references resolve.
Theme.apply(null, { standalone: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
