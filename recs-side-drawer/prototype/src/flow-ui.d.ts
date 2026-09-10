declare module '@floqastinc/fq-intl' {
  export function initializeForFrontend(options?: { disableXFqIntlVarsHeader?: boolean }): void
}

declare module '@floqastinc/flow-ui_core/Theme' {
  const Theme: {
    apply: (element: HTMLElement | null, options?: { standalone?: boolean }) => void
  }
  export default Theme
}

declare module '@floqastinc/flow-ui_core' {
  export const Button: React.FC<React.PropsWithChildren<{
    color?: 'primary' | 'dark' | 'danger' | 'info' | 'warning' | 'ai'
    variant?: 'filled' | 'outlined' | 'ghost' | 'dropdown' | 'group'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    isActive?: boolean
    className?: string
    onClick?: () => void
  }>>

  export const IconButton: React.FC<{
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'table'
    disabled?: boolean
    isActive?: boolean
    className?: string
    onClick?: () => void
    // Small dark circular count overlay in the icon's top-right corner -
    // 0 (the default) renders nothing. See IconButton/index.js's `showNumericalIndicator`.
    numericalIndicator?: number
  }>

  export const DropdownButton: React.FC<React.PropsWithChildren<{
    icon?: React.ReactNode
    label?: string
    sublabel?: string
    isRequired?: boolean
    open?: boolean
    disabled?: boolean
    variant?: 'default' | 'muted' | 'nav' | 'header' | 'input'
    className?: string
    onClick?: () => void
  }>>

  export const TagDropdownButton: React.FC<React.PropsWithChildren<{
    placeholder?: React.ReactNode
    label?: string
    isRequired?: boolean
    open?: boolean
    disabled?: boolean
    isReadOnly?: boolean
    disableSearchIcon?: boolean
    className?: string
  }>>

  export const TableStatusBadge: React.FC<React.PropsWithChildren<{
    color?: 'default' | 'info' | 'danger' | 'success' | 'warning' | 'highlight'
    hasIcon?: boolean
    size?: 'default' | 'xs'
    truncateText?: boolean
    className?: string
  }>>

  export const ActionableBadge: React.FC<React.PropsWithChildren<{
    color?: 'dark' | 'info' | 'danger' | 'success'
    size?: 'default' | 'small'
    variant?: 'primary' | 'secondary'
    hideX?: boolean
    disabled?: boolean
    onClick: () => void
    onPointerDown?: (e: React.PointerEvent) => void
    className?: string
  }>>

  export interface SelectOptionItem {
    label: string
    value: string
  }

  export interface SelectOptionGroup {
    groupLabel: string
    options: SelectOptionItem[]
  }

  export const Select: React.FC<{
    options: (SelectOptionItem | SelectOptionGroup)[]
    value?: string | string[] | null
    onChange: (value: string | string[] | null, context?: { action: string; targetValue?: string }) => void
    buttonLabel?: string
    trigger?: React.ReactNode
    disableFilter?: boolean
    disableClear?: boolean
    filterPlaceholder?: string
    selectionMode?: 'single' | 'multiple'
    contentWidth?: string
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }>

  export const Link: React.FC<React.PropsWithChildren<{
    href?: string
    onClick?: () => void
    className?: string
  }>>

  export const Heading: React.FC<React.PropsWithChildren<{
    variant?: 'xl' | 'lg' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body-base' | 'overline'
    weight?: 'regular' | 'medium' | 'semibold'
    align?: 'left' | 'center' | 'right'
    style?: React.CSSProperties
  }>>

  export const Divider: React.FC<{ size?: 'sm' | 'md' | 'lg' }>

  export const Avatar: React.FC<{
    fallback?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    src?: string
    alt?: string
    variant?: 'initials' | 'overflow-count'
    disabled?: boolean
    userStatus?: 'default' | 'unassigned' | 'pending'
    className?: string
  }>

  export const CloseButton: React.FC<{
    onClick?: () => void
    color?: 'primary' | 'dark' | 'danger' | 'info' | 'warning' | 'ai'
    size?: 'sm' | 'md' | 'lg'
  }>

