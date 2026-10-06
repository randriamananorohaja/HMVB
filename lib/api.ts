/**
 * API VolleyTeam — couche d'accès aux données (SQLite local)
 */
import { getDb, generateId, nowIso } from './database';
import type { Member, Presence, PresenceStatus, Team, Training } from './types';

// ─── Teams ───────────────────────────────────────────────

export async function getTeam(): Promise<Team | null> {
  const db = await getDb();
  return (await db.getFirstAsync<Team>('SELECT * FROM teams LIMIT 1')) ?? null;
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team | null> {
  const db = await getDb();
  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (k === 'id' || k === 'created_at') continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);
  await db.runAsync(`UPDATE teams SET ${fields.join(', ')} WHERE id = ?`, values);
  return (await db.getFirstAsync<Team>('SELECT * FROM teams WHERE id = ?', [id])) ?? null;
}

// ─── Members ─────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  const db = await getDb();
  return (await db.getAllAsync<Member>('SELECT * FROM members ORDER BY number ASC, last_name ASC')) ?? [];
}

export async function getMember(id: string): Promise<Member | null> {
  const db = await getDb();
  return (await db.getFirstAsync<Member>('SELECT * FROM members WHERE id = ?', [id])) ?? null;
}

export async function createMember(
  member: Partial<Member> & { first_name: string; last_name: string }
): Promise<Member | null> {
  const db = await getDb();
  const team = await getTeam();
  if (!team) return null;

  const id = generateId();
  const now = nowIso();
  await db.runAsync(
    `INSERT INTO members (
      id, team_id, first_name, last_name, number, position, phone, email,
      birth_date, birth_place, address, status, avatar, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      team.id,
      member.first_name,
      member.last_name,
      member.number ?? 0,
      member.position ?? 'Réceptionneur-attaquant',
      member.phone ?? '',
      member.email ?? null,
      member.birth_date ?? null,
      member.birth_place ?? null,
      member.address ?? null,
      member.status ?? 'actif',
      member.avatar ?? null,
      now,
      now,
    ]
  );
  return getMember(id);
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<Member | null> {
  const db = await getDb();
  const allowed = [
    'first_name', 'last_name', 'number', 'position', 'phone', 'email',
    'birth_date', 'birth_place', 'address', 'status', 'avatar',
  ];
  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (!allowed.includes(k)) continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return getMember(id);
  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);
  await db.runAsync(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`, values);
  return getMember(id);
}

export async function deleteMember(id: string): Promise<boolean> {
  const db = await getDb();
  await db.runAsync('DELETE FROM presences WHERE member_id = ?', [id]);
  const result = await db.runAsync('DELETE FROM members WHERE id = ?', [id]);
  return (result.changes ?? 0) > 0;
}

// ─── Trainings ───────────────────────────────────────────

export async function getTrainings(): Promise<Training[]> {
  const db = await getDb();
  return (
    (await db.getAllAsync<Training>(
      'SELECT * FROM trainings ORDER BY date DESC, start_time DESC'
    )) ?? []
  );
}

export async function getTraining(id: string): Promise<Training | null> {
  const db = await getDb();
  return (await db.getFirstAsync<Training>('SELECT * FROM trainings WHERE id = ?', [id])) ?? null;
}

export async function getTodayTraining(): Promise<Training | null> {
  const db = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  return (
    (await db.getFirstAsync<Training>(
      'SELECT * FROM trainings WHERE date = ? ORDER BY start_time ASC LIMIT 1',
      [today]
    )) ?? null
  );
}

