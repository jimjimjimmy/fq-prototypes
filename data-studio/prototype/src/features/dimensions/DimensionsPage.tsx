/**
 * DimensionsPage — L1 feature stub.
 *
 * Owner: TBD (not assigned at Step 4 pre-seeding; revisit when work is scoped)
 *
 * The L1 Dimensions view at /data-studio/dimensions. Stub for now.
 */

import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@floqastinc/flow-ui_core';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Search from '@floqastinc/flow-ui_icons/material/Search';
import { L1Frame } from '../../scaffold/data-studio';

export function DimensionsPage() {
  const navigate = useNavigate();

  const rightSlot = (
    <>
      <div style={{ width: 280 }}>
        <Input mute placeholder="Search by dimension name..." type="search">
          <Input.LeftItem>
            <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
          </Input.LeftItem>
        </Input>
      </div>
      <Button color="primary" variant="filled" onClick={() => { /* TODO */ }}>
        <span className="inline-flex items-center gap-1">
          <Add size={16} color="#ffffff" />
          Create Dimension
        </span>
      </Button>
    </>
  );

  return (
    <L1Frame
      activeTab="dimensions"
      onTabChange={(t) => navigate(`/data-studio/${t}`)}
      rightSlot={rightSlot}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[16px] leading-5 text-[#1d2433] font-semibold m-0">Dimensions</h2>
        <p className="text-[14px] text-[#6b7280] m-0">
          Dimensions table + create flow land here once ownership is
          assigned. Pre-seeded as a stub during Step 4.
        </p>
      </div>
    </L1Frame>
  );
}
