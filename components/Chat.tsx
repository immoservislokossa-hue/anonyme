"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Reward from "@/components/Reward";
import Speak from "@/components/Speak";
import VoiceInput from "@/components/VoiceInput";
import { useProgress } from "@/components/useProgress";
import { ASSISTANT_NAME } from "@/lib/brand";
import type { Voie } from "@/lib/domain";

type Message = {
  role: "user" | "assistant";
  content: string;
  kind?: string;
  sources?: string[];
};

const EXAMPLES: Record<Voie | "tout", string[]> = {
  tout: [
    "Comment savoir si j'ai une infection sexuellement transmissible ?",
    "Je me sens stressé(e) en permanence, que faire ?",
    "Comment mieux dormir ?",
  ],
  sexuelle: [
    "Quels sont les effets secondaires fréquents de la pilule ?",
    "Un préservatif a craqué, que faire ?",
    "C'est quoi le consentement ?",
  ],
  mentale: [
    "Comment parler à quelqu'un de ce que je ressens ?",
    "Je me sens triste depuis plusieurs semaines",
    "J'ai honte après ce qui s'est passé",
  ],
  "bien-etre": [
    "Comment mieux dormir ?",
    "Comment gérer le stress avant un examen ?",
    "Comment reprendre confiance en moi ?",
  ],
};

export default function Chat({ voie }: { voie?: Voie }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const { update } = useProgress();
  const endRef = useRef<HTMLDivElement | null>(null);
  const clearReward = useCallback(() => setReward(null), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voie,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (response.status === 429) {
        throw new Error("Trop de questions en peu de temps. Réessayez dans une minute.");
      }

      const data = (await response.json()) as {
        reply?: string;
        kind?: string;
        sources?: string[];
        error?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Le service n'a pas répondu.");
      }

      setMessages([...next, { role: "assistant", content: data.reply, kind: data.kind, sources: data.sources }]);

      if (data.kind !== "urgent" && data.kind !== "crisis") {
        update((current) => ({ ...current, questionsAsked: current.questionsAsked + 1 }));
        setReward("+10 points. Bonne question");
      }
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message.startsWith("Trop")
          ? caught.message
          : "Le service ne répond pas pour le moment. Si votre question est urgente, allez au centre de santé le plus proche.",
      );
    } finally {
      setLoading(false);
    }
  }

  const examples = EXAMPLES[voie ?? "tout"];

  return (
    <section aria-label="Conversation">
      <div className="chat-log" aria-live="polite">
        {messages.length === 0 && (
          <div className="panel">
            <p>
              Bonjour, je suis {ASSISTANT_NAME}. Vous pouvez écrire ou dicter votre question avec vos propres mots.
              Voici trois idées pour commencer :
            </p>
            <div className="stack" style={{ marginTop: 12 }}>
              {examples.map((example) => (
                <button key={example} type="button" className="btn ghost left" onClick={() => send(example)} disabled={loading}>
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const isAlert = message.kind === "urgent" || message.kind === "crisis";
          const isBot = message.role === "assistant";
          return (
            <div key={index} className={`bubble ${isBot ? "bot" : "user"}${isAlert ? " urgent" : ""}`}>
              {message.content}
              {isBot && message.sources && message.sources.length > 0 && (
                <div className="sources">Sources : {message.sources.join(" ; ")}</div>
              )}
              {isBot && (
                <div className="row" style={{ marginTop: 10 }}>
                  <Speak text={message.content} label="Écouter la réponse" />
                  <Link className="btn ghost small" href={isAlert ? "/urgence" : "/orientation"}>
                    {isAlert ? "Que faire maintenant" : "Trouver un centre"}
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {loading && <p className="muted">{ASSISTANT_NAME} prépare une réponse…</p>}
        {error && <p className="urgent">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="question" className="sr-only">
          Votre question
        </label>
        <textarea
          id="question"
          value={input}
          maxLength={1000}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Écrivez votre question ici"
          rows={2}
        />
        <VoiceInput onText={(text) => setInput((current) => `${current} ${text}`.trim())} />
        <button className="btn indigo" type="submit" disabled={loading || input.trim().length === 0}>
          Envoyer
        </button>
      </form>

      <Reward message={reward} onDone={clearReward} />
    </section>
  );
}
