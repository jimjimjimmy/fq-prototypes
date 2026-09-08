interface SettingsPanelProps {
  maxHeight: number;
}

export function SettingsPanel({ maxHeight }: SettingsPanelProps) {
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
        {/* Platform Settings Section */}
        <div className="flex flex-col items-start pb-[12px] border-b border-[#216749]">
          {/* Section Header */}
          <div className="h-[38px] w-full px-[16px] flex items-center">
            <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic text-[#7c998a] text-[11px] tracking-[1px] uppercase">
              Platform Settings
            </p>
          </div>
          
          {/* Platform Settings Items */}
          <div className="w-full px-[16px] flex flex-col">
            <SettingsItem label="Workflows" />
            <SettingsItem label="Entities" />
            <SettingsItem label="Team Members" />
            <SettingsItem label="Roles" />
            <SettingsItem label="Groups" />
            <SettingsItem label="API Keys" />
            <SettingsItem label="AI" />
            <SettingsItem label="Connections" />
          </div>
        </div>
        
        {/* Product Settings Section */}
        <div className="flex flex-col items-start pt-[16px]">
          {/* Section Header */}
          <div className="h-[38px] w-full px-[16px] flex items-center">
            <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic text-[#7c998a] text-[11px] tracking-[1px] uppercase">
              Product Settings
            </p>
          </div>
          
          {/* Product Settings Items */}
          <div className="w-full px-[16px] flex flex-col">
            <SettingsItem label="Close" />
            <SettingsItem label="Compliance" />
            <SettingsItem label="Reporting" />
            <SettingsItem label="Ops Workflow" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingsItemProps {
  label: string;
}

function SettingsItem({ label }: SettingsItemProps) {
  return (
    <button className="h-[34px] rounded-[6px] w-full flex items-center px-[10px] hover:bg-[#027965]/40 transition-colors">
      <p className="capitalize font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#f3faf4] text-[14px] tracking-[-0.12px]">
        {label}
      </p>
    </button>
  );
}