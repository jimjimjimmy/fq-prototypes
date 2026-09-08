import { useCallback, useState } from 'react'

/**
 * Shared grid wiring used by most profiles: captures the grid api on ready and tracks which
 * columns currently have an active filter (for the FilterStatusBar). Keeps profiles lean.
 */
export function useGridState() {
  const [api, setApi] = useState<any>(null)
  const [columnFilterKeys, setColumnFilterKeys] = useState<string[]>([])

  const onGridReady = useCallback((e: any) => setApi(e.api), [])
  const onFilterChanged = useCallback((e: any) => {
    setColumnFilterKeys(Object.keys(e.api.getFilterModel() ?? {}))
  }, [])

  return { api, onGridReady, columnFilterKeys, onFilterChanged }
}
