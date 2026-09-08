export type PersonaId = 'emma-harrison' | 'tom-bradley' | 'claire-mitchell' | 'rachel-torres';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  title: string;
  avatar?: string;
}

export interface Persona extends User {
  personaId: PersonaId;
  description: string;
  defaultView: 'table' | 'board' | 'timeline' | 'calendar';
  focusAreas: string[];
  taskFilter?: {
    preparers?: string[];
    reviewers?: string[];
  };
}
