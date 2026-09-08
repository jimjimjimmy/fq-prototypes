import { Home, ListChecks, FolderOpen, ShieldCheck, FileCheck, Eye, BookOpen, Award, Bell, Settings } from 'lucide-react'

// Visual tokens borrowed from the catalyst project sidebar
const GRADIENT = 'linear-gradient(180deg, #014a3d 0%, #00332a 100%)'
const BORDER = '#1d583f'

const items = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'tasks', icon: ListChecks, label: 'Tasks' },
  { id: 'docs', icon: FolderOpen, label: 'Documents' },
  { id: 'compliance', icon: ShieldCheck, label: 'Compliance', active: true },
  { id: 'tests', icon: FileCheck, label: 'Tests' },
  { id: 'review', icon: Eye, label: 'Review' },
  { id: 'frameworks', icon: BookOpen, label: 'Frameworks' },
  { id: 'certifications', icon: Award, label: 'Certifications' },
]

export function IconRail() {
  return (
    <nav
      className="w-[60px] h-screen flex flex-col items-center py-4 border-r"
      style={{ background: GRADIENT, borderColor: BORDER }}
    >
      <div className="w-9 h-9 rounded-lg bg-[#0c1e18] flex items-center justify-center mb-6">
        <span className="font-bold text-[12px] tracking-tight" style={{ color: '#90E39A' }}>FQ</span>
      </div>
      <ul className="flex-1 flex flex-col gap-1">
        {items.map(({ id, icon: Icon, label, active }) => (
          <li key={id}>
            <button
              title={label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-[#f3faf4] ${
                active ? 'bg-[#027965]/55' : 'hover:bg-[#027965]/40'
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-1">
        <li>
          <button
            title="Notifications"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f3faf4] hover:bg-[#027965]/40 transition-colors"
          >
            <Bell size={18} strokeWidth={1.75} />
          </button>
        </li>
        <li>
          <button
            title="Settings"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f3faf4] hover:bg-[#027965]/40 transition-colors"
          >
            <Settings size={18} strokeWidth={1.75} />
          </button>
        </li>
      </ul>
    </nav>
  )
}
