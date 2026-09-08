/**
 * ConnectorsListPage — L1 feature stub.
 *
 * Owner: Kristin Johnson
 *
 * The list view at /data-studio/connectors. Step 7+ will fill in the
 * connector list table. The Connector Setup wizard (currently live at
 * netlify/connector-setup-prototype) gets ported into ./setup/ during
 * Step 7 — co-owned by Kristin, Natasha, and Rebecca.
 */

import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@floqastinc/flow-ui_core';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Search from '@floqastinc/flow-ui_icons/material/Search';
import { L1Frame } from '../../scaffold/data-studio';

export function ConnectorsListPage() {
  const navigate = useNavigate();

  const rightSlot = (
    <>
      <div style={{ width: 280 }}>
        <Input mute placeholder="Search by connector name or type..." type="search">
          <Input.LeftItem>
            <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
          </Input.LeftItem>
        </Input>
      </div>
      <Button color="primary" variant="filled" onClick={() => navigate('/data-studio/connectors/setup')}>
        <span className="inline-flex items-center gap-1">
          <Add size={16} color="#ffffff" />
          Create Connector
        </span>
      </Button>
    </>
  );

  return (
    <L1Frame
      activeTab="connectors"
      onTabChange={(t) => navigate(`/data-studio/${t}`)}
      rightSlot={rightSlot}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[16px] leading-5 text-[#1d2433] font-semibold m-0">Connectors</h2>
        <p className="text-[14px] text-[#6b7280] m-0">
          Connector list table lands here in Step 7+. The Create Connector
          button navigates to the connector setup wizard (ported from v1
          during Step 7).
        </p>
      </div>
    </L1Frame>
  );
}
