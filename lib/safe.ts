import { NextResponse } from "next/server";

// Si la base de données ne répond pas, on le dit clairement (503) au lieu d'une erreur 500 sans explication.
export function guarded<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await handler(...args);
    } catch {
      return NextResponse.json({ error: "Le stockage ne répond pas pour le moment. Réessaie dans quelques minutes." }, { status: 503 });
    }
  };
}
