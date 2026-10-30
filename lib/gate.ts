import { cookies } from "next/headers";
import { accountsEnabled } from "@/lib/account";
import { currentAccount } from "@/lib/accountSession";

// L'espace Prestataires demande un compte. Tant que les comptes ne sont pas activés sur le site (pas de clé Supabase), il reste ouvert : on ne bloque personne.
export async function providerAllowed(): Promise<boolean> {
  // Lire les cookies rend la page dynamique : l'état de connexion est vérifié à chaque visite, pas figé à la construction du site.
  await cookies();
  if (!accountsEnabled()) return true;
  return (await currentAccount()) !== null;
}
