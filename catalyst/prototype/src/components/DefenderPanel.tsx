interface DefenderPanelProps {
  maxHeight: number;
}

export function DefenderPanel({ maxHeight }: DefenderPanelProps) {
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
            Defender Overview
          </p>
        </div>
        
        {/* Anomaly Summary Metrics */}
        <div className="w-full px-[24px] flex flex-col gap-[2px] pb-[12px]">
          <AnomalyMetric label="Total Anomalies" value={15} valueColor="#FF6B6B" />
          <AnomalyMetric label="Open" value={3} valueColor="#f3faf4" />
          <AnomalyMetric label="Investigating" value={4} valueColor="#f3faf4" />
          <AnomalyMetric label="Resolved" value={8} valueColor="#f3faf4" />
        </div>

        {/* Footer Action */}
        <div className="w-full px-[24px] pb-[16px] pt-[4px]">
          <button className="h-[34px] rounded-[6px] w-full flex items-center justify-between px-[10px] hover:bg-[#027965]/40 transition-colors">
            <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
              View All Anomalies
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

interface AnomalyMetricProps {
  label: string;
  value: number;
  valueColor: string;
}

function AnomalyMetric({ label, value, valueColor }: AnomalyMetricProps) {
  return (
    <div className="h-[32px] rounded-[6px] w-full flex items-center justify-between px-[10px] hover:bg-[#027965]/20 transition-colors">
      <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
        {label}
      </p>
      <p 
        className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[14px] tracking-[-0.12px]"
        style={{ color: valueColor }}
      >
        {value}
      </p>
    </div>
  );
}
