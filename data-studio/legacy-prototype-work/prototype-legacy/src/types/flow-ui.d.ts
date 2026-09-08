// Type stubs for Flow UI JS components (no official TS types)
// Props sourced from flow-ui-mcp get-component-info

declare module '@floqastinc/flow-ui_core' {
  import { ComponentType, ReactNode } from 'react';

  export const Toaster: ComponentType;

  export const Avatar: ComponentType<{
    fallback?: string;
    src?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    [key: string]: unknown;
  }>;

  export const Heading: ComponentType<{
    children?: ReactNode;
    variant?: 'xl' | 'lg' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    align?: 'left' | 'center' | 'right';
    [key: string]: unknown;
  }>;

  export const Button: ComponentType<{
    children?: ReactNode;
    variant?: 'filled' | 'outlined' | 'ghost' | 'dropdown' | 'group';
    color?: 'primary' | 'dark' | 'danger' | 'info' | 'warning' | 'ai';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick: () => void;
    [key: string]: unknown;
  }>;

  export const Text: ComponentType<{
    children?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    [key: string]: unknown;
  }>;

  export const StatusBadge: ComponentType<{
    children?: ReactNode;
    color?: 'neutral' | 'info' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    [key: string]: unknown;
  }>;

  export const TabGroup: ComponentType<{
    children?: ReactNode;
    activationMode?: 'manual' | 'automatic';
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    styleOverrides?: Record<string, unknown>;
    [key: string]: unknown;
  }>;

  export const Tab: ComponentType<{
    tabId: string;
    title: ReactNode;
    disabled?: boolean;
    children?: ReactNode;
    color?: 'default' | 'success' | 'danger' | 'warning';
    [key: string]: unknown;
  }>;

  export const Input: ComponentType<{
    children?: ReactNode;
    value?: string;
    onChange?: (e: unknown) => void;
    label?: string;
    placeholder?: string;
    isSearchable?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    type?: 'text' | 'search' | 'currency' | 'password';
    className?: string;
    [key: string]: unknown;
  }>;

  // Sidebar compound component
  export const Sidebar: ComponentType<{
    children: ReactNode;
    collapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
    [key: string]: unknown;
  }> & {
    Title: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Menu: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Item: ComponentType<{
      children?: ReactNode;
      value: string;
      isActive?: boolean;
      onChange?: () => void;
      size?: 'sm' | 'md';
      isDisabled?: boolean;
      [key: string]: unknown;
    }>;
  };

  export const Breadcrumbs: ComponentType<{
    children: ReactNode;
    onSelectionChange: (key: string) => void;
    selected: string;
    fullWidth?: boolean;
    [key: string]: unknown;
  }>;

  export const Table: ComponentType<{
    children?: ReactNode;
    [key: string]: unknown;
  }>;

  export const Select: ComponentType<{
    options: Array<{ label: ReactNode; value: string; disabled?: boolean }>;
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    selectionMode?: 'single' | 'multiple';
    disableClear?: boolean;
    disableFilter?: boolean;
    contentWidth?: string;
    buttonLabel?: string;
    trigger?: ReactNode;
    [key: string]: unknown;
  }>;

  export const IconButton: ComponentType<{
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'table';
    className?: string;
    [key: string]: unknown;
  }>;

  export const Modal: ComponentType<{
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    styleOverrides?: { overlay?: Record<string, unknown>; content?: Record<string, unknown> };
    [key: string]: unknown;
  }> & {
    Header: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Body: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Footer: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
  };

  export const SideDrawer: ComponentType<{
    children: ReactNode;
    show: boolean;
    onCancel?: () => void;
    width?: 'md' | 'lg';
    hidePageOverlay?: boolean;
    renderOverlay?: boolean;
    [key: string]: unknown;
  }> & {
    Header: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Body: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
    Footer: ComponentType<{ children?: ReactNode; [key: string]: unknown }>;
  };

  export const Popover: ComponentType<{
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    defaultOpen?: boolean;
    [key: string]: unknown;
  }> & {
    Trigger: ComponentType<{ children: ReactNode; [key: string]: unknown }>;
    Content: ComponentType<{
      children: ReactNode;
      side?: 'top' | 'right' | 'bottom' | 'left';
      align?: 'start' | 'center' | 'end';
      sideOffset?: number;
      [key: string]: unknown;
    }>;
  };
}

declare module '@floqastinc/flow-ui_core/Theme' {
  const Theme: {
    apply: (element: HTMLElement | null, options?: { standalone?: boolean }) => void;
  };
  export default Theme;
}

declare module '@floqastinc/flow-ui_composite' {
  import { ComponentType, ReactNode } from 'react';

  export const SideNav: ComponentType<{
    children?: ReactNode;
    [key: string]: unknown;
  }>;

  export const SideNavItem: ComponentType<{
    children?: ReactNode;
    active?: boolean;
    onClick?: () => void;
    [key: string]: unknown;
  }>;
}

declare module '@floqastinc/flow-ui_icons' {
  import { ComponentType } from 'react';

  type IconProps = {
    size?: number | string;
    color?: string;
    [key: string]: unknown;
  };

  // Add specific icons as needed
  export const ChevronRight: ComponentType<IconProps>;
  export const ChevronLeft: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Home: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
}
