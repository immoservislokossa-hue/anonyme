import { randomUUID } from "node:crypto";

// Stockage des données agrégées de la plateforme : événements d'usage, services, avis, bilans, ruptures.
// Deux moteurs : la mémoire (démonstration et développement : les données disparaissent au redémarrage) et Supabase
// (si SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY existent : une seule table « alviosa_rows », voir docs/schema.sql).
// Jamais de texte de message, de nom ni d'identifiant de personne dans ces tables.

export type TableName = "events" | "services" | "reviews" | "bilans" | "stock";
export type StoredRow = { id: string; at: string } & Record<string, unknown>;

export interface Store {
  readonly kind: "memory" | "supabase";
  insert(table: TableName, data: Record<string, unknown>): Promise<StoredRow>;
  list(table: TableName, limit?: number): Promise<StoredRow[]>;
  update(table: TableName, id: string, patch: Record<string, unknown>): Promise<StoredRow | null>;
}

const MAX_ROWS = 20_000;
const PAGE = 1000;
type Env = Record<string, string | undefined>;

class MemoryStore implements Store {
  readonly kind = "memory" as const;
  private tables = new Map<TableName, StoredRow[]>();

  private rows(table: TableName): StoredRow[] {
    let rows = this.tables.get(table);
    if (!rows) {
      rows = [];
      this.tables.set(table, rows);
    }
    return rows;
  }

  async insert(table: TableName, data: Record<string, unknown>): Promise<StoredRow> {
    const row: StoredRow = { ...data, id: randomUUID(), at: new Date().toISOString() };
    const rows = this.rows(table);
    rows.push(row);
    if (rows.length > MAX_ROWS) rows.shift();
    return row;
  }

  async list(table: TableName, limit = MAX_ROWS): Promise<StoredRow[]> {
    return this.rows(table).slice(-limit);
  }

  async update(table: TableName, id: string, patch: Record<string, unknown>): Promise<StoredRow | null> {
    const row = this.rows(table).find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
}

type SupabaseRow = { id: string; tbl: string; data: Record<string, unknown>; at: string };

class SupabaseStore implements Store {
  readonly kind = "supabase" as const;
  constructor(
    private readonly url: string,
    private readonly key: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    // Les anciennes clés sont des JWT (« eyJ… ») et vont aussi dans Authorization ; les nouvelles (« sb_secret_… ») n'en sont pas.
    const bearer: Record<string, string> = this.key.startsWith("eyJ") ? { Authorization: `Bearer ${this.key}` } : {};
    return { apikey: this.key, ...bearer, "Content-Type": "application/json", ...extra };
  }

  private flatten(row: SupabaseRow): StoredRow {
    return { ...row.data, id: row.id, at: row.at };
  }

  async insert(table: TableName, data: Record<string, unknown>): Promise<StoredRow> {
    const response = await this.fetchImpl(`${this.url}/rest/v1/alviosa_rows`, {
      method: "POST",
      headers: this.headers({ Prefer: "return=representation" }),
      body: JSON.stringify({ tbl: table, data }),
    });
    if (!response.ok) throw new Error(`Stockage : écriture refusée (${response.status})`);
    const [row] = (await response.json()) as SupabaseRow[];
    return this.flatten(row);
  }

  // Supabase rend au plus 1000 lignes par requête : on lit page par page, les plus récentes d'abord, puis on remet dans l'ordre.
  async list(table: TableName, limit = MAX_ROWS): Promise<StoredRow[]> {
    const want = Math.min(limit, MAX_ROWS);
    const rows: SupabaseRow[] = [];
    while (rows.length < want) {
      const size = Math.min(PAGE, want - rows.length);
      const response = await this.fetchImpl(
        `${this.url}/rest/v1/alviosa_rows?tbl=eq.${table}&order=at.desc&limit=${size}&offset=${rows.length}`,
        { headers: this.headers() },
      );
      if (!response.ok) throw new Error(`Stockage : lecture refusée (${response.status})`);
      const page = (await response.json()) as SupabaseRow[];
      rows.push(...page);
      if (page.length < size) break;
    }
    return rows.reverse().map((row) => this.flatten(row));
  }

  async update(table: TableName, id: string, patch: Record<string, unknown>): Promise<StoredRow | null> {
    const found = await this.fetchImpl(`${this.url}/rest/v1/alviosa_rows?id=eq.${encodeURIComponent(id)}&tbl=eq.${table}`, {
      headers: this.headers(),
    });
    if (!found.ok) throw new Error(`Stockage : lecture refusée (${found.status})`);
    const [current] = (await found.json()) as SupabaseRow[];
    if (!current) return null;
    const response = await this.fetchImpl(`${this.url}/rest/v1/alviosa_rows?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.headers({ Prefer: "return=representation" }),
      body: JSON.stringify({ data: { ...current.data, ...patch } }),
    });
    if (!response.ok) throw new Error(`Stockage : mise à jour refusée (${response.status})`);
    const [row] = (await response.json()) as SupabaseRow[];
    return row ? this.flatten(row) : null;
  }
}

export function createStore(env: Env = process.env, fetchImpl: typeof fetch = fetch): Store {
  const url = env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return new SupabaseStore(url, key, fetchImpl);
  return new MemoryStore();
}

// Une seule instance par processus, même quand Next recharge les modules en développement.
const globalForStore = globalThis as unknown as { __alviosaStore?: Store };

export function getStore(): Store {
  if (!globalForStore.__alviosaStore) globalForStore.__alviosaStore = createStore();
  return globalForStore.__alviosaStore;
}

export function resetStoreForTests(): void {
  globalForStore.__alviosaStore = undefined;
}
