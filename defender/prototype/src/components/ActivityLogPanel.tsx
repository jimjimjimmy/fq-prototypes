import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer';
import CloseButton from '@floqastinc/flow-ui_core/CloseButton';
import Schedule from '@floqastinc/flow-ui_icons/material/Schedule';
import type { Rule } from '../types';

export default function ActivityLogPanel({ rule, onClose }: { rule: Rule | null; onClose: () => void }) {
  return (
    <SideDrawer show={!!rule} onCancel={onClose} width="md" renderOverlay>
      {rule && (
      <>
        <div className="px-6 pt-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Schedule size={20} color="var(--flo-sem-color-icon-secondary)" />
            <h2 className="text-base font-semibold" style={{ color: 'var(--flo-sem-color-text-default)' }}>Activity Log</h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex flex-col gap-6">
            {rule.activityLog.slice().reverse().map((entry, index) => (
              <div key={entry.id} className="relative">
                {index !== rule.activityLog.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-px bg-[var(--flo-sem-color-border-default,#e1e6ef)]"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Schedule size={16} color="var(--flo-sem-color-content-success-medium)" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--flo-sem-color-text-default)' }}>
                        {entry.action === 'created' ? 'Rule Created' : 'Rule Edited'}
                      </p>
                      <p className="text-[10px] text-[#adb2bb]">{entry.timestamp}</p>
                    </div>
                    <p className="text-xs text-[var(--flo-sem-color-text-tertiary)] mb-3">by {entry.author}</p>

                    {entry.action === 'created' && entry.initialFields && (
                      <div className="bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] rounded-lg p-3 space-y-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Name</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--flo-sem-color-text-default)' }}>{entry.initialFields.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Description</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--flo-sem-color-text-default)' }}>{entry.initialFields.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Status</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--flo-sem-color-text-default)' }}>{entry.initialFields.status}</p>
                        </div>
                      </div>
                    )}

                    {entry.action === 'edited' && entry.changes && (
                      <div className="bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] rounded-lg p-3 space-y-2">
                        {entry.changes.map((change, idx) => (
                          <div key={idx}>
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{change.field}</p>
                            <div className="mt-1 space-y-1">
                              <p className="text-sm" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
                                <span className="font-medium">From:</span> {change.oldValue}
                              </p>
                              <p className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>
                                <span className="font-medium">To:</span> {change.newValue}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}
    </SideDrawer>
  );
}
