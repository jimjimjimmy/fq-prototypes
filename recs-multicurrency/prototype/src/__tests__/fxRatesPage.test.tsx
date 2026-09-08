/**
 * Component tests for FxRatesPage - role-based rendering and rate table content.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FxRatesPage } from '../components/FxRatesPage'

// ---------------------------------------------------------------------------
// Shared rendering helpers
// ---------------------------------------------------------------------------

function renderAdmin(fxRatesLoaded = false) {
  return render(
    <FxRatesPage onBack={vi.fn()} period="Oct 2025" isAdmin={true} fxRatesLoaded={fxRatesLoaded} />
  )
}

function renderPreparer(fxRatesLoaded = true) {
  return render(
    <FxRatesPage onBack={vi.fn()} period="Oct 2025" isAdmin={false} fxRatesLoaded={fxRatesLoaded} />
  )
}

// ---------------------------------------------------------------------------
// Rate table content (visible to all roles)
// ---------------------------------------------------------------------------

describe('FxRatesPage - rate table', () => {
  it('renders exactly 12 data rows', () => {
    renderPreparer()
    // The table has a thead + tbody. Rows in tbody only.
    // Each row has 3 cells: FROM, TO, RATE
    const allRows = screen.getAllByRole('row')
    // 1 header row + 12 data rows
    expect(allRows).toHaveLength(13)
  })

  it('shows FROM, TO, RATE column headers (no INVERSE column)', () => {
    renderPreparer()
    const headers = screen.getAllByRole('columnheader').map(h => h.textContent?.trim())
    expect(headers).toEqual(['FROM', 'TO', 'RATE'])
    expect(headers).not.toContain('INVERSE')
  })

  it('shows JPY -> MXN = 0.1302', () => {
    renderPreparer()
    // Find the row where FROM=JPY, TO=MXN
    const cells = screen.getAllByRole('cell')
    const fromCells = cells.filter(c => c.textContent === 'JPY')
    const jpy_mxn = fromCells.find(c => {
      const row = c.closest('tr')
      return row?.textContent?.includes('MXN') && row?.textContent?.includes('0.1302')
    })
    expect(jpy_mxn).toBeDefined()
  })

  it('shows MXN -> JPY = 7.6787', () => {
    renderPreparer()
    const cells = screen.getAllByRole('cell')
    const fromCells = cells.filter(c => c.textContent === 'MXN')
    const mxn_jpy = fromCells.find(c => {
      const row = c.closest('tr')
      return row?.textContent?.includes('JPY') && row?.textContent?.includes('7.6787')
    })
    expect(mxn_jpy).toBeDefined()
  })

  it('footer shows "12 pairs active"', () => {
    renderPreparer()
    expect(screen.getByText(/12 pairs active/i)).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Admin role
// ---------------------------------------------------------------------------

describe('FxRatesPage - Admin role', () => {
  it('shows "Upload FX Rates" button when rates not loaded', () => {
    renderAdmin(false)
    expect(screen.getByRole('button', { name: /upload fx rates/i })).toBeTruthy()
  })

  it('shows "Replace rates" heading when rates already loaded', () => {
    renderAdmin(true)
    expect(screen.getByText(/replace rates/i)).toBeTruthy()
  })

  it('does NOT show "Managed by admin" lock note', () => {
    renderAdmin()
    expect(screen.queryByText(/managed by admin/i)).toBeNull()
  })

  it('shows ".CSV only" label in upload zone', () => {
    renderAdmin(false)
    expect(screen.getByText(/\.CSV only/i)).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Non-admin (Preparer / Controller) role
// ---------------------------------------------------------------------------

describe('FxRatesPage - Non-admin role', () => {
  it('shows "Managed by admin" lock note', () => {
    renderPreparer()
    expect(screen.getByText(/managed by admin/i)).toBeTruthy()
  })

  it('does NOT show "Upload FX Rates" button', () => {
    renderPreparer()
    expect(screen.queryByRole('button', { name: /upload fx rates/i })).toBeNull()
  })

  it('does NOT show ".CSV only" label', () => {
    renderPreparer()
    expect(screen.queryByText(/\.CSV only/i)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

describe('FxRatesPage - navigation', () => {
  it('shows "Back to Reconciliations" link', () => {
    renderPreparer()
    expect(screen.getByRole('button', { name: /back to reconciliations/i })).toBeTruthy()
  })

  it('calls onBack when back link is clicked', async () => {
    const onBack = vi.fn()
    render(<FxRatesPage onBack={onBack} isAdmin={false} />)
    screen.getByRole('button', { name: /back to reconciliations/i }).click()
    expect(onBack).toHaveBeenCalledOnce()
  })
})
