import { getPays, type Pays } from "@/lib/pays";

// Annuaire des services de planification familiale : c'est le fil qui relie les jeunes, les prestataires et les décideurs.
// Un service s'inscrit lui-même (statut « en attente »), un responsable le valide, puis il apparaît pour les jeunes.
// Les avis des jeunes sont anonymes. Aucun pourcentage n'est montré en dessous de 5 avis (seuil d'anonymat).

export const MIN_REVIEWS = 5;
export const STOCK_STALE_DAYS = 30;

export const SERVICE_TYPES = [
  { id: "centre-sante", label: "Centre de santé" },
  { id: "hopital", label: "Hôpital" },
  { id: "pharmacie", label: "Pharmacie" },
  { id: "clinique-ong", label: "Clinique ou ONG" },
  { id: "centre-jeunes", label: "Centre pour jeunes" },
  { id: "agent-communautaire", label: "Agent de santé communautaire" },
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number]["id"];

export const METHOD_LIST = [
  { id: "implants", label: "Implants" },
  { id: "sterilet", label: "Stérilet" },
  { id: "sterilisation-feminine", label: "Stérilisation féminine" },
  { id: "vasectomie", label: "Vasectomie" },
  { id: "pilule", label: "Pilule" },
  { id: "pilule-minidosee", label: "Pilule minidosée" },
  { id: "injectables", label: "Injectables" },
  { id: "preservatif-masculin", label: "Préservatif masculin" },
  { id: "preservatif-feminin", label: "Préservatif féminin" },
  { id: "contraception-urgence", label: "Pilule d'urgence" },
] as const;
export type ServiceMethod = (typeof METHOD_LIST)[number]["id"];

export type ServiceStatus = "en-attente" | "valide" | "refuse";
export type YesNoUnknown = "oui" | "non" | "inconnu";

export type ServiceInput = {
  nom: string;
  type: ServiceType;
  zone: string;
  commune: string;
  adresse: string;
  telephone: string;
  horaires: string;
  methodes: ServiceMethod[];
  accueilJeunes: boolean;
  gratuitJeunes: YesNoUnknown;
  confidentialite: boolean;
};

export type Service = ServiceInput & { id: string; statut: ServiceStatus; creeLe: string; majLe: string };

export type FieldErrors = Record<string, string>;
export type Validation<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

// Retire les caractères de contrôle et réduit les espaces. Le texte est affiché tel quel par React (pas de HTML).
export function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

const PHONE = /^\+?[0-9][0-9 .-]{5,19}$/;

export function validateServiceInput(raw: unknown, pays: Pays = getPays()): Validation<ServiceInput> {
  const data = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const nom = clean(data.nom, 120);
  if (nom.length < 3) errors.nom = "Écris le nom du service (3 lettres au moins).";

  const type = SERVICE_TYPES.find((t) => t.id === data.type)?.id;
  if (!type) errors.type = "Choisis un type de service.";

  const zone = typeof data.zone === "string" && pays.zones.includes(data.zone) ? data.zone : "";
  if (!zone) errors.zone = "Choisis une zone dans la liste.";

  const commune = clean(data.commune, 80);
  if (commune.length < 2) errors.commune = "Écris la commune ou le village.";

  const telephone = clean(data.telephone, 20);
  if (telephone && !PHONE.test(telephone)) errors.telephone = "Numéro non valide.";

  const known = new Set<string>(METHOD_LIST.map((m) => m.id));
  const methodes = Array.isArray(data.methodes) ? [...new Set(data.methodes.filter((m): m is ServiceMethod => typeof m === "string" && known.has(m)))] : [];
  if (methodes.length === 0) errors.methodes = "Coche au moins une méthode proposée.";

  const gratuit = data.gratuitJeunes === "oui" || data.gratuitJeunes === "non" ? data.gratuitJeunes : "inconnu";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      nom,
      type: type as ServiceType,
      zone,
      commune,
      adresse: clean(data.adresse, 160),
      telephone,
      horaires: clean(data.horaires, 120),
      methodes,
      accueilJeunes: data.accueilJeunes === true,
      gratuitJeunes: gratuit,
      confidentialite: data.confidentialite === true,
    },
  };
}