  export const Input: React.FC<{
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    onFocus?: () => void
    label?: string
    placeholder?: string
    isRequired?: boolean
    isDisabled?: boolean
    isInvalid?: boolean
    sublabel?: string
    className?: string
    type?: 'text' | 'search' | 'currency' | 'password'
    // The search variant's wrapper shows a blue focus box-shadow by default
    // (Select's own internal search field suppresses this the same way -
    // see Select/index.styles.js's FilterInput) - applied as inline style,
    // which beats the component's own focus-state CSS regardless of when
    // `$inputFocused` flips.
    styleOverrides?: {
      inputWrapper?: React.CSSProperties
    }
  }>

  export const TextArea: React.FC<{
    value?: string
    onChange?: (value: string) => void
    label?: string
    placeholder?: string
    isRequired?: boolean
    isLabelVisible?: boolean
    disabled?: boolean
    resizable?: boolean
    className?: string
    // TextArea's own styled-component hardcodes width: 340px - the
    // documented escape hatch is styleOverrides (applied as inline style,
    // which beats the component's own CSS), not className.
    styleOverrides?: {
      root?: React.CSSProperties
      textarea?: React.CSSProperties
    }
  }>

  export const RadioGroup: React.FC<React.PropsWithChildren<{
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    label?: string
    className?: string
  }>>

  export const Radio: React.FC<React.PropsWithChildren<{
    value: string
    disabled?: boolean
    className?: string
  }>>

  export const Checkbox: React.FC<{
    checked?: boolean | 'indeterminate'
    onCheckedChange?: (checked: boolean | 'indeterminate') => void
    disabled?: boolean
    hasError?: boolean
    label?: React.ReactNode
    errorMsg?: string
    sublabel?: React.ReactNode
    className?: string
    styleOverrides?: {
      root?: React.CSSProperties
      checkbox?: React.CSSProperties
      label?: React.CSSProperties
      sublabel?: React.CSSProperties
      errorMsg?: React.CSSProperties
    }
  }>

  export const Popover: React.FC<React.PropsWithChildren<{
    open?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
  }>> & {
    Trigger: React.FC<React.PropsWithChildren<object>>
    Content: React.FC<React.PropsWithChildren<{
      side?: 'top' | 'right' | 'bottom' | 'left'
      sideOffset?: number
      align?: 'start' | 'center' | 'end'
      alignOffset?: number
      className?: string
      style?: React.CSSProperties
      onOpenAutoFocus?: (e: Event) => void
    }>>
  }

