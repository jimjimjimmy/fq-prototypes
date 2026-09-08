import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CdcDraftModel {
  id: string
  name: string
  connectionName: string
}

interface CdcContextValue {
  draftModels: CdcDraftModel[]
  connectionName: string
  addDraftModels: (connectionName: string, models: CdcDraftModel[]) => void
  dismiss: () => void
}

const CdcContext = createContext<CdcContextValue>({
  draftModels: [],
  connectionName: '',
  addDraftModels: () => {},
  dismiss: () => {},
})

export function CdcProvider({ children }: { children: ReactNode }) {
  const [draftModels, setDraftModels] = useState<CdcDraftModel[]>([])
  const [connectionName, setConnectionName] = useState('')

  return (
    <CdcContext.Provider value={{
      draftModels,
      connectionName,
      addDraftModels: (name, models) => {
        setConnectionName(name)
        setDraftModels(models)
      },
      dismiss: () => {
        setDraftModels([])
        setConnectionName('')
      },
    }}>
      {children}
    </CdcContext.Provider>
  )
}

export function useCdc() {
  return useContext(CdcContext)
}
