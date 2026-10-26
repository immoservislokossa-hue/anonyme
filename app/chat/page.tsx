import type { Metadata } from "next";
import Chat from "@/components/Chat";
import VoieTabs from "@/components/VoieTabs";
import Silhouette from "@/components/Silhouette";
import { personaFor } from "@/lib/brand";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: "Poser ma question" };

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;
  const persona = personaFor(current);

  return (
    <>
      <header className="persona-head">
        <Silhouette voie={current ?? "sexuelle"} size={104} />
        <div>
        <p className="eyebrow">
          {persona.name}, {persona.role}
        </p>
        <h1>Posez votre question</h1>
        <p className="lede">
          Les réponses viennent de sources validées ou relues. Ce service ne pose pas de diagnostic, ne remplace pas un
          professionnel et ne conserve pas vos messages.
        </p>
        </div>
      </header>
      <VoieTabs current={current} basePath="/chat" />
      <Chat key={current ?? "tout"} voie={current} />
    </>
  );
}
