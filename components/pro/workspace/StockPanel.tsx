"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";
import { METHOD_LIST, methodLabel, type ServiceMethod, type StockSignal } from "@/lib/services";

// Stock : une ligne par méthode, un clic pour dire « disponible » ou « en rupture ».
export default function StockPanel() {
  const { service, active, setFlag } = useWorkspace();
  const [state, setState] = useState<Record<string, "disponible" | "rupture">>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/compte/stock").catch(() => null);
    const data = (await response?.json().catch(() => null)) as { stock?: StockSignal[] } | null;
    const next: Record<string, "disponible" | "rupture"> = {};
    for (const s of data?.stock ?? []) next[s.methode] = s.etat;
    setState(next);
  }, []);

  useEffect(() => {
    if (service) void load();
  }, [service, load]);

  async function signal(methode: ServiceMethod, etat: "disponible" | "rupture") {
    if (!active) return;
    setBusy(methode);
    setNotice("");
    const response = await fetch("/api/stock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: active.id, jeton: active.jeton, methode, etat }) }).catch(() => null);
    setBusy(null);
    if (response?.status === 204) {
      setState((s) => ({ ...s, [methode]: etat }));
      setFlag("stock");
      setNotice(`${methodLabel(methode)} : ${etat === "rupture" ? "en rupture" : "disponible"}. Merci.`);
    } else {
      setNotice("Le signal n'est pas passé. Vérifie que tu es connecté, puis réessaie.");
    }
  }

  if (!active) return <Empty />;
  const offered = service ? METHOD_LIST.filter((m) => service.methodes.includes(m.id)) : METHOD_LIST;

  return (
    <>
      <header className="ws-head">
        <h1>Stock</h1>
        <p className="lede">Dis ce qui est disponible aujourd'hui. Les jeunes voient les ruptures et ne se déplacent pas pour rien.</p>
      </header>
      <section className="ws-card" aria-label="Stock par méthode">
        <ul className="ws-rows">
          {offered.map((m) => (
            <li key={m.id}>
              <div>
                <strong>{m.label}</strong>
                {state[m.id] && <span className={`tag ws-${state[m.id]}`}>{state[m.id] === "rupture" ? "En rupture" : "Disponible"}</span>}
              </div>
              <div className="ws-seg" role="group" aria-label={`État de ${m.label}`}>
                <button type="button" className={state[m.id] === "disponible" ? "on" : undefined} aria-pressed={state[m.id] === "disponible"} disabled={busy === m.id} onClick={() => signal(m.id, "disponible")}>
                  Disponible
                </button>
                <button type="button" className={state[m.id] === "rupture" ? "on alert" : undefined} aria-pressed={state[m.id] === "rupture"} disabled={busy === m.id} onClick={() => signal(m.id, "rupture")}>
                  Rupture
                </button>
              </div>
            </li>
          ))}
        </ul>
        {notice && <p className="notice" role="status">{notice}</p>}
      </section>
    </>
  );
}

function Empty() {
  return (
    <section className="ws-card">
      <h1>Stock</h1>
      <p className="lede">Inscris d'abord ton service pour signaler ton stock.</p>
      <a className="btn primary" href="/prestataires/mon-service/fiche">
        Remplir ma fiche
      </a>
    </section>
  );
}
