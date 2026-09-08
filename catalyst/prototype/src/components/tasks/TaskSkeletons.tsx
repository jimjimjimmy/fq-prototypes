/** Shimmer skeleton loaders for task views while TaskStore is loading. */

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-[#e4e7ec] rounded-[6px] ${className ?? ''}`} style={style} />
  );
}

export function BoardSkeleton() {
  return (
    <div className="h-full bg-white px-[24px] py-[24px]">
      <div className="flex gap-[16px] h-full">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="flex-shrink-0 w-[300px] flex flex-col">
            <div className="bg-[rgba(0,0,0,0.04)] rounded-[12px] h-full flex flex-col overflow-hidden">
              <div className="px-[16px] py-[12px] border-b border-[rgba(0,0,0,0.06)]">
                <Shimmer className="h-[24px] w-[120px]" />
              </div>
              <div className="p-[12px] space-y-[8px]">
                {Array.from({ length: col === 1 ? 4 : col === 4 ? 3 : 2 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[#e4e7ec] rounded-[8px] p-[12px] space-y-[8px]">
                    <Shimmer className="h-[14px] w-[80%]" />
                    <div className="flex justify-between">
                      <Shimmer className="h-[12px] w-[60px]" />
                      <Shimmer className="h-[12px] w-[40px]" />
                    </div>
                    <div className="flex gap-[4px]">
                      <Shimmer className="h-[20px] w-[50px]" />
                      <Shimmer className="h-[20px] w-[30px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-hidden p-[24px]">
        <div className="border border-[#e4e7ec] rounded-[12px] overflow-hidden">
          <div className="bg-[rgba(245,245,245,1)] h-[40px] flex items-center px-[20px] gap-[24px]">
            {[180, 70, 100, 60, 80, 80, 80, 90].map((w, i) => (
              <Shimmer key={i} className="h-[12px]" style={{ width: w }} />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-[64px] items-center px-[20px] border-b border-[#e4e7ec] gap-[24px]">
              <Shimmer className="h-[14px] w-[180px]" />
              <Shimmer className="h-[14px] w-[70px]" />
              <Shimmer className="h-[22px] w-[100px] rounded-[6px]" />
              <Shimmer className="h-[14px] w-[60px]" />
              <Shimmer className="h-[14px] w-[80px]" />
              <Shimmer className="h-[14px] w-[80px]" />
              <div className="flex gap-[4px]">
                <Shimmer className="h-[20px] w-[40px]" />
                <Shimmer className="h-[20px] w-[30px]" />
              </div>
              <Shimmer className="h-[20px] w-[80px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="h-full bg-white px-[24px] py-[24px]">
      <div className="space-y-[12px]">
        <Shimmer className="h-[32px] w-full" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-[16px]">
            <Shimmer className="h-[14px] w-[180px] shrink-0" />
            <div className="flex-1 h-[28px] relative">
              <Shimmer className="h-[28px] rounded-[6px]" style={{ width: `${30 + Math.random() * 50}%`, marginLeft: `${Math.random() * 30}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="h-full bg-white px-[24px] py-[24px]">
      <div className="flex justify-between mb-[16px]">
        <Shimmer className="h-[28px] w-[160px]" />
        <div className="flex gap-[8px]">
          <Shimmer className="h-[32px] w-[70px]" />
          <Shimmer className="h-[32px] w-[70px]" />
          <Shimmer className="h-[32px] w-[70px]" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[1px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <Shimmer key={`h-${i}`} className="h-[20px]" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-[100px] border border-[#e4e7ec] rounded-[4px] p-[8px]">
            <Shimmer className="h-[14px] w-[20px] mb-[8px]" />
            {i % 4 === 0 && <Shimmer className="h-[18px] w-[80%]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-gradient-to-b from-[#f8faf9] via-[#f0f5f3] to-[#e8f2ed]">
      <div className="w-full max-w-[1360px] mx-auto px-[34px] flex flex-col pb-[48px]">
        <div className="pt-[24px] pb-[16px]" />
        <div className="pb-[20px]">
          <Shimmer className="h-[14px] w-[200px]" />
        </div>
        <div className="pb-[24px] space-y-[8px]">
          <Shimmer className="h-[32px] w-[400px]" />
          <Shimmer className="h-[14px] w-[180px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-[24px]">
          <div className="space-y-[16px]">
            <div className="bg-white/95 rounded-[12px] border border-white/60 p-[24px]">
              <div className="flex items-center justify-between mb-[16px]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-[8px]">
                    <Shimmer className="size-[32px] rounded-full" />
                    <Shimmer className="h-[12px] w-[80px]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/95 rounded-[12px] border border-white/60 p-[24px] space-y-[16px]">
              <Shimmer className="h-[16px] w-[140px]" />
              <Shimmer className="h-[14px] w-full" />
              <Shimmer className="h-[14px] w-[90%]" />
              <Shimmer className="h-[14px] w-[70%]" />
              <Shimmer className="h-[200px] w-full rounded-[8px]" />
            </div>
          </div>
          <div className="space-y-[20px]">
            <div className="bg-white/95 rounded-[12px] border border-white/60 p-[22px] space-y-[14px]">
              <Shimmer className="h-[16px] w-[100px]" />
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Shimmer className="h-[12px] w-[60px]" />
                  <Shimmer className="h-[12px] w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
