import { useState, useRef, useEffect, type ReactNode } from 'react';

interface HoverPanelTriggerProps {
  panel: (maxHeight: number) => ReactNode;
  gap?: number;
  viewportPadding?: number;
  idealHeight?: number;
  openDelay?: number;
  closeDelay?: number;
  children?: ReactNode;
  className?: string;
}

export function HoverPanelTrigger({
  panel,
  gap = 22,
  viewportPadding = 11,
  idealHeight = 450,
  openDelay = 200,
  closeDelay = 150,
  children,
  className = 'relative',
}: HoverPanelTriggerProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, maxHeight: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openTimerRef.current = setTimeout(() => {
      setShowPanel(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setShowPanel(false);
    }, closeDelay);
  };

  useEffect(() => {
    if (showPanel && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const availableHeight = window.innerHeight - (viewportPadding * 2);
      const maxHeight = Math.min(idealHeight, availableHeight);
      let top = rect.top;
      if (top < viewportPadding) top = viewportPadding;
      const maxTop = window.innerHeight - maxHeight - viewportPadding;
      if (top > maxTop) top = maxTop;
      setPanelPos({ top, left: rect.right + gap, maxHeight });
    }
  }, [showPanel, gap, viewportPadding, idealHeight]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showPanel && (
        <div
          className="fixed z-[100]"
          style={{ top: `${panelPos.top}px`, left: `${panelPos.left}px` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {panel(panelPos.maxHeight)}
        </div>
      )}
    </div>
  );
}
