import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@floqastinc/flow-ui_core'
import Theme from '@floqastinc/flow-ui_core/Theme'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import './index.css'
import App from './App.tsx'

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
// eslint-disable-next-line prefer-spread -- Flow UI's Theme.apply() API requires this calling convention
Theme.apply(null, { standalone: true })

// FlowUI's legacy-global-styles.css overrides font-family to Open Sans at
// runtime (and Open Sans isn't even loaded here — it falls back to a system
// sans). Fix typography by injecting a style tag after Theme.apply():
//   - Body/data text → Inter (loaded via index.html). `!important` on the app
//     roots because a FlowUI version bump made their rule beat a plain shim.
//   - Headings → Museo Sans (loaded; the FloQast heading font per Figma). The
//     blanket body rule would otherwise force headings to Inter via
//     inheritance, so h1–h6 are re-asserted explicitly.
// Load-bearing: do not weaken without verifying (body = Inter, headings = Museo).
const interOverride = document.createElement('style')
interOverride.textContent =
  "html, body, #root { font-family: 'Inter', sans-serif !important; }" +
  "h1, h2, h3, h4, h5, h6 { font-family: 'Museo Sans', sans-serif !important; }"
document.head.appendChild(interOverride)

// Register AG Grid modules once globally. Any feature grid that imports
// AgGridReact picks these up — no per-component registration needed.
// Add more modules here (RowGroupingModule, MasterDetailModule, etc.) when
// a future feature requires them. See `src/scaffold/grid/README.md`.
ModuleRegistry.registerModules([ClientSideRowModelModule])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
