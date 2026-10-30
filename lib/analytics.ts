import type { BilanPayload, CheckId } from "@/lib/pro/consultation";
import { COUNSELING_CHECKS } from "@/lib/pro/consultation";
import { METHOD_LIST, REVIEW_QUESTIONS, isStale, latestStock, methodLabel, summarizeReviews, type Review, type Service, type StockSignal } from "@/lib/services";

// Indicateurs du tableau de bord Pilotage. Tout est agrégé : aucune ligne individuelle n'est montrée,
// et toute valeur calculée sur moins de MIN_CELL observations est masquée (« < 5 »).

export const MIN_CELL = 5;
export const MIN_PROVIDERS = 3;
const DAY = 86_400_000;

// Points de comparaison publiés (Burkina Faso, 2017-18, utilisatrices de méthodes modernes). Ils servent de repère, pas de cible pour le Bénin.
export const PMA_BASELINE = { autresMethodes: 64.9, effets: 52.1, source: "PMA2020 Burkina Faso, vague 5 (2017-18)" } as const;

export type EventRow = { kind: string; theme?: string; zone?: string; at: string };
export type BilanRow = BilanPayload & { at: string };
export type ReviewRow = Review;

export type Dataset = {
  demo: boolean;
  events: EventRow[];
  bilans: BilanRow[];
  reviews: ReviewRow[];
  services: Service[];
  stock: StockSignal[];
  zones: string[];
};

export type Masked = number | "<5";
export const mask = (n: number, min = MIN_CELL): Masked => (n < min ? "<5" : n);

function within<T extends { at: string }>(rows: T[], from: number, to: number): T[] {
  return rows.filter((r) => {
    const t = new Date(r.at).getTime();
    return t >= from && t < to;
  });
}

export type Overview = {
  questions: { semaine: Masked; precedente: Masked; hausse: number | null };
  outils: Masked;
  urgences: Masked;
  avis: number;
  consultations: number;
  prestataires: number;
  services: { valides: number; enAttente: number; accueilJeunes: number };
};

export function overview(ds: Dataset, now: Date = new Date()): Overview {
  const t = now.getTime();
  const week = within(ds.events, t - 7 * DAY, t + 1);
  const prev = within(ds.events, t - 14 * DAY, t - 7 * DAY);
  const q = week.filter((e) => e.kind === "question").length;
  const qPrev = prev.filter((e) => e.kind === "question").length;
  const valid = ds.services.filter((s) => s.statut === "valide");
  return {
    questions: { semaine: mask(q), precedente: mask(qPrev), hausse: q >= MIN_CELL && qPrev >= MIN_CELL ? Math.round(((q - qPrev) / qPrev) * 100) : null },
    outils: mask(week.filter((e) => e.kind.startsWith("outil-")).length),
    urgences: mask(week.filter((e) => e.kind === "urgence").length),
    avis: ds.reviews.length,
    consultations: ds.bilans.reduce((s, b) => s + b.consultations, 0),
    prestataires: ds.bilans.length,
    services: { valides: valid.length, enAttente: ds.services.filter((s) => s.statut === "en-attente").length, accueilJeunes: valid.filter((s) => s.accueilJeunes).length },
  };
}

export type ThemeRow = { theme: string; count: Masked; raw: number };

