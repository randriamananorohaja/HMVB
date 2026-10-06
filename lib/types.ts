export type MemberStatus = 'actif' | 'desactive';
export type PresenceStatus = 'present' | 'retard' | 'absent';
export type Position =
  | 'Réceptionneur-attaquant'
  | 'Passeuse'
  | 'Central'
  | 'Pointue'
  | 'Libéro'
  | 'Réceptionneuse';

export interface Member {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  number: number;
  position: Position | string;
  phone: string;
  email?: string | null;
  birth_date?: string | null;
  birth_place?: string | null;
  address?: string | null;
  status: MemberStatus | string;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Training {
  id: string;
  team_id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Presence {
  id: string;
  training_id: string;
  member_id: string;
  status: PresenceStatus | string;
  time?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  category: string;
  coach: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export const POSITIONS: Position[] = [
  'Réceptionneur-attaquant',
  'Passeuse',
  'Central',
  'Pointue',
  'Libéro',
  'Réceptionneuse',
];
