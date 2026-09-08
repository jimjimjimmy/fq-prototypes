/**
 * Single-user invite seam. This prototype has no real single-user invite call
 * (the Users page "Invite" button is an inert stub; createUsersSeed is the bulk
 * template flow). This is the ONE place a single-user invite is fired, so the
 * real call can plug in here later without touching callers. MVP: no backend.
 */
export type UserType = 'Admin'

export type DelegableStepId = 'connect-erp' | 'connect-cloud-storage'

export interface UserInvite {
  email: string
  /** Fixed to "Admin" for delegated setup steps (the access needed to connect). */
  userType: UserType
  /** Task context the invitee lands on, e.g. "Getting started · Connect ERP". */
  contextLabel: string
  /** Which setup step is being delegated. */
  stepId: DelegableStepId
}

export function sendUserInvite(_invite: UserInvite): void {
  // MVP prototype: no backend. The real single-user invite (email + user type +
  // task context, landing the invitee on the right step) would fire here.
}
