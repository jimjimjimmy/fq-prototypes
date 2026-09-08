/**
 * Mock user data for the Users / Team Members admin table.
 * Content mirrors the Figma "Admin Settings > Users > Team Members (Active)"
 * frame (node 2198:6632).
 */
export type AccountRole = 'Advanced User' | 'Manager' | 'Admin'
export type FqAccess = 'Access' | 'No Access'
export type LoginType = 'SAML SSO' | 'Password' | 'Google'

export interface User {
  id: string
  name: string
  email: string
  /** Avatar background color (hex). */
  avatarColor: string
  role: AccountRole
  /** Admins surface an "Admin Permissions" note under the role. */
  adminPermissions?: boolean
  entities: number
  compliancePrograms: number
  projects: number
  fqAccess: FqAccess
  loginType: LoginType
}

export const USERS: User[] = [
  { id: 'u1', name: 'Aaron Rosenberg', email: 'aaron.rosenberg@acme.com', avatarColor: '#E8743B', role: 'Advanced User', entities: 3, compliancePrograms: 4, projects: 1, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u2', name: 'Adam Feeney', email: 'adam.feeney@acme.com', avatarColor: '#8E5BD9', role: 'Manager', entities: 3, compliancePrograms: 0, projects: 2, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u3', name: 'Becka Portis', email: 'becka.portis@acme.com', avatarColor: '#1FAC76', role: 'Advanced User', entities: 8, compliancePrograms: 0, projects: 1, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u4', name: 'Brandon Norton', email: 'brandon.norton@acme.com', avatarColor: '#3B82C4', role: 'Manager', entities: 6, compliancePrograms: 0, projects: 3, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u5', name: 'Brooke Smith', email: 'brook.smith@acme.com', avatarColor: '#D94F87', role: 'Admin', adminPermissions: true, entities: 10, compliancePrograms: 6, projects: 1, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u6', name: 'Callie Arold', email: 'callie.arnold@acme.com', avatarColor: '#E03B3B', role: 'Admin', adminPermissions: true, entities: 10, compliancePrograms: 6, projects: 4, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u7', name: 'Christine Clark', email: 'christine.clark@acme.com', avatarColor: '#2DA4A8', role: 'Advanced User', entities: 8, compliancePrograms: 0, projects: 1, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u8', name: 'Daniel Reyes', email: 'daniel.reyes@acme.com', avatarColor: '#6B7AC4', role: 'Manager', entities: 4, compliancePrograms: 2, projects: 1, fqAccess: 'Access', loginType: 'SAML SSO' },
  { id: 'u9', name: 'Erin Wallace', email: 'erin.wallace@acme.com', avatarColor: '#C49A3B', role: 'Advanced User', entities: 5, compliancePrograms: 1, projects: 2, fqAccess: 'Access', loginType: 'SAML SSO' },
]

/** Role options for the inline Account Role dropdown. */
export const ROLE_OPTIONS: AccountRole[] = ['Advanced User', 'Manager', 'Admin']
export const FQ_ACCESS_OPTIONS: FqAccess[] = ['Access', 'No Access']
export const LOGIN_TYPE_OPTIONS: LoginType[] = ['SAML SSO', 'Password', 'Google']

/** Counts shown on the filter pills below the tabs. */
export const STATUS_FILTERS = [
  { label: 'Active', count: 33 },
  { label: 'Pending', count: 2 },
  { label: 'Unassigned', count: 3 },
  { label: 'Deactivated', count: 5 },
]

/** Sub-tab counts. */
export const TAB_COUNTS = { teamMembers: 38, auditors: 7 }
