import structuresData from "@/data/structures.json";

export type Structure = {
  id: string;
  nom: string;
  commune: string;
  type: string;
  horaires: string;
  contact: string;
  services: string[];
  verifie: boolean;
  dateVerification: string | null;
};

export const structures: Structure[] = structuresData;

// Ne renvoie que les structures de la commune demandée. Sans commune, renvoie toutes les structures.
export function findStructures(commune?: string): Structure[] {
  const query = commune?.trim().toLowerCase();
  if (!query) return structures;
  return structures.filter((s) => s.commune.toLowerCase().includes(query));
}
