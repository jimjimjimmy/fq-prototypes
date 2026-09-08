import { Button, Heading, IconButton } from '@floqastinc/flow-ui_core'
import SortOutlined from '@floqastinc/flow-ui_icons/material/SortOutlined'
import TableRowsOutlined from '@floqastinc/flow-ui_icons/material/TableRowsOutlined'
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'
import AddCircleOutlined from '@floqastinc/flow-ui_icons/material/AddCircleOutlined'

interface ChecklistPageHeaderProps {
  progressLabel?: string
  onAddTask?: () => void
}

// Figma's "Form / Button" instances in this row all use 12px horizontal
// padding, not FlowUI Button's built-in lg default of 16px - overridden below.
const BUTTON_PADDING = '!px-[12px]'

export function ChecklistPageHeader({ progressLabel = '1/100', onAddTask }: ChecklistPageHeaderProps) {
  return (
    <div className="bg-white flex flex-col items-start px-[24px] py-[16px] w-full shrink-0">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col items-start">
          <Heading variant="h2" weight="semibold">Checklist</Heading>
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
              Normal
              <ExpandMore />
            </span>
          </Button>
          <Button color="primary" variant="filled" size="lg" className={BUTTON_PADDING} onClick={() => onAddTask?.()}>
            <span className="flex items-center gap-[8px]">
              <AddCircleOutlined color="white" />
              Add Task
            </span>
          </Button>
          <IconButton size="lg" onClick={() => {}}>
            <MoreVert className="size-[20px]" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
