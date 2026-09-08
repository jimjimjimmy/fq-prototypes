import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import Popover from '@floqastinc/flow-ui_core/Popover'
// @ts-ignore
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'

export interface RowActionItem {
  label: string
  onSelect: () => void
}

interface RowActionsMenuProps {
  items: RowActionItem[]
  ariaLabel?: string
}

interface MenuItemProps {
  label: string
  onSelect: () => void
  close: () => void
}

function MenuItem({ label, onSelect, close }: MenuItemProps) {
  const handle = () => {
    onSelect()
    close()
  }
  return (
    <button
      type="button"
      role="menuitem"
      onClick={handle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handle()
        }
      }}
      className="w-full text-left px-3 py-2 hover:bg-[#e1e6ef] focus:bg-[#e1e6ef] focus:outline-none"
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: '18px',
        color: '#424867', // --flo-sem-color-text / neutral-600
      }}
    >
      {label}
    </button>
  )
}

export function RowActionsMenuEventBased({ items, ariaLabel = 'Row actions' }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <button
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((prev) => !prev)
          }}
          className="flex items-center justify-center w-8 h-8 rounded-sm hover:bg-[#e1e6ef]"
        >
          <MoreVert size={20} color="#6b7280" />
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={4}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          border: '1px solid #e1e6ef',
          borderRadius: 4,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          minWidth: 140,
          padding: '4px 0',
          zIndex: 1000,
        }}
      >
        <div role="menu" className="flex flex-col">
          {items.map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              onSelect={item.onSelect}
              close={close}
            />
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}
