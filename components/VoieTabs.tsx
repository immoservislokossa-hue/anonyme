import Link from "next/link";
import { VOIES, type Voie } from "@/lib/domain";

// Choix du sujet : « Tout » ou l'une des trois voies. Fonctionne sans JavaScript (simples liens).
export default function VoieTabs({ current, basePath }: { current?: Voie; basePath: string }) {
  const tabs: { id?: Voie; label: string }[] = [{ label: "Tout" }, ...VOIES];

  return (
    <nav className="tabs" aria-label="Choisir un sujet">
      {tabs.map((tab) => (
        <Link
          key={tab.id ?? "tout"}
          href={tab.id ? `${basePath}?voie=${tab.id}` : basePath}
          aria-current={tab.id === current ? "page" : undefined}
          className={`tab${tab.id === current ? " active" : ""}${tab.id ? ` tone-${tab.id}` : ""}`}
        >
          {tab.id && <span className="dot" aria-hidden="true" />}
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
