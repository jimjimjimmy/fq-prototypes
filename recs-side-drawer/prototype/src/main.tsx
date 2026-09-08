import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from '@floqastinc/flow-ui_core/Theme'
import { initializeForFrontend } from '@floqastinc/fq-intl'
import './index.css'
import App from './App.tsx'

Theme.apply(null, { standalone: true })
// Required by FlowUI internals that format numbers (e.g. IconButton's
// numericalIndicator, used by the Documents drawer's paperclip badge) -
// without this, formatNumber throws "fq-intl has not been initialized".
initializeForFrontend()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