// ---------- Avis des jeunes (anonymes) ----------
export const REVIEW_QUESTIONS = [
  { id: "sansJugement", label: "On m'a accueilli(e) sans me juger" },
  { id: "autresMethodes", label: "On m'a parlé d'autres méthodes" },
  { id: "effets", label: "On m'a expliqué les effets possibles" },
  { id: "confidentialite", label: "Ma confidentialité a été respectée" },
  { id: "methodeObtenue", label: "J'ai pu avoir la méthode que je voulais" },
  { id: "prixClair", label: "Le prix m'a été dit clairement" },
] as const;
export type ReviewKey = (typeof REVIEW_QUESTIONS)[number]["id"];
export type ReviewAnswers = Partial<Record<ReviewKey, boolean>>;
export type Review = { serviceId: string; answers: ReviewAnswers; at: string };

export function validateAnswers(raw: unknown): ReviewAnswers | null {
  if (typeof raw !== "object" || raw === null) return null;
  const answers: ReviewAnswers = {};
  for (const q of REVIEW_QUESTIONS) {
    const value = (raw as Record<string, unknown>)[q.id];
    if (typeof value === "boolean") answers[q.id] = value;
  }
  return Object.keys(answers).length > 0 ? answers : null;
}

export type Indicator = { yes: number; total: number; pct: number | null };
export type ReviewSummary = { n: number; enough: boolean; indicators: Record<ReviewKey, Indicator> };

// Pourcentage masqué (null) tant qu'il y a moins de MIN_REVIEWS réponses pour la question : on protège les personnes.
export function summarizeReviews(reviews: Pick<Review, "answers">[], min: number = MIN_REVIEWS): ReviewSummary {
  const indicators = {} as Record<ReviewKey, Indicator>;
  for (const q of REVIEW_QUESTIONS) {
    let yes = 0;
    let total = 0;
    for (const review of reviews) {
      const value = review.answers[q.id];
      if (typeof value === "boolean") {
        total += 1;
        if (value) yes += 1;
      }
    }
    indicators[q.id] = { yes, total, pct: total >= min ? Math.round((yes / total) * 100) : null };
  }
  return { n: reviews.length, enough: reviews.length >= min, indicators };
}

// ---------- Ruptures de stock signalées par les services ----------
export type StockSignal = { serviceId: string; methode: ServiceMethod; etat: "disponible" | "rupture"; at: string };

export function latestStock(signals: StockSignal[]): StockSignal[] {
  const latest = new Map<string, StockSignal>();
  for (const signal of [...signals].sort((a, b) => a.at.localeCompare(b.at))) latest.set(`${signal.serviceId}|${signal.methode}`, signal);
  return [...latest.values()];
}

export function isStale(signal: StockSignal, now: Date = new Date()): boolean {
  return now.getTime() - new Date(signal.at).getTime() > STOCK_STALE_DAYS * 86_400_000;
}

// ---------- Recherche dans l'annuaire ----------
export type Filter = { zone?: string; methode?: string; type?: string; accueilJeunes?: boolean };

export function filterServices(services: Service[], filter: Filter): Service[] {
  return services.filter(
    (s) =>
      s.statut === "valide" &&
      (!filter.zone || s.zone === filter.zone) &&
      (!filter.methode || s.methodes.includes(filter.methode as ServiceMethod)) &&
      (!filter.type || s.type === filter.type) &&
      (!filter.accueilJeunes || s.accueilJeunes),
  );
}

export function typeLabel(type: ServiceType): string {
  return SERVICE_TYPES.find((t) => t.id === type)?.label ?? type;
}
export function methodLabel(id: string): string {
  return METHOD_LIST.find((m) => m.id === id)?.label ?? id;
}
