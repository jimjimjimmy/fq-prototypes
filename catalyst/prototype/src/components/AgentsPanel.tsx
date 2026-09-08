interface AgentsPanelProps {
  maxHeight: number;
}

export function AgentsPanel({ maxHeight }: AgentsPanelProps) {
  return (
    <div 
      className="bg-gradient-to-b from-[#015244] to-[#00332a] rounded-[12px] w-[270px] overflow-hidden border border-white/10"
      style={{ 
        maxHeight: `${maxHeight}px`,
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12), 0px 8px 32px rgba(0, 0, 0, 0.08), 0px 16px 48px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Scrollable Content Area */}
      <div 
        className="overflow-y-auto overflow-x-hidden settings-panel-scroll"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {/* Header */}
        <div className="flex flex-col items-start pt-[16px] pb-[12px] px-[24px]">
          <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic text-[#7c998a] text-[11px] tracking-[1px] uppercase">
            Agent Activity
          </p>
        </div>
        
        {/* Agents List */}
        <div className="w-full px-[24px] flex flex-col gap-[2px] pb-[12px]">
          <AgentItem name="Variance Detection" status="Running" statusColor="#90E39A" />
          <AgentItem name="JE Draft Agent" status="Ready" statusColor="#90E39A" />
          <AgentItem name="Accrual Assistant" status="Waiting" statusColor="#7c998a" />
        </div>

        {/* Footer Action */}
        <div className="w-full px-[24px] pb-[16px] pt-[4px]">
          <button className="h-[34px] rounded-[6px] w-full flex items-center justify-between px-[10px] hover:bg-[#027965]/40 transition-colors">
            <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
              View All Agents
            </p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface AgentItemProps {
  name: string;
  status: string;
  statusColor: string;
}

function AgentItem({ name, status, statusColor }: AgentItemProps) {
  return (
    <div className="h-[32px] rounded-[6px] w-full flex items-center justify-between px-[10px] hover:bg-[#027965]/20 transition-colors">
      <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
        {name}
      </p>
      <div className="flex items-center gap-[6px]">
        <div 
          className="w-[6px] h-[6px] rounded-full" 
          style={{ backgroundColor: statusColor }}
        />
        <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#c0e8d7]/70 text-[12px]">
          {status}
        </p>
      </div>
    </div>
  );
}