/**
 * InviteUserModal — the single-user invite modal (Figma node 2188:24356).
 * Opened by the green "Invite" button in the Users page header.
 *
 * Strictly individual invites. The bulk workflow is fully decoupled into its
 * own BulkInviteModal (triggered from the kebab → Bulk Actions → Invite Users).
 */
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Modal from '@floqastinc/flow-ui_core/Modal'
import { SingleInviteForm } from './SingleInviteForm'

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="#1d2433" strokeOpacity="0.8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function InviteUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onOpenChange={(o: boolean) => { if (!o) onClose() }} size="md">
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e1e6ef] shrink-0">
          <h2 className="text-[18px] leading-6 font-semibold text-[#1d2433]">Invite New User</h2>
          <button aria-label="Close" onClick={onClose} className="flex items-center justify-center w-6 h-6 hover:opacity-70 transition-opacity">
            <CloseIcon />
          </button>
        </div>

        <SingleInviteForm onClose={onClose} />
      </div>
    </Modal>
  )
}
