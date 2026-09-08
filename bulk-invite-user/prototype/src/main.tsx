import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Theme from '@floqastinc/flow-ui_core/Theme'
// @ts-ignore
import { initializeForFrontend } from '@floqastinc/fq-intl'
import i18next from 'i18next'
// @ts-ignore
import flowUiEn from '@floqastinc/flow-ui_core/locales/en/translation.json'
import './index.css'
import App from './App'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
Theme.apply(null, { standalone: true })

// Initialize fq-intl — required by FlowUI date components (CalendarSelectBox,
// DateField, etc.) which use FQIntl/formatDate. Without this, components
// crash on render and the app shows a white screen.
initializeForFrontend()

// Initialize i18next with the FlowUI 'flow-ui' namespace. Without this,
// CalendarSelectPanel renders month names as 'undefined' because its t()
// lookups (e.g. t('CalendarSelectPanel.january')) return the key path.
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'flow-ui',
  resources: {
    en: {
      'flow-ui': flowUiEn,
    },
  },
})

// Override FlowUI's legacy-global-styles.css font-family.
// Theme.apply() sets body to 'Open Sans' — we need 'Inter'.
// Injected AFTER Theme.apply() so it wins by source order without !important.
// This preserves inline styles (Museo Sans on headers) and FlowUI component fonts.
const fontFix = document.createElement('style')
fontFix.setAttribute('data-meta', 'prototype-font-override')
fontFix.textContent = `
  body {
    font-family: var(--flo-sem-font-family-body, 'Inter'), sans-serif;
  }
  button, textarea, input {
    font-family: inherit;
  }
`
document.head.appendChild(fontFix)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