  export const Modal: React.FC<React.PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg'
    open: boolean
    onOpenChange: (open: boolean) => void
    hideCloseButton?: boolean
    showOverlay?: boolean
  }>> & {
    Header: React.FC<React.PropsWithChildren<object>>
    Body: React.FC<React.PropsWithChildren<object>>
    Footer: React.FC<React.PropsWithChildren<object>>
    FooterCancelBtn: React.FC<React.PropsWithChildren<{ onClick: () => void; disabled?: boolean; className?: string }>>
    FooterActionBtn: React.FC<React.PropsWithChildren<{
      onClick: () => void
      disabled?: boolean
      className?: string
      color?: 'primary' | 'dark' | 'danger' | 'info' | 'warning' | 'ai'
    }>>
  }

  export const Dialog: React.FC<React.PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg'
    type?: 'info' | 'danger' | 'warning' | 'dark' | 'success'
    align?: 'start' | 'center'
    open: boolean
    onOpenChange: (open: boolean) => void
    hideCloseButton?: boolean
    showOverlay?: boolean
  }>> & {
    Header: React.FC<React.PropsWithChildren<object>>
    Body: React.FC<React.PropsWithChildren<object>>
    Footer: React.FC<React.PropsWithChildren<object>>
    FooterCancelBtn: React.FC<React.PropsWithChildren<{ onClick: () => void; disabled?: boolean; className?: string }>>
    FooterActionBtn: React.FC<React.PropsWithChildren<{
      onClick: () => void
      disabled?: boolean
      className?: string
      color?: 'primary' | 'dark' | 'danger' | 'info' | 'warning' | 'ai'
    }>>
  }

  export const SideDrawer: React.FC<React.PropsWithChildren<{
    show: boolean
    onCancel?: () => void
    renderOverlay?: boolean
    width?: 'md' | 'lg'
    onAnimationEnd?: (state?: string) => void
    hidePageOverlay?: boolean
  }>> & {
    Title: React.FC<React.PropsWithChildren<{ variant?: string; weight?: string }>>
    Subtitle: React.FC<React.PropsWithChildren<object>>
    Header: React.FC<React.PropsWithChildren<object>>
    Footer: React.FC<React.PropsWithChildren<object>>
    SecondaryFooter: React.FC<React.PropsWithChildren<object>>
    Body: React.FC<React.PropsWithChildren<object>>
    TopRight: React.FC<React.PropsWithChildren<{ align?: 'center' | 'start' }>>
  }

  export const FileUpload: React.FC<React.PropsWithChildren<{
    onChange: (files: (File | { name: string; invalidTypeError: string })[]) => void
    multiple?: boolean
    allowedFileTypes?: string
  }>> & {
    DropZone: React.FC<React.PropsWithChildren<object>>
    UploadButton: React.FC<React.PropsWithChildren<{
      variant?: 'filled' | 'outlined'
    }>>
    HelperText: React.FC<React.PropsWithChildren<{ className?: string }>>
    FileList: React.FC<React.PropsWithChildren<{ rows?: number }>>
    File: React.FC<{
      file: { name: string; invalidTypeError?: string }
      date?: React.ReactNode
      onDelete?: () => void
      onDownload?: () => void
      isLoading?: boolean
      showCompletedStatus?: boolean
    }>
    Compact: React.FC<React.PropsWithChildren<object>>
  }

  export const Tooltip: React.FC<React.PropsWithChildren<{
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    delayDuration?: number
  }>> & {
    Trigger: React.FC<React.PropsWithChildren<{ className?: string }>>
    Content: React.FC<React.PropsWithChildren<{
      hasArrow?: boolean
      size?: 'sm' | 'md'
      side?: 'top' | 'right' | 'bottom' | 'left'
      sideOffset?: number
      align?: 'start' | 'center' | 'end'
    }>>
  }

  export const Accordion: React.FC<React.PropsWithChildren<{
    type?: 'single' | 'multiple'
    variant?: 'standard' | 'dropdown'
    arrowSide?: 'left' | 'right'
    collapsible?: boolean
    defaultValue?: string | string[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    size?: 'sm' | 'lg'
    className?: string
  }>> & {
    Item: React.FC<React.PropsWithChildren<{ value: string; className?: string }>>
    Trigger: React.FC<React.PropsWithChildren<{ unsetHeight?: boolean; className?: string }>>
    Content: React.FC<React.PropsWithChildren<object>>
  }

  export const Toaster: React.FC<React.HTMLAttributes<HTMLDivElement>>

  export const Toast: React.FC<
    React.PropsWithChildren<{
      remove?: () => void
      // Only `main` (the icon+title / action+close row) is actually
      // style-overridable via styleOverrides per the component's own render -
      // the outer card's background/border-radius/width have no dedicated
      // override hook, but className IS forwarded onto that outer card.
      styleOverrides?: { main?: React.CSSProperties }
      className?: string
    }>
  > & {
    StatusIcon: React.FC<{ children: React.ReactElement }>
    Title: React.FC<React.PropsWithChildren<{ height?: string; style?: React.CSSProperties }>>
    Action: React.FC<React.PropsWithChildren<{ onClick?: () => void; as?: string; style?: React.CSSProperties }>>
    Close: React.FC<{ remove?: () => void; color?: 'light' | 'dark' }>
  }

  export function showToast(
    toastComponent: React.ReactElement,
    options?: { id?: string; duration?: number; position?: string },
  ): string

  export function removeToast(id?: string): void
}

type MaterialIcon = React.FC<{ className?: string; color?: string; size?: string | number }>

