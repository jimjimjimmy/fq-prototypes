declare module '@floqastinc/flow-ui_core/Theme' {
  const Theme: {
    apply: (element: HTMLElement | null, options?: { standalone?: boolean }) => void
  }
  export default Theme
}

declare module '@floqastinc/flow-ui_core/Checkbox' {
  const Checkbox: React.FC<{
    checked?: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
    hasError?: boolean
    label?: React.ReactNode
    sublabel?: React.ReactNode
    errorMsg?: React.ReactNode
  }>
  export default Checkbox
}

declare module '@floqastinc/flow-ui_core/RadioGroup' {
  const RadioGroup: React.FC<React.PropsWithChildren<{
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    name?: string
    required?: boolean
    label?: string
    className?: string
  }>>
  export default RadioGroup
}

declare module '@floqastinc/flow-ui_core/FileUpload' {
  interface FileUploadSubComponents {
    Compact: React.FC<React.PropsWithChildren<object>>
    UploadButton: React.FC<React.PropsWithChildren<{ variant?: 'filled' | 'outlined'; color?: string }>>
    HelperText: React.FC<React.PropsWithChildren<object>>
    DropZone: React.FC<React.PropsWithChildren<object>>
    FileList: React.FC<React.PropsWithChildren<object>>
    File: React.FC<{ file: { name: string }; onDelete?: () => void; date?: React.ReactNode; isLoading?: boolean; showCompletedStatus?: boolean; style?: React.CSSProperties }>
  }
  const FileUpload: React.FC<{
    children: React.ReactNode
    onChange: (files: File[]) => void
    multiple?: boolean
    allowedFileTypes?: string
  }> & FileUploadSubComponents
  export default FileUpload
}

declare module '@floqastinc/flow-ui_core/RadioGroup/subcomponents' {
  export const Radio: React.FC<React.PropsWithChildren<{
    value: string
    disabled?: boolean
    label?: React.ReactNode
    sublabel?: React.ReactNode
    className?: string
  }>>
}

declare module '@floqastinc/flow-ui_core' {
  export const Avatar: React.FC<{ size?: string; fallback?: string }>
  export const Button: React.FC<React.PropsWithChildren<{ variant?: string; color?: string; size?: string; onClick?: () => void }>>
  export const Heading: React.FC<React.PropsWithChildren<{ variant?: string }>>
  export const Text: React.FC<React.PropsWithChildren<{ color?: string; truncate?: boolean }>>
  export const Spinner: React.FC<{ color?: 'info' | 'success' | 'warning' | 'danger' | 'white' | 'grey'; size?: number; disabled?: boolean }>
  export const Toggle: React.FC<{ checked?: boolean; disabled?: boolean; onChange?: () => void }>
  export const Toaster: React.FC
  export const Tooltip: React.FC<React.PropsWithChildren<{ content?: string }>>
  interface FileUploadSubComponents {
    Compact: React.FC<React.PropsWithChildren<object>>
    UploadButton: React.FC<React.PropsWithChildren<{ variant?: 'filled' | 'outlined'; color?: string }>>
    HelperText: React.FC<React.PropsWithChildren<object>>
    DropZone: React.FC<React.PropsWithChildren<object>>
    FileList: React.FC<React.PropsWithChildren<object>>
    File: React.FC<{ file: { name: string }; onDelete?: () => void; date?: React.ReactNode; isLoading?: boolean; showCompletedStatus?: boolean; style?: React.CSSProperties }>
  }
  export const FileUpload: React.FC<{
    children: React.ReactNode
    onChange: (files: File[]) => void
    multiple?: boolean
    allowedFileTypes?: string
  }> & FileUploadSubComponents

  export const TableStatusBadge: React.FC<{
    children: string
    color?: 'default' | 'info' | 'danger' | 'success' | 'warning' | 'highlight'
    hasIcon?: boolean
    size?: 'default' | 'xs'
    truncateText?: boolean
  }>
}

declare module '@floqastinc/flow-ui_icons' {
  export const Icon: React.FC<{ name: string; size?: number }>
}