export function themeRanking(ds: Dataset, now: Date = new Date(), days = 30): ThemeRow[] {
  const t = now.getTime();
  const counts = new Map<string, number>();
  for (const e of within(ds.events, t - days * DAY, t + 1)) {
    if (e.kind === "question" && e.theme) counts.set(e.theme, (counts.get(e.theme) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([theme, raw]) => ({ theme, raw, count: mask(raw) }))
    .filter((r) => r.raw >= MIN_CELL)
    .sort((a, b) => b.raw - a.raw);
}

export type QualityRow = { id: string; label: string; pct: number | null; baseline?: number };
export type Quality = { providerRows: QualityRow[]; youthRows: QualityRow[]; consultations: number; prestataires: number; enough: boolean; youthEnough: boolean; reviews: number };

export function quality(ds: Dataset): Quality {
  const consultations = ds.bilans.reduce((s, b) => s + b.consultations, 0);
  const enough = ds.bilans.length >= MIN_PROVIDERS && consultations >= MIN_CELL;
  const providerRows: QualityRow[] = COUNSELING_CHECKS.map((c) => {
    const yes = ds.bilans.reduce((s, b) => s + (b.checks[c.id as CheckId] ?? 0), 0);
    const baseline = c.id === "autresMethodes" ? PMA_BASELINE.autresMethodes : c.id === "effets" ? PMA_BASELINE.effets : undefined;
    return { id: c.id, label: c.label, pct: enough ? Math.round((yes / consultations) * 100) : null, baseline };
  });
  const summary = summarizeReviews(ds.reviews);
  const youthRows: QualityRow[] = REVIEW_QUESTIONS.map((q) => ({
    id: q.id,
    label: q.label,
    pct: summary.indicators[q.id].pct,
    baseline: q.id === "autresMethodes" ? PMA_BASELINE.autresMethodes : q.id === "effets" ? PMA_BASELINE.effets : undefined,
  }));
  return { providerRows, youthRows, consultations, prestataires: ds.bilans.length, enough, youthEnough: summary.enough, reviews: ds.reviews.length };
}

export type CoverageRow = {
  zone: string;
  services: number;
  accueilJeunes: number;
  methodes: Record<string, number>;
  manquantes: string[];
  ruptures: { methode: string; services: number }[];
  demandes: Masked;
};

export function coverage(ds: Dataset, now: Date = new Date()): CoverageRow[] {
  const latest = latestStock(ds.stock).filter((s) => s.etat === "rupture" && !isStale(s, now));
  const t = now.getTime();
  const recent = within(ds.events, t - 30 * DAY, t + 1);
  return ds.zones.map((zone) => {
    const here = ds.services.filter((s) => s.statut === "valide" && s.zone === zone);
    const ids = new Set(here.map((s) => s.id));
    const methodes: Record<string, number> = {};
    for (const m of METHOD_LIST) methodes[m.id] = here.filter((s) => s.methodes.includes(m.id)).length;
    const ruptures = METHOD_LIST.map((m) => ({ methode: m.id, services: latest.filter((r) => r.methode === m.id && ids.has(r.serviceId)).length })).filter((r) => r.services > 0);
    return {
      zone,
      services: here.length,
      accueilJeunes: here.filter((s) => s.accueilJeunes).length,
      methodes,
      manquantes: here.length === 0 ? [] : METHOD_LIST.filter((m) => methodes[m.id] === 0).map((m) => m.id),
      ruptures,
      demandes: mask(recent.filter((e) => e.zone === zone).length),
    };
  });
}

export type Alert = { id: string; niveau: "info" | "attention" | "urgent"; titre: string; detail: string };

export function alerts(ds: Dataset, now: Date = new Date()): Alert[] {
  const out: Alert[] = [];
  const t = now.getTime();

  // 1. Hausse d'un thème de questions : de quoi parlent les jeunes cette semaine ?
  const week = within(ds.events, t - 7 * DAY, t + 1).filter((e) => e.kind === "question" && e.theme);
  const prev = within(ds.events, t - 14 * DAY, t - 7 * DAY).filter((e) => e.kind === "question" && e.theme);
  const themes = new Set(week.map((e) => e.theme as string));
  for (const theme of themes) {
    const now7 = week.filter((e) => e.theme === theme).length;
    const before = prev.filter((e) => e.theme === theme).length;
    if (now7 >= MIN_CELL && now7 >= Math.max(2 * before, MIN_CELL)) {
      out.push({ id: `hausse-${theme}`, niveau: theme === "rumeurs" || theme === "urgence" ? "attention" : "info", titre: `Hausse des questions sur « ${theme} »`, detail: `Au moins deux fois plus que la semaine précédente (${before < MIN_CELL ? "moins de 5" : before} auparavant).` });
    }
  }

  // 2. Ruptures de stock : une même méthode signalée en rupture par au moins deux services d'une zone.
  const ruptures = latestStock(ds.stock).filter((s) => s.etat === "rupture" && !isStale(s, now));
  for (const zone of ds.zones) {
    const ids = new Set(ds.services.filter((s) => s.statut === "valide" && s.zone === zone).map((s) => s.id));
    for (const m of METHOD_LIST) {
      const n = ruptures.filter((r) => r.methode === m.id && ids.has(r.serviceId)).length;
      if (n >= 2) out.push({ id: `rupture-${zone}-${m.id}`, niveau: "urgent", titre: `Rupture : ${methodLabel(m.id)} en ${zone}`, detail: `${n} services signalent une rupture récente. À traiter avec la chaîne d'approvisionnement.` });
    }
  }

  // 3. Qualité du conseil, vue des prestataires et des jeunes.
  const q = quality(ds);
  if (q.enough) {
    for (const id of ["autresMethodes", "effets"] as const) {
      const row = q.providerRows.find((r) => r.id === id);
      if (row?.pct != null && row.pct < 70) out.push({ id: `conseil-${id}`, niveau: "attention", titre: `Conseil incomplet : « ${row.label.toLowerCase()} » à ${row.pct} %`, detail: "Les prestataires déclarent le faire dans moins de 7 consultations sur 10. Renforcer la formation et les jeux de rôle." });
    }
  }
  const judge = q.youthRows.find((r) => r.id === "sansJugement");
  if (judge?.pct != null && judge.pct < 80) out.push({ id: "accueil-jeunes", niveau: "attention", titre: `Accueil sans jugement : ${judge.pct} % des jeunes seulement`, detail: "Des jeunes disent avoir été jugés. À suivre par service et par zone." });

  // 4. Demande sans offre : des questions venant d'une zone qui n'a aucun service validé.
  for (const c of coverage(ds, now)) {
    if (c.services === 0 && typeof c.demandes === "number") out.push({ id: `sans-offre-${c.zone}`, niveau: "attention", titre: `Demande sans offre en ${c.zone}`, detail: `${c.demandes} questions en 30 jours, aucun service validé dans l'annuaire.` });
  }

  // 5. Inscriptions en attente depuis trop longtemps.
  const pending = ds.services.filter((s) => s.statut === "en-attente");
  const old = pending.filter((s) => t - new Date(s.creeLe).getTime() > 7 * DAY);
  if (old.length >= 1) out.push({ id: "attente", niveau: "info", titre: `${old.length} inscription${old.length > 1 ? "s" : ""} en attente depuis plus de 7 jours`, detail: "Valider ou refuser pour que l'annuaire reste utile aux jeunes." });

  const order = { urgent: 0, attention: 1, info: 2 } as const;
  return out.sort((a, b) => order[a.niveau] - order[b.niveau]);
}

// Synthèse sans IA : quelques phrases pour la réunion. Sert aussi de secours à la synthèse par l'IA.
export function synthese(ds: Dataset, now: Date = new Date()): string[] {
  const o = overview(ds, now);
  const lines: string[] = [];
  lines.push(
    o.questions.semaine === "<5"
      ? "Peu de questions de jeunes cette semaine (moins de 5) : l'usage reste à développer."
      : `${o.questions.semaine} questions de jeunes cette semaine${o.questions.hausse != null ? ` (${o.questions.hausse >= 0 ? "+" : ""}${o.questions.hausse} % sur la semaine précédente)` : ""}.`,
  );
  const top = themeRanking(ds, now, 30)[0];
  if (top) lines.push(`Sujet le plus demandé sur 30 jours : « ${top.theme} » (${top.count}).`);
  lines.push(`${o.services.valides} services validés dans l'annuaire, dont ${o.services.accueilJeunes} déclarent accueillir les jeunes ; ${o.services.enAttente} inscriptions en attente.`);
  const q = quality(ds);
  if (q.enough) {
    const a = q.providerRows.find((r) => r.id === "autresMethodes")?.pct;
    const e = q.providerRows.find((r) => r.id === "effets")?.pct;
    lines.push(`Qualité du conseil déclarée par ${q.prestataires} prestataires : autres méthodes présentées ${a} % des fois, effets expliqués ${e} % (repère Burkina Faso 2017-18 : ${PMA_BASELINE.autresMethodes} % et ${PMA_BASELINE.effets} %).`);
  } else {
    lines.push("Pas encore assez de bilans de prestataires (au moins 3) pour afficher la qualité du conseil.");
  }
  const urgent = alerts(ds, now).filter((a) => a.niveau !== "info");
  lines.push(urgent.length ? `${urgent.length} alerte${urgent.length > 1 ? "s" : ""} à traiter : ${urgent.slice(0, 3).map((a) => a.titre).join(" ; ")}.` : "Aucune alerte prioritaire.");
  return lines;
}

// Indicateurs à plat, pour l'export. Le champ « code » est libre : à faire correspondre aux éléments de données du système d'information sanitaire du pays (par exemple DHIS2).
export type IndicatorRow = { code: string; indicateur: string; zone: string; periode: string; valeur: number | string };

export function indicatorRows(ds: Dataset, now: Date = new Date()): IndicatorRow[] {
  const periode = now.toISOString().slice(0, 10);
  const rows: IndicatorRow[] = [];
  const o = overview(ds, now);
  rows.push({ code: "ALV_QUESTIONS_7J", indicateur: "Questions de jeunes, 7 jours", zone: "Tout", periode, valeur: o.questions.semaine });
  rows.push({ code: "ALV_OUTILS_7J", indicateur: "Utilisations d'outils, 7 jours", zone: "Tout", periode, valeur: o.outils });
  rows.push({ code: "ALV_SERVICES_VALIDES", indicateur: "Services validés", zone: "Tout", periode, valeur: o.services.valides });
  rows.push({ code: "ALV_SERVICES_ACCUEIL_JEUNES", indicateur: "Services déclarant un accueil des jeunes", zone: "Tout", periode, valeur: o.services.accueilJeunes });
  const q = quality(ds);
  for (const r of q.providerRows) rows.push({ code: `ALV_PRESTATAIRE_${r.id.toUpperCase()}`, indicateur: `Prestataires : ${r.label}`, zone: "Tout", periode, valeur: r.pct ?? "<5" });
  for (const r of q.youthRows) rows.push({ code: `ALV_JEUNES_${r.id.toUpperCase()}`, indicateur: `Jeunes : ${r.label}`, zone: "Tout", periode, valeur: r.pct ?? "<5" });
  for (const c of coverage(ds, now)) {
    rows.push({ code: "ALV_ZONE_SERVICES", indicateur: "Services validés", zone: c.zone, periode, valeur: c.services });
    rows.push({ code: "ALV_ZONE_ACCUEIL_JEUNES", indicateur: "Services accueillant les jeunes", zone: c.zone, periode, valeur: c.accueilJeunes });
    for (const r of c.ruptures) rows.push({ code: `ALV_ZONE_RUPTURE_${r.methode.toUpperCase().replace(/-/g, "_")}`, indicateur: `Services en rupture : ${methodLabel(r.methode)}`, zone: c.zone, periode, valeur: r.services });
  }
  return rows;
}

export function toCsv(rows: IndicatorRow[]): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return ["code,indicateur,zone,periode,valeur", ...rows.map((r) => [r.code, r.indicateur, r.zone, r.periode, r.valeur].map(esc).join(","))].join("\n");
}
