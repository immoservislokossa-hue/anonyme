import type { Metadata } from "next";
import Chat from "@/components/Chat";
import { ASSISTANT_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: `Parler à ${ASSISTANT_NAME}` };

export default function ChatPage() {
  return (
    <>
      <header>
        <p className="eyebrow">{ASSISTANT_NAME}</p>
        <h1>Posez votre question</h1>
        <p className="lede">
          Les réponses viennent de sources validées ou relues. Ce service ne pose pas de diagnostic et ne conserve pas
          vos messages.
        </p>
      </header>
      <Chat />
    </>
  );
}
