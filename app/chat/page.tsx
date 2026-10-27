import type { Metadata } from "next";
import Link from "next/link";
import Chat from "@/components/Chat";
import Silhouette from "@/components/Silhouette";
import VoieTabs from "@/components/VoieTabs";
import { personaFor } from "@/lib/brand";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: "Poser ma question" };

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;
  const persona = personaFor(current);

  return (
    <div className="chat-page">
      <header className="chat-bar">
        <Link href="/" className="back" aria-label="Retour à l'accueil">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </Link>
        <Silhouette voie={current ?? "sexuelle"} size={40} bust />
        <div className="chat-who">
          <strong>{persona.name}</strong>
          <span>{persona.role} · conversation privée</span>
        </div>
        <Link href="/urgence" className="chat-urgent">
          Urgence
        </Link>
      </header>
      <VoieTabs current={current} basePath="/chat" />
      <Chat key={current ?? "tout"} voie={current} />
    </div>
  );
}
