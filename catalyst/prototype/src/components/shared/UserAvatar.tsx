interface UserAvatarProps {
  initials: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'user' | 'agent' | 'header';
}

const sizeMap = {
  xs: { container: 'size-[24px]', radius: 'rounded-[6.667px]', text: 'text-[8.667px]' },
  sm: { container: 'size-[28px]', radius: 'rounded-[7px]', text: 'text-[10px]' },
  md: { container: 'size-[32px]', radius: 'rounded-[8px]', text: 'text-[11px]' },
  lg: { container: 'size-[40px]', radius: 'rounded-[10px]', text: 'text-[13px]' },
};

const variantStyles = {
  user: 'bg-gradient-to-b from-[#005133] to-[#0a3b33] text-[#c0e8d7]',
  agent: 'bg-gradient-to-br from-[#047857] to-[#065f46] text-white',
  header: 'bg-[#0c1e18] text-white',
};

export function UserAvatar({ initials, size = 'md', variant = 'user' }: UserAvatarProps) {
  const s = sizeMap[size];
  return (
    <div className={`${variantStyles[variant]} ${s.container} ${s.radius} flex items-center justify-center shrink-0`}>
      <p className={`font-['Inter',sans-serif] font-semibold leading-none ${s.text}`}>
        {initials}
      </p>
    </div>
  );
}