declare module '@floqastinc/flow-ui_icons/material/Check' {
  const Check: MaterialIcon
  export default Check
}
declare module '@floqastinc/flow-ui_icons/material/FilterListOutlined' {
  const FilterListOutlined: MaterialIcon
  export default FilterListOutlined
}
declare module '@floqastinc/flow-ui_icons/material/ExpandMore' {
  const ExpandMore: MaterialIcon
  export default ExpandMore
}
declare module '@floqastinc/flow-ui_icons/material/ExpandLess' {
  const ExpandLess: MaterialIcon
  export default ExpandLess
}
declare module '@floqastinc/flow-ui_icons/material/MoreVert' {
  const MoreVert: MaterialIcon
  export default MoreVert
}
declare module '@floqastinc/flow-ui_icons/material/Add' {
  const Add: MaterialIcon
  export default Add
}
declare module '@floqastinc/flow-ui_icons/material/DateRange' {
  const DateRange: MaterialIcon
  export default DateRange
}
declare module '@floqastinc/flow-ui_icons/material/SortOutlined' {
  const SortOutlined: MaterialIcon
  export default SortOutlined
}
declare module '@floqastinc/flow-ui_icons/material/TableRowsOutlined' {
  const TableRowsOutlined: MaterialIcon
  export default TableRowsOutlined
}
declare module '@floqastinc/flow-ui_icons/material/DomainOutlined' {
  const DomainOutlined: MaterialIcon
  export default DomainOutlined
}
declare module '@floqastinc/flow-ui_icons/material/FolderOutlined' {
  const FolderOutlined: MaterialIcon
  export default FolderOutlined
}
declare module '@floqastinc/flow-ui_icons/material/FormatListBulletedOutlined' {
  const FormatListBulletedOutlined: MaterialIcon
  export default FormatListBulletedOutlined
}
declare module '@floqastinc/flow-ui_icons/material/FormatListBulleted' {
  const FormatListBulleted: MaterialIcon
  export default FormatListBulleted
}
declare module '@floqastinc/flow-ui_icons/material/DeleteOutlined' {
  const DeleteOutlined: MaterialIcon
  export default DeleteOutlined
}
declare module '@floqastinc/flow-ui_icons/material/PersonAddOutlined' {
  const PersonAddOutlined: MaterialIcon
  export default PersonAddOutlined
}
declare module '@floqastinc/flow-ui_icons/material/ChevronRight' {
  const ChevronRight: MaterialIcon
  export default ChevronRight
}
declare module '@floqastinc/flow-ui_icons/material/VerifiedUserOutlined' {
  const VerifiedUserOutlined: MaterialIcon
  export default VerifiedUserOutlined
}
declare module '@floqastinc/flow-ui_icons/material/SellOutlined' {
  const SellOutlined: MaterialIcon
  export default SellOutlined
}
declare module '@floqastinc/flow-ui_icons/material/ChevronLeft' {
  const ChevronLeft: MaterialIcon
  export default ChevronLeft
}
declare module '@floqastinc/flow-ui_icons/material/Close' {
  const Close: MaterialIcon
  export default Close
}
declare module '@floqastinc/flow-ui_icons/material/PlaylistAdd' {
  const PlaylistAdd: MaterialIcon
  export default PlaylistAdd
}
declare module '@floqastinc/flow-ui_icons/material/BlockOutlined' {
  const BlockOutlined: MaterialIcon
  export default BlockOutlined
}
declare module '@floqastinc/flow-ui_icons/material/EditOutlined' {
  const EditOutlined: MaterialIcon
  export default EditOutlined
}
declare module '@floqastinc/flow-ui_icons/material/AddCommentOutlined' {
  const AddCommentOutlined: MaterialIcon
  export default AddCommentOutlined
}
declare module '@floqastinc/flow-ui_icons/material/AttachFileAdd' {
  const AttachFileAdd: MaterialIcon
  export default AttachFileAdd
}
declare module '@floqastinc/flow-ui_icons/material/SettingsOutlined' {
  const SettingsOutlined: MaterialIcon
  export default SettingsOutlined
}
declare module '@floqastinc/flow-ui_icons/material/KeyOutlined' {
  const KeyOutlined: MaterialIcon
  export default KeyOutlined
}
declare module '@floqastinc/flow-ui_icons/material/VisibilityOff' {
  const VisibilityOff: MaterialIcon
  export default VisibilityOff
}
declare module '@floqastinc/flow-ui_icons/material/CheckCircle' {
  const CheckCircle: MaterialIcon
  export default CheckCircle
}
declare module '@floqastinc/flow-ui_icons/material/Group' {
  const Group: MaterialIcon
  export default Group
}
declare module '@floqastinc/flow-ui_icons/material/AccountBalance' {
  const AccountBalance: MaterialIcon
  export default AccountBalance
}
declare module '@floqastinc/flow-ui_icons/material/AddCircleOutlined' {
  const AddCircleOutlined: MaterialIcon
  export default AddCircleOutlined
}
