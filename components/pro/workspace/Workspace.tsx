"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AccountPanel from "@/components/AccountPanel";
import { NO_FLAGS, type FlagId, type Flags } from "@/lib/pro/workspace";
import type { Service } from "@/lib/services";

const TOKEN_KEY = "pro-service-v1";
const FLAGS_KEY = "pro-flags-v1";
type Token = { id: string; jeton: string };
type Me = { enabled: boolean; account: { email: string; role: "prestataire" | "pilotage" } | null };

type Ctx = {
  ready: boolean;
  enabled: boolean;
  account: Me["account"];
  zones: string[];
  service: Service | null;
  active: Token | null;
  hasToken: boolean;
  flags: Flags;
  setFlag: (id: FlagId) => void;
  remember: (token: Token) => void;
  reload: () => Promise<void>;
};

const WorkspaceContext = createContext<Ctx | null>(null);

export function useWorkspace(): Ctx {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace hors de l'espace de travail");
  return ctx;
}

const NAV = [
  { href: "/prestataires/mon-service", label: "Accueil" },
  { href: "/prestataires/mon-service/fiche", label: "Ma fiche" },
  { href: "/prestataires/mon-service/stock", label: "Stock" },
  { href: "/prestataires/mon-service/visites", label: "Visites" },
  { href: "/prestataires/mon-service/carte", label: "Carte QR" },
  { href: "/prestataires/mon-service/accueil", label: "Mon accueil" },
];

const STATUS: Record<string, string> = { valide: "Validé", "en-attente": "En attente de validation", refuse: "Refusé" };

// Espace de travail d'un service : menu, état du service, et ce que la personne peut faire. Les pages sont à l'intérieur.
export default function Workspace({ zones, children }: { zones: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<Me>({ enabled: false, account: null });
  const [service, setService] = useState<Service | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [flags, setFlags] = useState<Flags>(NO_FLAGS);

  const reload = useCallback(async () => {
    const meResponse = await fetch("/api/compte").catch(() => null);
    const next = ((await meResponse?.json().catch(() => null)) as Me | null) ?? { enabled: false, account: null };
    setMe(next);
    if (next.account) {
      const response = await fetch("/api/compte/services").catch(() => null);
      const data = (await response?.json().catch(() => null)) as { services?: Service[] } | null;
      setService(data?.services?.[0] ?? null);
    } else {
      setService(null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(TOKEN_KEY) ?? "null") as Token | null;
      if (raw && typeof raw.id === "string" && typeof raw.jeton === "string") setToken(raw);
      const savedFlags = JSON.parse(window.localStorage.getItem(FLAGS_KEY) ?? "null") as Partial<Flags> | null;
      if (savedFlags) setFlags({ ...NO_FLAGS, ...savedFlags });
    } catch {
      // Rien de gardé sur cet appareil.
    }
    void reload();
  }, [reload]);

  const setFlag = useCallback((id: FlagId) => {
    setFlags((current) => {
      if (current[id]) return current;
      const next = { ...current, [id]: true };
      try {
        window.localStorage.setItem(FLAGS_KEY, JSON.stringify(next));
      } catch {
        // Le guide de démarrage ne sera pas gardé.
      }
      return next;
    });
  }, []);

  const remember = useCallback((value: Token) => {
    try {
      window.localStorage.setItem(TOKEN_KEY, JSON.stringify(value));
    } catch {
      // Stockage indisponible.
    }
    setToken(value);
  }, []);

  // Connecté : le compte gère le service, sans jeton. Sinon : le jeton gardé sur l'appareil.
  const active: Token | null = service ? { id: service.id, jeton: "" } : token;

  const ctx = useMemo<Ctx>(
    () => ({ ready, enabled: me.enabled, account: me.account, zones, service, active, hasToken: token !== null, flags, setFlag, remember, reload }),
    [ready, me, zones, service, active, token, flags, setFlag, remember, reload],
  );

  const mustLogin = ready && me.enabled && !me.account;

  return (
    <WorkspaceContext.Provider value={ctx}>
      <div className="ws">
        <aside className="ws-side" aria-label="Mon espace">
          <div className="ws-service">
            <p className="ws-service-name">{service?.nom ?? "Mon service"}</p>
            {service && <span className={`tag ws-status ws-${service.statut}`}>{STATUS[service.statut] ?? service.statut}</span>}
            {me.account && <p className="muted small">{me.account.email}</p>}
          </div>
          <nav className="ws-nav" aria-label="Sections">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="ws-main">
          {!ready ? (
            <p className="muted" role="status">Chargement…</p>
          ) : mustLogin ? (
            <div className="ws-card">
              <h1>Mon espace service</h1>
              <p className="lede">Connecte-toi pour gérer ton service : fiche, stock, visites et carte QR. C'est gratuit.</p>
              <AccountPanel audience="prestataire" onChange={() => void reload()} />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}
