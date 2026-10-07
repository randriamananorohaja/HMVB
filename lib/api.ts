/**
 * API VolleyTeam — couche d'accès aux données (SQLite local)
 */
import { getDb, generateId, nowIso } from './database';
import type { Member, Presence, PresenceStatus, Team, Training } from './types';
import type { MemberFee } from './types';

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
      birth_date, birth_place, address, status, avatar, qr_code, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      `HMVB-${id}`,
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

// ─── Historique saison & nettoyage auto ──────────────────

export type HistoryRow = {
  training_id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  member_id: string;
  first_name: string;
  last_name: string;
  number: number;
  position: string;
  status: string;
  time: string | null;
};

export async function getSeasonHistory(): Promise<HistoryRow[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<HistoryRow>(`
    SELECT
      t.id as training_id,
      t.date,
      t.start_time,
      t.end_time,
      t.location,
      m.id as member_id,
      m.first_name,
      m.last_name,
      m.number,
      m.position,
      COALESCE(p.status, 'absent') as status,
      p.time
    FROM trainings t
    CROSS JOIN members m
    LEFT JOIN presences p ON p.training_id = t.id AND p.member_id = m.id
    WHERE m.status = 'actif'
    ORDER BY t.date DESC, t.start_time DESC, m.number ASC
  `);
  return rows ?? [];
}

/** Génère un CSV compatible Excel (séparateur ;) */
export function historyToCsv(rows: HistoryRow[]): string {
  const header = 'Date;Heure début;Heure fin;Lieu;N°;Nom;Prénom;Position;Statut;Heure pointage';
  const lines = rows.map((r) => {
    const status =
      r.status === 'present' ? 'Présent' : r.status === 'retard' ? 'En retard' : 'Absent';
    return [
      r.date,
      r.start_time,
      r.end_time,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      r.number,
      `"${r.last_name.replace(/"/g, '""')}"`,
      `"${r.first_name.replace(/"/g, '""')}"`,
      `"${(r.position || '').replace(/"/g, '""')}"`,
      status,
      r.time || '',
    ].join(';');
  });
  // BOM UTF-8 for Excel
  return '\uFEFF' + [header, ...lines].join('\n');
}

/**
 * Supprime les entraînements dont l'heure de fin est dépassée.
 * Conserves les présences liées? Non — on archive en gardant historique via soft? User asked delete.
 * On supprime l'entraînement ET ses présences (CASCADE déjà en schema).
 * ATTENTION: cela efface l'historique. Better: only delete if user wants auto-clean of past sessions
 * from the list but keep data... User said "supprimer automatiquement l'entrainement une fois heure de fin atteint"
 * So delete from trainings table. History export should run before or we keep presences?
 * Schema has ON DELETE CASCADE on presences. For history we need to either soft-delete or keep.
 * I'll soft-delete: add archived flag, or move to history.
 * Simpler approach without migration issues: mark as ended by filtering them out of active list
 * but user said "supprimer". I'll delete trainings past end time from active views by deleting them
 * BUT first ensure history is stored... Actually the history query joins trainings - if deleted, history gone.
 *
 * Solution: add column `ended` INTEGER DEFAULT 0, set to 1 when past end, hide from list.
 * Or keep trainings and just not show as "upcoming". User said delete auto though.
 *
 * I'll implement cleanup that soft-archives via status column on trainings.
 */
/**
 * Anciennement : archivait les séances passées.
 * DÉSACTIVÉ : l'historique des présences et les séances restent
 * toujours en base jusqu'à suppression manuelle par le coach.
 */
export async function cleanupExpiredTrainings(): Promise<number> {
  // Ne supprime / n'archive plus rien automatiquement
  return 0;
}

/** Tous les entraînements (y compris terminés) avec stats — rien n'est auto-supprimé */
export async function getActiveTrainingsWithStats() {
  return getTrainingsWithStats();
}


// ─── Écolage (janvier → décembre) ────────────────────────


export async function getMemberFees(memberId: string, year: number): Promise<MemberFee[]> {
  const db = await getDb();
  // Ensure 12 months exist
  const now = nowIso();
  for (let month = 1; month <= 12; month++) {
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM member_fees WHERE member_id = ? AND year = ? AND month = ?',
      [memberId, year, month]
    );
    if (!existing) {
      await db.runAsync(
        `INSERT INTO member_fees (id, member_id, year, month, paid, amount, paid_at, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, null, null, null, ?, ?)`,
        [generateId(), memberId, year, month, now, now]
      );
    }
  }
  return (
    (await db.getAllAsync<MemberFee>(
      'SELECT * FROM member_fees WHERE member_id = ? AND year = ? ORDER BY month ASC',
      [memberId, year]
    )) ?? []
  );
}

export async function setMemberFeePaid(
  memberId: string,
  year: number,
  month: number,
  paid: boolean,
  amount?: number | null
): Promise<void> {
  const db = await getDb();
  const now = nowIso();
  const row = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM member_fees WHERE member_id = ? AND year = ? AND month = ?',
    [memberId, year, month]
  );
  if (row) {
    await db.runAsync(
      `UPDATE member_fees SET paid = ?, amount = ?, paid_at = ?, updated_at = ? WHERE id = ?`,
      [paid ? 1 : 0, amount ?? null, paid ? now : null, now, row.id]
    );
  } else {
    await db.runAsync(
      `INSERT INTO member_fees (id, member_id, year, month, paid, amount, paid_at, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, null, ?, ?)`,
      [generateId(), memberId, year, month, paid ? 1 : 0, amount ?? null, paid ? now : null, now, now]
    );
  }
}

export async function getMemberFeeSummary(memberId: string, year: number): Promise<{ paid: number; total: number }> {
  const fees = await getMemberFees(memberId, year);
  const paid = fees.filter((f) => f.paid === 1).length;
  return { paid, total: 12 };
}
