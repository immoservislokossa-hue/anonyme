import { cookies } from "next/headers";
import { ACCOUNT_COOKIE, accountFromToken, accountsEnabled, type Account } from "@/lib/account";

// Le compte de la personne connectée (cookie HttpOnly), ou null.
export async function currentAccount(): Promise<Account | null> {
  if (!accountsEnabled()) return null;
  const token = (await cookies()).get(ACCOUNT_COOKIE)?.value;
  if (!token) return null;
  try {
    return await accountFromToken(token);
  } catch {
    return null;
  }
}
