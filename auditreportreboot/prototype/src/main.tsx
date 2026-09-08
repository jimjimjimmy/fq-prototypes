import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from '@floqastinc/flow-ui_core/Theme'
import { initializeForFrontend } from '@floqastinc/fq-intl'
import i18next from 'i18next'
import initFlowUiTranslations from '@floqastinc/flow-ui_core/i18n/init'
import App from './App.tsx'
import './index.css'

// Some FlowUI components (e.g. PeriodRangeCalendar) call fq-intl helpers
// during render. fq-intl reads <html lang> and <html data-region>; set both
// before initializing so the memoized getter has values to cache.
document.documentElement.setAttribute('lang', 'en')
document.documentElement.setAttribute('data-region', 'en-US')
initializeForFrontend()

// Initialize i18next with FlowUI's translations. Without this the calendar
// renders month/day names as "undefined" since the t() helper inside
// flow-ui_core looks up keys in the 'flow-ui' namespace.
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'flow-ui',
  ns: ['flow-ui'],
  interpolation: { escapeValue: false },
})
initFlowUiTranslations(i18next)

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
Theme.apply(null, { standalone: true })

// Override FlowUI's legacy-global-styles.css font-family.
// Theme.apply() sets body to 'Open Sans' — we need 'Inter'.
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
