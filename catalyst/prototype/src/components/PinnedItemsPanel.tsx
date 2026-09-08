interface PinnedItemsPanelProps {
  maxHeight: number;
}

export function PinnedItemsPanel({ maxHeight }: PinnedItemsPanelProps) {
  return (
    <div 
      className="bg-gradient-to-b from-[#015244] to-[#00332a] rounded-[12px] w-[220px] overflow-hidden border border-white/10"
      style={{ 
        maxHeight: `${maxHeight}px`,
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12), 0px 8px 32px rgba(0, 0, 0, 0.08), 0px 16px 48px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Scrollable Content Area */}
      <div 
        className="overflow-y-auto overflow-x-hidden settings-panel-scroll py-[16px]"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {/* Header */}
        <div className="flex flex-col items-start pb-[8px]">
          <div className="h-[38px] w-full px-[16px] flex items-center">
            <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic text-[#7c998a] text-[11px] tracking-[1px] uppercase">
              Pinned Items
            </p>
          </div>
          
          {/* Pinned Items List */}
          <div className="w-full px-[16px] flex flex-col gap-[4px]">
            <PinnedItem code="1020" label="Cash Clearing" />
            <PinnedItem code="2200" label="AP Accruals" />
            <PinnedItem code="1500" label="Fixed Assets" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PinnedItemProps {
  code: string;
  label: string;
}

function PinnedItem({ code, label }: PinnedItemProps) {
  return (
    <button className="h-[34px] rounded-[6px] w-full flex items-center px-[10px] hover:bg-[#027965]/40 transition-colors">
      <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
        {code} - {label}
      </p>
    </button>
  );
}