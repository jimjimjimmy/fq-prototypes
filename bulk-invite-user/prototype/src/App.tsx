/**
 * Bulk Invite User — prototype app shell.
 *
 * Entry screen: Admin Settings → Users / Team Members list (built from Figma
 * node 2198:6632).
 *   • Green "Invite" button → single-user InviteUserModal.
 *   • Kebab → Bulk Actions → Invite Users → dedicated BulkInviteModal.
 *
 * Layout: 56px global FQ rail + a page column (Admin Settings top nav over a
 * scrollable content area).
 */
import { useState } from 'react'
import { GlobalRail, AdminSettingsNav } from './scaffold/global'
import { UsersPage } from './components/UsersPage'
import { InviteUserModal } from './components/invite/InviteUserModal'
import { BulkInviteModal } from './components/invite/BulkInviteModal'

export default function App() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <GlobalRail activeBottomNav="settings" avatarInitials="GA" />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminSettingsNav activeTab="Users" />
        <main className="flex-1 overflow-auto bg-white">
          <UsersPage
            onInvite={() => setInviteOpen(true)}
            onBulkInvite={() => setBulkInviteOpen(true)}
          />
        </main>
      </div>
      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <BulkInviteModal open={bulkInviteOpen} onClose={() => setBulkInviteOpen(false)} />
    </div>
  )
}
