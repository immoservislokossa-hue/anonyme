import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Chat from "@/components/Chat";
import Silhouette from "@/components/Silhouette";
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
        <BackButton />
        <Silhouette voie={current ?? "sexuelle"} size={40} bust />
        <div className="chat-who">
          <strong>{persona.name}</strong>
          <span>{persona.role} · privé</span>
        </div>
        <Link href="/urgence" className="chat-urgent">
          Urgence
        </Link>
      </header>
      <Chat key={current ?? "tout"} voie={current} />
    </div>
  );
}
