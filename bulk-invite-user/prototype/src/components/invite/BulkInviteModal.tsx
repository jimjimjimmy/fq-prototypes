/**
 * BulkInviteModal — the dedicated modal for the bulk-invite workflow, fully
 * decoupled from the single-user Invite modal. Triggered from the Users page
 * kebab → Bulk Actions → Invite Users.
 *
 * Owns the FlowUI Modal + header; the step content (Import → Review) is the
 * reusable BulkInviteWizard.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Modal from '@floqastinc/flow-ui_core/Modal'
import { BulkInviteWizard } from './BulkInviteWizard'

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="#1d2433" strokeOpacity="0.8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function BulkInviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Remount the wizard each time the modal opens so it always starts on Step 1.
  const [instanceKey, setInstanceKey] = useState(0)

  return (
    <Modal
      open={open}
      onOpenChange={(o: boolean) => {
        if (!o) {
          onClose()
          setInstanceKey((k) => k + 1)
        }
      }}
      size="lg"
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e1e6ef] shrink-0">
          <h2 className="text-[18px] leading-6 font-semibold text-[#1d2433]">Bulk invite users</h2>
          <button aria-label="Close" onClick={onClose} className="flex items-center justify-center w-6 h-6 hover:opacity-70 transition-opacity">
            <CloseIcon />
          </button>
        </div>

        <BulkInviteWizard key={instanceKey} onClose={onClose} />
      </div>
    </Modal>
  )
}
