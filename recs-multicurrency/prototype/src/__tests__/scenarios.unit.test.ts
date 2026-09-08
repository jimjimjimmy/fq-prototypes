/**
 * Unit tests for Demo Scenarios data + column visibility logic.
 * Pure data/logic tests - no DOM rendering needed.
 */
import { describe, it, expect } from 'vitest'
import { SCENARIOS } from '../App'
import { getColumnFlags } from '../components/RecsTable'
import { DEMO_FX_RATE_MAP } from '../components/RecsTable'
import { RATES } from '../components/FxRatesPage'

// ---------------------------------------------------------------------------
// SCENARIOS config
// ---------------------------------------------------------------------------

describe('SCENARIOS config', () => {
  it('has exactly three scenarios: admin, preparer, controller', () => {
    const ids = SCENARIOS.map(s => s.id)
    expect(ids).toEqual(['admin', 'preparer', 'controller'])
  })

  describe('Admin scenario', () => {
    const admin = SCENARIOS.find(s => s.id === 'admin')!

    it('label is "Admin"', () => {
      expect(admin.label).toBe('Admin')
    })

    it('defaultView is "all"', () => {
      expect(admin.defaultView).toBe('all')
    })

    it('fxRatesLoaded is false (rates missing - upload required)', () => {
      expect(admin.fxRatesLoaded).toBe(false)
    })

    it('adminRole is true', () => {
      expect(admin.adminRole).toBe(true)
    })
  })

  describe('Preparer scenario', () => {
    const preparer = SCENARIOS.find(s => s.id === 'preparer')!

    it('label is "Preparer"', () => {
      expect(preparer.label).toBe('Preparer')
    })

    it('defaultView is "all"', () => {
      expect(preparer.defaultView).toBe('all')
    })

    it('fxRatesLoaded is true', () => {
      expect(preparer.fxRatesLoaded).toBe(true)
    })

    it('adminRole is false', () => {
      expect(preparer.adminRole).toBe(false)
    })
  })

  describe('Controller scenario', () => {
    const controller = SCENARIOS.find(s => s.id === 'controller')!

    it('label is "Controller"', () => {
      expect(controller.label).toBe('Controller')
    })

    it('defaultView is "reporting"', () => {
      expect(controller.defaultView).toBe('reporting')
    })

    it('fxRatesLoaded is true', () => {
      expect(controller.fxRatesLoaded).toBe(true)
    })

    it('adminRole is false', () => {
      expect(controller.adminRole).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// Column visibility flags
// ---------------------------------------------------------------------------

describe('getColumnFlags - column visibility by viewMode', () => {
  describe('"all" view (Admin + Preparer default)', () => {
    const flags = getColumnFlags('all')

    it('isMultiCurrency is true - Workbook Balance columns visible', () => {
      expect(flags.isMultiCurrency).toBe(true)
    })

    it('isShowAll is true - Reporting (USD) columns visible', () => {
      expect(flags.isShowAll).toBe(true)
    })
  })

  describe('"reporting" view (Controller default)', () => {
    const flags = getColumnFlags('reporting')

    it('isMultiCurrency is false - Workbook Balance columns hidden', () => {
      expect(flags.isMultiCurrency).toBe(false)
    })

    it('isShowAll is true - Reporting (USD) columns visible', () => {
      expect(flags.isShowAll).toBe(true)
    })
  })

  describe('"local" view', () => {
    const flags = getColumnFlags('local')

    it('isMultiCurrency is true', () => {
      expect(flags.isMultiCurrency).toBe(true)
    })

    it('isShowAll is false - Reporting cols hidden', () => {
      expect(flags.isShowAll).toBe(false)
    })
  })

  describe('"functional" view', () => {
    const flags = getColumnFlags('functional')

    it('isMultiCurrency is false', () => {
      expect(flags.isMultiCurrency).toBe(false)
    })

    it('isShowAll is false', () => {
      expect(flags.isShowAll).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// FX rate data - DEMO_FX_RATE_MAP (used in RecsTable tooltips)
// ---------------------------------------------------------------------------

describe('DEMO_FX_RATE_MAP', () => {
  it('has exactly 12 pairs', () => {
    expect(Object.keys(DEMO_FX_RATE_MAP)).toHaveLength(12)
  })

  it('JPY->MXN rate is 0.1302', () => {
    expect(DEMO_FX_RATE_MAP['JPY-MXN']).toBe('0.1302')
  })

  it('MXN->JPY rate is 7.6787', () => {
    expect(DEMO_FX_RATE_MAP['MXN-JPY']).toBe('7.6787')
  })

  it('MXN->USD rate is 0.0464', () => {
    expect(DEMO_FX_RATE_MAP['MXN-USD']).toBe('0.0464')
  })

  it('USD->MXN rate is 21.5517', () => {
    expect(DEMO_FX_RATE_MAP['USD-MXN']).toBe('21.5517')
  })

  it('no INVERSE key pattern exists (no "-INV" suffix)', () => {
    const hasInverse = Object.keys(DEMO_FX_RATE_MAP).some(k => k.includes('INV'))
    expect(hasInverse).toBe(false)
  })

  it('all keys follow FROM-TO format (two uppercase letters separated by hyphen)', () => {
    const validKey = /^[A-Z]{3}-[A-Z]{3}$/
    for (const key of Object.keys(DEMO_FX_RATE_MAP)) {
      expect(key).toMatch(validKey)
    }
  })
})

// ---------------------------------------------------------------------------
// FX rate data - RATES (used in FxRatesPage table)
// ---------------------------------------------------------------------------

describe('RATES (FxRatesPage table data)', () => {
  it('has exactly 12 pairs', () => {
    expect(RATES).toHaveLength(12)
  })

  it('no row has an "inverse" property', () => {
    for (const row of RATES) {
      expect(row).not.toHaveProperty('inverse')
    }
  })

  it('JPY->MXN rate is 0.1302', () => {
    const row = RATES.find(r => r.from === 'JPY' && r.to === 'MXN')
    expect(row?.rate).toBe('0.1302')
  })

  it('MXN->JPY rate is 7.6787', () => {
    const row = RATES.find(r => r.from === 'MXN' && r.to === 'JPY')
    expect(row?.rate).toBe('7.6787')
  })

  it('every row has from, to, and rate fields only', () => {
    for (const row of RATES) {
      const keys = Object.keys(row).sort()
      expect(keys).toEqual(['from', 'rate', 'to'])
    }
  })

  it('all currency codes are 3 uppercase letters', () => {
    const validCode = /^[A-Z]{3}$/
    for (const row of RATES) {
      expect(row.from).toMatch(validCode)
      expect(row.to).toMatch(validCode)
    }
  })

  it('pairs are bidirectional - each FROM-TO has a matching TO-FROM', () => {
    for (const row of RATES) {
      const inverse = RATES.find(r => r.from === row.to && r.to === row.from)
      expect(inverse).toBeDefined()
    }
  })

  it('DEMO_FX_RATE_MAP and RATES cover identical currency pairs', () => {
    const mapKeys = new Set(Object.keys(DEMO_FX_RATE_MAP))
    const ratesKeys = new Set(RATES.map(r => `${r.from}-${r.to}`))
    expect(mapKeys).toEqual(ratesKeys)
  })
})
