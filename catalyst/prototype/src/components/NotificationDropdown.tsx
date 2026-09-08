import { useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';

interface NotificationDropdownProps {
  onClose: () => void;
  bellButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationDropdown({ onClose, bellButtonRef }: NotificationDropdownProps) {
  const { personaData } = usePersona();
  const notifications = personaData.notifications;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Node) &&
        bellButtonRef?.current &&
        !bellButtonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, bellButtonRef]);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-white rounded-[12px] w-[380px] overflow-hidden"
      style={{
        top: bellButtonRef?.current ? bellButtonRef.current.getBoundingClientRect().bottom + 8 : 63,
        right: '24px',
        maxHeight: '380px',
        boxShadow: '0px 12px 24px rgba(0, 51, 42, 0.12), 0px 4px 8px rgba(0, 51, 42, 0.08)',
      }}
    >
      {/* Card border overlay - matching imported Card.tsx */}
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white z-10 px-[16px] py-[14px] border-b border-[#e4e7ec]">
        <div className="flex items-center justify-between">
          <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#2b2a29] leading-[20px]">
            Notifications
          </p>
          <button 
            className="font-['Inter',sans-serif] font-medium text-[12px] text-[#013A30] leading-[16px] hover:text-[#00241d] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle mark all as read
            }}
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="overflow-y-auto"
        style={{
          maxHeight: '280px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3)',
        }}
      >
        <div className="flex flex-col">
          {notifications.map((n, i) => (
            <NotificationItemComponent
              key={i}
              avatarInitials={n.avatarInitials}
              meta={n.meta}
              message={n.message}
              isUnread={n.isUnread}
            />
          ))}
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="sticky bottom-0 bg-white border-t border-[#e4e7ec] px-[16px] py-[12px]">
        <button 
          className="font-['Inter',sans-serif] font-medium text-[12px] text-[#013A30] leading-[16px] hover:text-[#00241d] transition-colors flex items-center gap-[4px]"
          onClick={(e) => {
            e.stopPropagation();
            // Handle view all notifications
          }}
        >
          View all notifications
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

interface NotificationItemProps {
  avatarInitials: string;
  meta: string;
  message: string;
  isUnread?: boolean;
}

function NotificationItemComponent({ avatarInitials, meta, message, isUnread }: NotificationItemProps) {
  // Helper function to render message with styled @mentions
  const renderMessage = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="bg-[#C5E9DA] rounded-[4px] px-[2px] text-[#013A30]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`px-[16px] py-[12px] border-b border-[#f2f4f7] hover:bg-[#fafaf9] transition-colors cursor-pointer ${isUnread ? 'bg-[rgba(192,232,215,0.3)]' : ''}`}>
      <div className="flex gap-[12px]">
        {/* Avatar - matching Review Notes style */}
        <div className="shrink-0">
          <div className="bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center rounded-[8px] size-[29px]">
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#c0e8d7] leading-[18px]">
              {avatarInitials}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
          {/* Meta */}
          <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#828282] leading-[14px] tracking-[0.5px]">
            {meta.toUpperCase()}
          </p>

          {/* Message with @mention styling */}
          <p className={`font-['Inter',sans-serif] ${isUnread ? 'font-semibold' : 'font-medium'} text-[12px] text-[#2b2a29] leading-[18px] tracking-[-0.12px]`}>
            {renderMessage(message)}
          </p>
        </div>
      </div>
    </div>
  );
}