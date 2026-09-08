type Props = {
  title: string
  description: string
}

export default function PlaceholderView({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-full bg-[#f1f3f9] flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b91a3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <h3 className="text-[14px] font-semibold text-[#1d2433] mb-1">{title}</h3>
      <p className="text-[13px] text-[#6b7280] max-w-[360px]">{description}</p>
    </div>
  )
}
