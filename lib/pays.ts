// Configuration par pays : c'est ce qu'un ministère renseigne pour s'approprier Alviosa.
// Rien n'est inventé : tout champ à confirmer vaut null et s'affiche comme « à renseigner ».
// Pour ajouter un pays : une entrée ici, un annuaire validé, les numéros officiels, une relecture clinique nationale.

export type Pays = {
  code: string;
  nom: string;
  membrePO: boolean;
  langues: string[];
  // Découpage utilisé pour les zones (départements, régions). Vide = à renseigner.
  zones: string[];
  numeroUrgence: string | null;
  ligneEcoute: string | null;
  // Référence du protocole national de planification familiale utilisé pour relire le contenu.
  protocoleNational: string | null;
  relectureClinique: { organisme: string; date: string }[];
};

export const PAYS: Pays[] = [
  {
    code: "bj",
    nom: "Bénin",
    membrePO: true,
    langues: ["fr"],
    zones: ["Alibori", "Atacora", "Atlantique", "Borgou", "Collines", "Couffo", "Donga", "Littoral", "Mono", "Ouémé", "Plateau", "Zou"],
    numeroUrgence: null,
    ligneEcoute: null,
    protocoleNational: null,
    relectureClinique: [],
  },
  { code: "bf", nom: "Burkina Faso", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "ci", nom: "Côte d'Ivoire", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "gn", nom: "Guinée", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "ml", nom: "Mali", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "mr", nom: "Mauritanie", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "ne", nom: "Niger", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "sn", nom: "Sénégal", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
  { code: "tg", nom: "Togo", membrePO: true, langues: ["fr"], zones: [], numeroUrgence: null, ligneEcoute: null, protocoleNational: null, relectureClinique: [] },
];

export const PAYS_ACTIF = "bj";

export function getPays(code: string = PAYS_ACTIF): Pays {
  return PAYS.find((p) => p.code === code) ?? PAYS[0];
}

export function isZone(value: unknown, pays: Pays = getPays()): value is string {
  return typeof value === "string" && pays.zones.includes(value);
}

// Ce qui reste à renseigner pour qu'un pays soit « prêt » : sert à la page /all et au suivi de l'appropriation.
export function missingFor(pays: Pays): string[] {
  const missing: string[] = [];
  if (pays.zones.length === 0) missing.push("Découpage des zones");
  if (!pays.numeroUrgence) missing.push("Numéro d'urgence officiel");
  if (!pays.ligneEcoute) missing.push("Ligne d'écoute officielle");
  if (!pays.protocoleNational) missing.push("Protocole national de référence");
  if (pays.relectureClinique.length === 0) missing.push("Relecture clinique signée");
  return missing;
}
