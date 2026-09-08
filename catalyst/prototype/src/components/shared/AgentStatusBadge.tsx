interface AgentStatusBadgeProps {
  label: string;
}

export function AgentStatusBadge({ label }: AgentStatusBadgeProps) {
  return (
    <div className="bg-[#f9fafb] flex items-center px-[6px] py-[2px] relative rounded-[6px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#344054] text-[12px] text-center">
        {label}
      </p>
    </div>
  );
}
