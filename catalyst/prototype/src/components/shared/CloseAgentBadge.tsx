import svgPaths from '@/imports/svg-0gmqjynf3e';

interface CloseAgentBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'dark' | 'light';
}

export function CloseAgentBadge({
  label = 'Prepared by Close Agent',
  size = 'md',
  variant = 'light',
}: CloseAgentBadgeProps) {
  const isDark = variant === 'dark';
  const strokeColor = isDark ? '#C0E8D7' : '#1D583F';
  const textColor = isDark ? 'text-[#daffdf]' : 'text-[#1d583f]';
  const bgColor = isDark ? 'bg-[rgba(218,255,223,0.15)]' : 'bg-[rgba(0,81,51,0.1)]';
  const borderColor = isDark ? 'border-[rgba(218,255,223,0.3)]' : 'border-[rgba(29,88,63,0.2)]';
  const py = size === 'sm' ? 'py-[2px]' : 'py-[3px]';
  const fontSize = size === 'sm' ? 'text-[10px]' : 'text-[11px]';

  return (
    <div className={`${bgColor} content-stretch flex gap-[4px] items-center px-[7px] ${py} relative rounded-[5px] shrink-0`}>
      <div aria-hidden="true" className={`absolute border ${borderColor} border-solid inset-0 pointer-events-none rounded-[5px]`} />
      <div className="relative shrink-0 w-[14px]">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center overflow-clip py-[2px] relative rounded-[inherit] w-full">
          <div className="h-[9.333px] relative shrink-0 w-[11.667px]">
            <div className="absolute inset-[-6.43%_-5.14%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 10.5335">
                <g>
                  <path d="M6.43333 2.93333V0.6H4.1" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d={svgPaths.p3eeed600} stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M0.6 6.4335H1.76667" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M11.1 6.4335H12.2667" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M8.1835 5.85V7.01667" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M4.6835 5.85V7.01667" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className={`font-['Inter',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 ${textColor} ${fontSize}`}>{label}</p>
    </div>
  );
}
