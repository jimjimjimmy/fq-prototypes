/**
 * LogsPage — L1 feature stub.
 *
 * Owner: Alex Kearns
 *
 * The L1 Logs view at /data-studio/logs (global pipeline / activity log
 * across all models + connectors). Distinct from the per-model Logs section
 * in the L2 Model View.
 */

import { useNavigate } from 'react-router-dom';
import { Input } from '@floqastinc/flow-ui_core';
import Search from '@floqastinc/flow-ui_icons/material/Search';
import { L1Frame } from '../../scaffold/data-studio';

export function LogsPage() {
  const navigate = useNavigate();

  const rightSlot = (
    <div style={{ width: 280 }}>
      <Input mute placeholder="Search logs..." type="search">
        <Input.LeftItem>
          <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
        </Input.LeftItem>
      </Input>
    </div>
  );

  return (
    <L1Frame
      activeTab="logs"
      onTabChange={(t) => navigate(`/data-studio/${t}`)}
      rightSlot={rightSlot}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[16px] leading-5 text-[#1d2433] font-semibold m-0">Logs</h2>
        <p className="text-[14px] text-[#6b7280] m-0">
          Global pipeline activity log lands here. Alex owns scope + behavior.
        </p>
      </div>
    </L1Frame>
  );
}
