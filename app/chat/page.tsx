import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Chat from "@/components/Chat";
import Silhouette from "@/components/Silhouette";
import { personaFor } from "@/lib/brand";

export const metadata: Metadata = { title: "Poser ma question" };

export default function ChatPage() {
  const persona = personaFor();

  return (
    <div className="chat-page">
      <header className="chat-bar">
        <BackButton />
        <Silhouette who="afi" size={40} bust />
        <div className="chat-who">
          <strong>{persona.name}</strong>
          <span>{persona.role} · privé</span>
        </div>
        <Link href="/urgence" className="chat-urgent">
          Urgence
        </Link>
      </header>
      <Chat />
    </div>
  );
}
