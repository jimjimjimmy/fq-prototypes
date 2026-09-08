import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { usePersona } from '@/contexts/PersonaContext';

export function PersonaSwitcher() {
  const { activePersona, allPersonas, switchPersona } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[6px] hover:opacity-80 transition-opacity"
      >
        <div className="bg-[#0c1e18] flex items-center justify-center rounded-[6.667px] size-[24px]">
          <p className="font-['Inter',sans-serif] font-semibold text-[8.667px] text-white tracking-[-0.1px]">
            {activePersona.initials}
          </p>
        </div>
        <ChevronDown className="size-3 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Switch Persona</p>
          </div>
          {allPersonas.map((persona) => (
            <button
              key={persona.personaId}
              onClick={() => { switchPersona(persona.personaId); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-[#0c1e18] flex items-center justify-center rounded-[6px] size-[28px] shrink-0">
                <p className="font-['Inter',sans-serif] font-semibold text-[9px] text-white tracking-[-0.1px]">
                  {persona.initials}
                </p>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{persona.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{persona.title} &middot; {persona.role}</p>
              </div>
              {persona.personaId === activePersona.personaId && (
                <Check className="size-4 text-[#00A651] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
