import Close from '@floqastinc/flow-ui_icons/material/Close';
import { ReportingIcon } from './nav-icons';

const INACTIVE_TABS = [
  'Home',
  'Intercompany',
  'Financials',
  'Adjustment Entries',
  'Entities',
  'Chart of Accounts',
  'Settings',
  'AI Variance Analysis',
];

type TopNavbarProps = {
  onAssistantClick: () => void;
  isChatOpen: boolean;
};

export default function TopNavbar({ onAssistantClick, isChatOpen }: TopNavbarProps) {
  return (
    <div
      className="bg-white flex items-center shrink-0"
      style={{
        height: 60,
        borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
        paddingLeft: 24,
        paddingRight: 96,
      }}
    >
      {/* App logo + name */}
      <div className="flex items-center shrink-0" style={{ gap: 12 }}>
        <ReportingIcon />
        <span
          style={{
            fontFamily: "'Museo Sans', 'Museo_Sans', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '20px',
            color: 'var(--flo-sem-color-text-default, #1d2433)',
            whiteSpace: 'nowrap',
          }}
        >
          Reporting
        </span>
      </div>

      {/* Tab group */}
      <div className="flex items-center h-full" style={{ paddingLeft: 24, gap: 24 }}>
        {INACTIVE_TABS.map((tab) => (
          <button
            key={tab}
            className="h-full flex items-center cursor-pointer bg-transparent border-0 px-0"
            style={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: '18px',
              letterSpacing: '-0.12px',
              color: 'var(--flo-sem-color-text-secondary, #424867)',
              borderBottom: '2px solid transparent',
              fontFamily: "'Museo Sans', 'Museo_Sans', sans-serif",
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {tab}
          </button>
        ))}
        <button
          className="h-full flex items-center cursor-pointer bg-transparent border-0 px-0"
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '18px',
            letterSpacing: '-0.12px',
            color: 'var(--flo-sem-color-text-default, #1d2433)',
            borderBottom: '2px solid var(--flo-sem-color-success-emphasis, #186749)',
            fontFamily: "'Museo Sans', 'Museo_Sans', sans-serif",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          Data Defender
        </button>
      </div>

      <div className="flex-1" />

      {/* Assistant button — prototype-specific, not in Figma */}
      <button
        onClick={onAssistantClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none border"
        style={{
          backgroundColor: 'var(--flo-sem-color-surface-default, #ffffff)',
          color: 'var(--flo-sem-color-success)',
          borderColor: 'var(--flo-sem-color-success)',
        }}
      >
        <div className="w-5 h-5 flex-shrink-0 overflow-hidden">
          <img src="/AI_Avatar.png" alt="Assistant" className="w-full h-full object-contain" />
        </div>
        {isChatOpen ? <Close size={14} /> : <span>Assistant</span>}
      </button>
    </div>
  );
}
