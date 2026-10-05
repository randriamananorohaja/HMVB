/**
 * Mock data for VolleyTeam app
 */

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
  firstName: string;
  lastName: string;
  number: number;
  position: Position;
  phone: string;
  email?: string;
  birthDate?: string;
  status: MemberStatus;
  avatar?: string;
  presenceRate: number;
  presents: number;
  absents: number;
  retards: number;
}

export interface Training {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
  presents: number;
  retards: number;
  absents: number;
  totalMembers: number;
}

export interface PresenceRecord {
  memberId: string;
  status: PresenceStatus;
  time?: string;
}

export const TEAM = {
  name: 'Volley Team',
  category: 'Senior',
  coach: 'Rakoto Andry',
  season: '2026 - 2027',
  memberCount: 15,
};

export const MEMBERS: Member[] = [
  {
    id: '1',
    firstName: 'Andry',
    lastName: 'Rakoto',
    number: 7,
    position: 'Réceptionneur-attaquant',
    phone: '+261 34 12 34 567',
    email: 'andry.rakoto@example.com',
    birthDate: '12 mars 2004',
    status: 'actif',
    presenceRate: 92,
    presents: 38,
    absents: 4,
    retards: 2,
  },
  {
    id: '2',
    firstName: 'Tiana',
    lastName: 'Randria',
    number: 12,
    position: 'Passeuse',
    phone: '+261 34 11 22 333',
    status: 'actif',
    presenceRate: 90,
    presents: 36,
    absents: 3,
    retards: 1,
  },
  {
    id: '3',
    firstName: 'Hery',
    lastName: 'Andriam',
    number: 4,
    position: 'Central',
    phone: '+261 33 44 55 666',
    status: 'actif',
    presenceRate: 84,
    presents: 32,
    absents: 5,
    retards: 3,
  },
  {
    id: '4',
    firstName: 'Fara',
    lastName: 'Razafind',
    number: 10,
    position: 'Pointue',
    phone: '+261 32 98 76 543',
    status: 'actif',
    presenceRate: 76,
    presents: 28,
    absents: 8,
    retards: 4,
  },
  {
    id: '5',
    firstName: 'Mika',
    lastName: 'Rasoanaivo',
    number: 3,
    position: 'Libéro',
    phone: '+261 34 55 66 777',
    status: 'actif',
    presenceRate: 68,
    presents: 25,
    absents: 10,
    retards: 5,
  },
  {
    id: '6',
    firstName: 'Niry',
    lastName: 'Andrianjafy',
    number: 8,
    position: 'Réceptionneuse',
    phone: '+261 33 12 34 567',
    status: 'desactive',
    presenceRate: 62,
    presents: 20,
    absents: 12,
    retards: 3,
  },
  {
    id: '7',
    firstName: 'Lalaina',
    lastName: 'R.',
    number: 15,
    position: 'Central',
    phone: '+261 34 77 88 999',
    status: 'actif',
    presenceRate: 80,
    presents: 30,
    absents: 6,
    retards: 2,
  },
];

export const TRAININGS: Training[] = [
  {
    id: 't1',
    date: '2026-10-02',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase Ankorondrano',
    notes: 'Travail technique + jeu collectif',
    presents: 12,
    retards: 1,
    absents: 2,
    totalMembers: 15,
  },
  {
    id: 't2',
    date: '2026-10-05',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase principal',
    presents: 15,
    retards: 0,
    absents: 0,
    totalMembers: 15,
  },
  {
    id: 't3',
    date: '2026-10-08',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase principal',
    presents: 14,
    retards: 0,
    absents: 1,
    totalMembers: 15,
  },
  {
    id: 't4',
    date: '2026-10-12',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase principal',
    presents: 15,
    retards: 0,
    absents: 0,
    totalMembers: 15,
  },
  {
    id: 't5',
    date: '2026-10-15',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase Ankorondrano',
    presents: 13,
    retards: 0,
    absents: 2,
    totalMembers: 15,
  },
  {
    id: 't6',
    date: '2026-10-19',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Gymnase principal',
    presents: 15,
    retards: 0,
    absents: 0,
    totalMembers: 15,
  },
];

export const TODAY_PRESENCE: PresenceRecord[] = [
  { memberId: '1', status: 'present', time: '18:03' },
  { memberId: '2', status: 'present', time: '18:05' },
  { memberId: '3', status: 'present', time: '18:06' },
  { memberId: '4', status: 'retard', time: '18:17' },
  { memberId: '5', status: 'absent' },
  { memberId: '6', status: 'absent' },
  { memberId: '7', status: 'present', time: '18:04' },
];

export function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
  return `${days[d.getDay()]}. ${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}. ${d.getFullYear()}`;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${String(d.getDate()).padStart(2, '0')} ${['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'][d.getMonth()]}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export const POSITIONS: Position[] = [
  'Réceptionneur-attaquant',
  'Passeuse',
  'Central',
  'Pointue',
  'Libéro',
  'Réceptionneuse',
];
