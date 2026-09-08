import { useState } from 'react'
import { Button, Heading, IconButton, Popover } from '@floqastinc/flow-ui_core'
import SortOutlined from '@floqastinc/flow-ui_icons/material/SortOutlined'
import TableRowsOutlined from '@floqastinc/flow-ui_icons/material/TableRowsOutlined'
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'

interface PageHeaderProps {
  title: string
  progressLabel?: string
  completenessLabel?: string
  addLabel?: string
  onAddAccount?: () => void
  onAddGroup?: () => void
}

// Figma's "Form / Button" instances in this row all use 12px horizontal
// padding, not FlowUI Button's built-in lg default of 16px - overridden below.
const BUTTON_PADDING = '!px-[12px]'

export function PageHeader({
  title,
  progressLabel = '1/100',
  completenessLabel = 'Completeness',
  addLabel = 'Add',
  onAddAccount,
  onAddGroup,
}: PageHeaderProps) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="bg-white flex flex-col items-start px-[24px] py-[16px] w-full shrink-0">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col items-start">
          <Heading variant="h2" weight="semibold">{title}</Heading>
          <p className="text-[#6b7280] text-[13px] leading-[16px]">{progressLabel}</p>
        </div>
        <div className="flex gap-[12px] items-start">
          <Button color="dark" variant="outlined" size="lg" className={BUTTON_PADDING} onClick={() => {}}>
            <span className="flex items-center gap-[8px]">
              <SortOutlined />
              Filter
            </span>
          </Button>
          <Button color="dark" variant="outlined" size="lg" className={BUTTON_PADDING} onClick={() => {}}>
            <span className="flex items-center gap-[8px]">
              <TableRowsOutlined />
              Collapse All
            </span>
          </Button>
          <Button color="dark" variant="outlined" size="lg" className={BUTTON_PADDING} onClick={() => {}}>
            <span className="flex items-center gap-[8px]">
              {completenessLabel}
              <ExpandMore />
            </span>
          </Button>
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <Popover.Trigger>
              <Button color="primary" variant="filled" size="lg" className={BUTTON_PADDING}>
                <span className="flex items-center gap-[8px]">
                  {addLabel}
                  <span style={{ transform: addOpen ? 'rotate(180deg)' : undefined, transition: 'transform 150ms', display: 'flex' }}>
                    <ExpandMore color="white" />
                  </span>
                </span>
              </Button>
            </Popover.Trigger>
            <Popover.Content
              align="end"
              sideOffset={4}
              className="bg-white border border-solid border-[#e1e6ef] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden p-[4px] min-w-[160px]"
            >
              <button
                type="button"
                className="text-left font-['Inter'] text-[12px] font-medium text-[#0a0d14] rounded-[4px] px-[12px] py-[8px] hover:bg-[#f1f3f9]"
                onClick={() => {
                  setAddOpen(false)
                  onAddAccount?.()
                }}
              >
                Add Account
              </button>
              <button
                type="button"
                className="text-left font-['Inter'] text-[12px] font-medium text-[#0a0d14] rounded-[4px] px-[12px] py-[8px] hover:bg-[#f1f3f9]"
                onClick={() => {
                  setAddOpen(false)
                  onAddGroup?.()
                }}
              >
                Add Group
              </button>
            </Popover.Content>
          </Popover>
          <IconButton size="lg" onClick={() => {}}>
            <MoreVert className="size-[20px]" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
