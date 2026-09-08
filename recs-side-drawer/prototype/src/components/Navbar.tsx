import { Button, Heading } from '@floqastinc/flow-ui_core'
import closeAppIcon from '../assets/close-app-icon.svg'

export const TABS = ['Dashboard', 'Folders', 'Checklist', 'Reconciliations', 'Notes', 'Journal Entries', 'Flux Analysis']

interface NavbarProps {
  activeTab?: string
  onSelectTab?: (tab: string) => void
}

export function Navbar({ activeTab = 'Reconciliations', onSelectTab }: NavbarProps) {
  return (
    <div className="bg-white border-b border-solid border-[#e1e6ef] flex items-center h-[60px] pl-[24px] pr-[96px] shrink-0">
      <div className="flex gap-[12px] items-center h-full shrink-0">
        <img src={closeAppIcon} alt="" className="w-[20px] h-[21px]" />
        <Heading variant="h5" weight="semibold" style={{ color: '#1d2433' }}>Close</Heading>
      </div>
      <div className="flex flex-1 gap-[24px] h-full items-center min-w-px px-[24px]">
        <div className="flex gap-[24px] h-full items-center shrink-0">
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <div
                key={tab}
                className={`flex h-full items-center shrink-0 box-border ${isActive ? 'border-b-[2px] border-solid border-[#186749]' : ''}`}
              >
                <Button
                  color="dark"
                  variant="ghost"
                  size="md"
                  className={isActive ? '![color:#1d2433] !font-bold' : '![color:#424867]'}
                  onClick={() => onSelectTab?.(tab)}
                >
                  {tab}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
