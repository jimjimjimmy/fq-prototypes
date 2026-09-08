import { useState } from 'react'
import { Shell } from './components/shell/Shell.tsx'
import { RecsGrid } from './components/RecsGrid.tsx'

export default function App() {
  const [mcMode, setMcMode] = useState(true)
  return (
    <Shell mcMode={mcMode} onMcModeChange={setMcMode}>
      <RecsGrid mcMode={mcMode} />
    </Shell>
  )
}
