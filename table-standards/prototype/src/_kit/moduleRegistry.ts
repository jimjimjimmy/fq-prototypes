/**
 * Central AG Grid module registration. Import this ONCE (the showcase App does) so every
 * grid shares the same registered feature set. The modular @ag-grid-*@32 packages are what
 * resolve through the symlinked node_modules; together they cover the Enterprise features
 * the profiles need (set filters, master/detail, row grouping + aggregation, tool panels).
 *
 * License: unlicensed → watermark, acceptable for prototypes (D-008).
 */
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { SetFilterModule } from '@ag-grid-enterprise/set-filter'
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail'
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel'
import { SideBarModule } from '@ag-grid-enterprise/side-bar'

let registered = false

export function registerGridModules() {
  if (registered) return
  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    SetFilterModule,
    MasterDetailModule,
    RowGroupingModule,
    ColumnsToolPanelModule,
    SideBarModule,
  ])
  registered = true
}
