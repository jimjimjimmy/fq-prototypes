import { useAIGuided } from '../state/AIGuidedContext'

export default function CatalogView() {
  const { models } = useAIGuided()

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-[#f1f3f9] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b91a3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v6c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
            <path d="M3 11v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" />
          </svg>
        </div>
        <h3 className="text-[14px] font-semibold text-[#1d2433] mb-1">No lineage models yet</h3>
        <p className="text-[13px] text-[#6b7280] max-w-[360px]">
          Lineage Models map your external data to FloQast's normalized format.
          Ask the AI assistant to help you create your first model.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-[#e1e6ef] text-left">
            <th className="py-3 px-3 font-semibold text-[#424867]">Model Name</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">FQ Domain</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Status</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Version</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Created</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id} className="border-b border-[#f1f3f9] hover:bg-[#f9fafb]">
              <td className="py-3 px-3 font-semibold text-[#1d2433]">{m.name}</td>
              <td className="py-3 px-3 text-[#424867]">{m.fqDomain}</td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: m.status === 'active' ? '#16a34a' : '#6b7280' }}
                  />
                  <span className="capitalize text-[#424867]">{m.status}</span>
                </span>
              </td>
              <td className="py-3 px-3 text-[#424867]">{m.version}</td>
              <td className="py-3 px-3 text-[#6b7280]">{m.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