export async function createTraining(
  training: Partial<Training> & { date: string; start_time: string; end_time: string }
): Promise<Training | null> {
  const db = await getDb();
  const team = await getTeam();
  if (!team) return null;

  const id = generateId();
  const now = nowIso();
  await db.runAsync(
    `INSERT INTO trainings (id, team_id, date, start_time, end_time, location, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      team.id,
      training.date,
      training.start_time,
      training.end_time,
      training.location ?? '',
      training.notes ?? null,
      now,
      now,
    ]
  );
  return getTraining(id);
}

export async function updateTraining(id: string, updates: Partial<Training>): Promise<Training | null> {
  const db = await getDb();
  const allowed = ['date', 'start_time', 'end_time', 'location', 'notes'];
  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (!allowed.includes(k)) continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return getTraining(id);
  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);
  await db.runAsync(`UPDATE trainings SET ${fields.join(', ')} WHERE id = ?`, values);
  return getTraining(id);
}

export async function deleteTraining(id: string): Promise<boolean> {
  const db = await getDb();
  await db.runAsync('DELETE FROM presences WHERE training_id = ?', [id]);
  const result = await db.runAsync('DELETE FROM trainings WHERE id = ?', [id]);
  return (result.changes ?? 0) > 0;
}

export type TrainingWithStats = Training & {
  presents: number;
  retards: number;
  absents: number;
  total_members: number;
};

export async function getTrainingsWithStats(): Promise<TrainingWithStats[]> {
  const trainings = await getTrainings();
  const members = await getMembers();
  const activeCount = members.filter((m) => m.status === 'actif').length;
  const db = await getDb();

  const result: TrainingWithStats[] = [];
  for (const t of trainings) {
    const rows = await db.getAllAsync<{ status: string; cnt: number }>(
      `SELECT status, COUNT(*) as cnt FROM presences WHERE training_id = ? GROUP BY status`,
      [t.id]
    );
    const map: Record<string, number> = {};
    for (const r of rows) map[r.status] = r.cnt;
    const presents = map['present'] ?? 0;
    const retards = map['retard'] ?? 0;
    const recorded = presents + retards + (map['absent'] ?? 0);
    const absents = Math.max(0, activeCount - presents - retards);
    result.push({
      ...t,
      presents,
      retards,
      absents: recorded > 0 ? absents : activeCount,
      total_members: activeCount,
    });
  }
  return result;
}

// ─── Presences ───────────────────────────────────────────

export async function getPresencesForTraining(trainingId: string): Promise<(Presence & { member?: Member })[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Presence>(
    'SELECT * FROM presences WHERE training_id = ?',
    [trainingId]
  );
  const members = await getMembers();
  const byId = Object.fromEntries(members.map((m) => [m.id, m]));
  return (rows ?? []).map((p) => ({ ...p, member: byId[p.member_id] }));
}

export async function setPresence(
  trainingId: string,
  memberId: string,
  status: PresenceStatus,
  time?: string
): Promise<Presence | null> {
  const db = await getDb();
  const now = nowIso();
  const existing = await db.getFirstAsync<Presence>(
    'SELECT * FROM presences WHERE training_id = ? AND member_id = ?',
    [trainingId, memberId]
  );

  if (existing) {
    await db.runAsync(
      'UPDATE presences SET status = ?, time = ?, updated_at = ? WHERE id = ?',
      [status, time ?? existing.time ?? null, now, existing.id]
    );
    return (
      (await db.getFirstAsync<Presence>('SELECT * FROM presences WHERE id = ?', [existing.id])) ??
      null
    );
  }

  const id = generateId();
  await db.runAsync(
    `INSERT INTO presences (id, training_id, member_id, status, time, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, trainingId, memberId, status, time ?? null, now, now]
  );
  return (await db.getFirstAsync<Presence>('SELECT * FROM presences WHERE id = ?', [id])) ?? null;
}

export async function getMemberPresenceStats(memberId: string): Promise<{
  presents: number;
  retards: number;
  absents: number;
  total: number;
  rate: number;
}> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ status: string; cnt: number }>(
    `SELECT status, COUNT(*) as cnt FROM presences WHERE member_id = ? GROUP BY status`,
    [memberId]
  );
  const map: Record<string, number> = {};
  for (const r of rows ?? []) map[r.status] = r.cnt;
  const presents = map['present'] ?? 0;
  const retards = map['retard'] ?? 0;
  const absents = map['absent'] ?? 0;
  const total = presents + retards + absents;
  const rate = total === 0 ? 0 : Math.round(((presents + retards * 0.5) / total) * 100);
  return { presents, retards, absents, total, rate };
}

export async function getGlobalStats(): Promise<{
  trainingsCount: number;
  avgRate: number;
  presents: number;
  retards: number;
  absents: number;
}> {
  const db = await getDb();
  const trainingsCount =
    (await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM trainings'))?.c ?? 0;
  const rows = await db.getAllAsync<{ status: string; cnt: number }>(
    `SELECT status, COUNT(*) as cnt FROM presences GROUP BY status`
  );
  const map: Record<string, number> = {};
  for (const r of rows ?? []) map[r.status] = r.cnt;
  const presents = map['present'] ?? 0;
  const retards = map['retard'] ?? 0;
  const absents = map['absent'] ?? 0;
  const total = presents + retards + absents;
  const avgRate = total === 0 ? 0 : Math.round(((presents + retards * 0.5) / total) * 100);
  return { trainingsCount, avgRate, presents, retards, absents };
}

// ─── Notifications (local) ───────────────────────────────

export async function addNotification(title: string, body?: string, icon?: string, color?: string) {
  const db = await getDb();
  const id = generateId();
  await db.runAsync(
    `INSERT INTO notifications (id, title, body, icon, color, read, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)`,
    [id, title, body ?? null, icon ?? null, color ?? null, nowIso()]
  );
}

export async function getNotifications() {
  const db = await getDb();
  return (
    (await db.getAllAsync<{
      id: string;
      title: string;
      body: string | null;
      icon: string | null;
      color: string | null;
      read: number;
      created_at: string;
    }>('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50')) ?? []
  );
}

// ─── Helpers format ──────────────────────────────────────

export function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
  return `${days[d.getDay()]}. ${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}. ${d.getFullYear()}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10);
}
