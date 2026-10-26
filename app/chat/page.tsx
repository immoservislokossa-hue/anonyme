import type { Metadata } from "next";
import Chat from "@/components/Chat";
import VoieTabs from "@/components/VoieTabs";
import { ASSISTANT_NAME } from "@/lib/brand";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: `Parler à ${ASSISTANT_NAME}` };

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;

  return (
    <>
      <header>
        <p className="eyebrow">{ASSISTANT_NAME}</p>
        <h1>Posez votre question</h1>
        <p className="lede">
          Les réponses viennent de sources validées ou relues. Ce service ne pose pas de diagnostic, ne remplace pas un
          professionnel et ne conserve pas vos messages.
        </p>
      </header>
      <VoieTabs current={current} basePath="/chat" />
      <Chat key={current ?? "tout"} voie={current} />
    </>
  );
}
