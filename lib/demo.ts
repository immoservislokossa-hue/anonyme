import type { Dataset, EventRow, BilanRow } from "@/lib/analytics";
import { COUNSELING_CHECKS, type CheckId } from "@/lib/pro/consultation";
import { METHOD_LIST, SERVICE_TYPES, type Review, type Service, type ServiceMethod, type StockSignal } from "@/lib/services";
import { getPays } from "@/lib/pays";

// Jeu de données de DÉMONSTRATION, fabriqué pour montrer le tableau de bord. Il n'est jamais enregistré et ne représente aucune réalité.
// Généré avec un tirage pseudo-aléatoire fixe : la démonstration est identique à chaque ouverture.

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
const ZONES_WITH_SERVICES = ["Mono", "Zou", "Atlantique", "Borgou", "Ouémé", "Atacora"];

export function demoDataset(now: Date = new Date()): Dataset {
  const rand = rng(20261030);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
  const t = now.getTime();
  const iso = (ms: number) => new Date(ms).toISOString();
  const zones = getPays().zones;

  // Services : 30 validés, 4 en attente (dont 2 depuis plus de 7 jours), 2 refusés.
  const services: Service[] = [];
  for (let i = 0; i < 36; i += 1) {
    const zone = ZONES_WITH_SERVICES[i % ZONES_WITH_SERVICES.length];
    const methodes = METHOD_LIST.filter(() => rand() < 0.6).map((m) => m.id) as ServiceMethod[];
    if (methodes.length === 0) methodes.push("preservatif-masculin");
    const statut: Service["statut"] = i < 30 ? "valide" : i < 34 ? "en-attente" : "refuse";
    const created = t - (statut === "en-attente" ? (i % 2 === 0 ? 10 : 2) : 40) * DAY;
    services.push({
      id: `demo-${i + 1}`,
      nom: `Service de démonstration ${i + 1}`,
      type: pick(SERVICE_TYPES).id,
      zone,
      commune: `Commune ${zone}`,
      adresse: "",
      telephone: "",
      horaires: "",
      methodes,
      accueilJeunes: rand() < 0.55,
      gratuitJeunes: "inconnu",
      confidentialite: rand() < 0.8,
      statut,
      creeLe: iso(created),
      majLe: iso(created),
    });
  }

  // Événements sur 28 jours. La semaine en cours a une hausse du thème « effets ».
  const themes: [string, number][] = [["methodes", 30], ["effets", 12], ["rumeurs", 10], ["grossesse", 14], ["ist", 12], ["urgence", 8], ["consentement", 6]];
  const events: EventRow[] = [];
  for (let d = 27; d >= 0; d -= 1) {
    const base = 8 + Math.floor(rand() * 6);
    for (let n = 0; n < base; n += 1) {
      const [theme] = pick(themes.flatMap(([name, weight]) => Array.from({ length: weight }, () => [name, weight] as [string, number])));
      const matched = rand() < 0.74;
      events.push({ kind: "question", theme, matched, entry: matched ? pick(["pilule-usage", "contraception-urgence", "idees-fausses", "effets-secondaires-courants", "preservatif-usage", "retard-regles"]) : undefined, at: iso(t - d * DAY - Math.floor(rand() * DAY)), zone: rand() < 0.3 ? pick(["Mono", "Zou", "Atlantique", "Couffo"]) : undefined });
    }
    if (d < 7) for (let n = 0; n < 4; n += 1) events.push({ kind: "question", theme: "effets", at: iso(t - d * DAY - Math.floor(rand() * DAY)) });
    for (let n = 0; n < 3; n += 1) events.push({ kind: pick(["outil-choisir", "outil-risque", "outil-visite", "outil-plan", "outil-parler"]), at: iso(t - d * DAY - Math.floor(rand() * DAY)) });
    if (rand() < 0.5) events.push({ kind: "urgence", at: iso(t - d * DAY - Math.floor(rand() * DAY)) });
  }

  // Passages par QR : six services, de quelques-uns à beaucoup.
  const withQr = services.filter((x) => x.statut === "valide").slice(0, 6);
  withQr.forEach((svc, i) => {
    const n = [34, 21, 12, 8, 3, 2][i];
    for (let k = 0; k < n; k += 1) events.push({ kind: "scan", service: svc.id, zone: svc.zone, at: iso(t - Math.floor(rand() * 28) * DAY) });
  });

  // Bons de visite : des demandes, dont environ deux sur trois sont confirmées par le service.
  withQr.slice(0, 4).forEach((svc, i) => {
    const n = [18, 11, 7, 3][i];
    for (let k = 0; k < n; k += 1) {
      const when = iso(t - Math.floor(rand() * 28) * DAY);
      events.push({ kind: "visite-demande", service: svc.id, zone: svc.zone, at: when });
      if (rand() < 0.66) events.push({ kind: "visite-venue", service: svc.id, zone: svc.zone, at: when });
    }
  });

  // Avis de jeunes sur six services : accueil correct, autres méthodes et effets peu présentés.
  const reviews: Review[] = [];
  for (const service of services.filter((s) => s.statut === "valide").slice(0, 6)) {
    for (let n = 0; n < 9; n += 1) {
      reviews.push({
        serviceId: service.id,
        at: iso(t - Math.floor(rand() * 20) * DAY),
        answers: { sansJugement: rand() < 0.74, autresMethodes: rand() < 0.58, effets: rand() < 0.49, confidentialite: rand() < 0.85, methodeObtenue: rand() < 0.7, prixClair: rand() < 0.6 },
      });
    }
  }

  // Ruptures : implants dans deux services du Mono, pilule d'urgence dans un service du Zou.
  const mono = services.filter((s) => s.zone === "Mono" && s.statut === "valide").slice(0, 2);
  const zou = services.find((s) => s.zone === "Zou" && s.statut === "valide");
  const stock: StockSignal[] = mono.map((s) => ({ serviceId: s.id, methode: "implants" as const, etat: "rupture" as const, at: iso(t - 3 * DAY) }));
  if (zou) stock.push({ serviceId: zou.id, methode: "contraception-urgence", etat: "rupture", at: iso(t - 5 * DAY) });

  // Bilans de 14 prestataires.
  const rates: Record<CheckId, number> = { accueil: 0.9, ecoute: 0.85, autresMethodes: 0.62, effets: 0.55, oubli: 0.6, retour: 0.7, confidentialite: 0.88, choix: 0.8 };
  const bilans: BilanRow[] = [];
  for (let p = 0; p < 14; p += 1) {
    const consultations = 6 + Math.floor(rand() * 20);
    const checks = {} as Record<CheckId, number>;
    for (const c of COUNSELING_CHECKS) checks[c.id] = Math.min(consultations, Math.round(consultations * (rates[c.id] + (rand() - 0.5) * 0.2)));
    bilans.push({ zone: pick(ZONES_WITH_SERVICES), consultations, checks, trainingCompleted: Math.floor(rand() * 5), trainingPct: 55 + Math.floor(rand() * 40), at: iso(t - Math.floor(rand() * 14) * DAY) });
  }

  return { demo: true, events, bilans, reviews, services, stock, zones };
}
