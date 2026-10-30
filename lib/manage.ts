import { safeEqual } from "@/lib/auth";
import { currentAccount } from "@/lib/accountSession";
import { storedHash, storedOwner } from "@/lib/directory";
import { hashToken } from "@/lib/tokens";

// Qui peut gérer un service : la personne connectée qui l'a inscrit, ou celle qui a le jeton de gestion (ancien accès).
export async function mayManage(serviceId: string, jeton?: unknown): Promise<boolean> {
  if (typeof jeton === "string" && jeton) {
    const hash = await storedHash(serviceId);
    if (hash && safeEqual(hashToken(jeton), hash)) return true;
  }
  const account = await currentAccount();
  if (!account) return false;
  return (await storedOwner(serviceId)) === account.id;
}
