import { t, palette } from '@kit'
import type { ProfileMeta } from '../profiles/index.ts'

/** Left rail — the ladder. Selecting a profile deep-links via the URL hash. */
export function ShowcaseNav({ profiles, activeId }: { profiles: ProfileMeta[]; activeId: string }) {
  return (
    <nav
      className="w-[248px] shrink-0 h-full flex flex-col"
      style={{ backgroundColor: palette.surfaceWeakest, borderRight: `1px solid ${palette.border}` }}
    >
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${palette.border}` }}>
        <div className="text-[14px] font-semibold" style={{ color: t.textBody }}>
          FloQast Table Standards
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: t.textMuted }}>
          Profile showcase
        </div>
      </div>

      <div className="py-2 flex-1 overflow-auto">
        {profiles.map((p) => {
          const active = p.id === activeId
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="block px-4 py-2.5 border-l-2"
              style={{
                borderLeftColor: active ? t.success : 'transparent',
                backgroundColor: active ? palette.surfaceBase : 'transparent',
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: active ? palette.successBg : palette.surfaceWeaker,
                    color: active ? palette.success : palette.textTertiary,
                  }}
                >
                  {p.code}
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: active ? t.textBody : t.textBodySecondary }}
                >
                  {p.title}
                </span>
              </div>
            </a>
          )
        })}
      </div>

      <div className="px-4 py-3 text-[11px]" style={{ color: t.textMuted, borderTop: `1px solid ${palette.border}` }}>
        One engine · tiered profiles. Shared kit → consistency by construction.
      </div>
    </nav>
  )
}
