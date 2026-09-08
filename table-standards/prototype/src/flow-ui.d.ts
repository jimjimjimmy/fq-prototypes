// No top-level imports — keep this an ambient (script) declaration file so the
// `declare module` blocks are authoritative. React.FC resolves via @types/react's global namespace.
declare module '@floqastinc/flow-ui_core/Theme' {
  const Theme: {
    apply: (element: HTMLElement | null, options?: { standalone?: boolean }) => void
  }
  export default Theme
}

declare module '@floqastinc/flow-ui_core' {
  export const Avatar: React.FC<{ size?: string; fallback?: string }>
  export const TableStatusBadge: React.FC<{
    children: string
    color?: 'default' | 'info' | 'danger' | 'success' | 'warning' | 'highlight'
    hasIcon?: boolean
    size?: 'default' | 'xs'
    truncateText?: boolean
  }>
  export const Button: React.FC<
    React.PropsWithChildren<{
      variant?: string
      color?: string
      size?: string
      disabled?: boolean
      onClick?: () => void
      leadingIcon?: React.ReactNode
    }>
  >
  export const Heading: React.FC<React.PropsWithChildren<{ variant?: string }>>
  export const Text: React.FC<React.PropsWithChildren<{ color?: string; variant?: string }>>
  export const Toggle: React.FC<{ checked?: boolean; disabled?: boolean; onChange?: () => void }>
  export const Toaster: React.FC
  export const Tooltip: React.FC<React.PropsWithChildren<{ content?: string }>>
}

declare module '@floqastinc/flow-ui_icons' {
  export const Icon: React.FC<{ name: string; size?: number }>
}
