import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Persona, PersonaId } from '@/types';
import { personas, defaultPersonaId } from '@/data/users';
import { getPersonaData, type PersonaData } from '@/data/personas';

interface PersonaContextValue {
  activePersona: Persona;
  personaData: PersonaData;
  switchPersona: (id: PersonaId) => void;
  allPersonas: Persona[];
}

const PersonaCtx = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<PersonaId>(defaultPersonaId);

  const switchPersona = useCallback((id: PersonaId) => {
    setActiveId(id);
  }, []);

  const activePersona = personas[activeId];
  const personaData = getPersonaData(activeId);
  const allPersonas = Object.values(personas);

  return (
    <PersonaCtx.Provider value={{ activePersona, personaData, switchPersona, allPersonas }}>
      {children}
    </PersonaCtx.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaCtx);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
