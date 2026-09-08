// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Input from '@floqastinc/flow-ui_core/Input'
// @ts-ignore
import Search from '@floqastinc/flow-ui_icons/material/Search'

interface JobPageHeaderProps {
  onCreateClick: () => void
}

export function JobPageHeader({ onCreateClick }: JobPageHeaderProps) {
  return (
    <div className="flex items-start justify-between px-8 pt-6 pb-4 shrink-0 border-b border-[#e1e6ef]">
      <div className="flex flex-col gap-1">
        <h1
          className="text-[#1d2433]"
          style={{
            fontFamily: "Museo_Sans, 'Museo Sans', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            lineHeight: '32px',
            margin: 0,
          }}
        >
          Autopilot
        </h1>
        <p className="text-[14px] text-[#424867] leading-[20px] m-0">
          Automate repeatable tasks across FloQast
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-[280px]">
          <Input
            placeholder="Search"
            isSearchable
            onChange={() => {}}
            value=""
          >
            <Input.LeftItem>
              <Search size={20} color="#6b7280" />
            </Input.LeftItem>
          </Input>
        </div>
        <Button color="primary" variant="filled" size="lg" onClick={onCreateClick}>
          Create Job
        </Button>
      </div>
    </div>
  )
}
