"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import Silhouette from "@/components/Silhouette";
import RichText from "@/components/RichText";
import Speak from "@/components/Speak";
import VoiceInput from "@/components/VoiceInput";
import { personaFor } from "@/lib/brand";
import { localReply } from "@/lib/localReply";
import { readZone } from "@/lib/zone";
import { extractChoices, toPlain } from "@/lib/richtext";

type Message = {
  role: "user" | "assistant";
  content: string;
  kind?: string;
  sources?: string[];
  choices?: string[];
};

const EXAMPLES = [
  "Quelle méthode de contraception choisir ?",
  "Un préservatif a craqué, que faire ?",
  "J'ai un retard de règles, que faire ?",
  "Comment me protéger des IST ?",
];

export type AutoMessage = { id: number; text: string };

// Chat d'Afi. `embedded` : dans la bulle, sur toutes les pages. `tips` et `context` : adaptés à la page où l'on est.
export default function Chat({
  audience = "jeune",
  embedded = false,
  tips,
  context,
  greeting,
  auto,
}: {
  audience?: "jeune" | "prestataire";
  embedded?: boolean;
  tips?: string[];
  context?: string;
  greeting?: string;
  auto?: AutoMessage | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  // La zone de saisie grandit avec le texte, jusqu'à une hauteur limite.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${Math.min(area.scrollHeight, 140)}px`;
  }, [input]);

  const lastAuto = useRef<number | null>(null);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    // Sans réseau, Afi répond sur l'appareil : mêmes règles de sécurité, fiche la plus proche.
    const answerOffline = () => {
      const local = localReply(question, context, audience);
      const note = local.kind === "fallback" ? "**Mode sans connexion** : voici la fiche la plus proche de ta question.\n\n" : "";
      setMessages([...next, { role: "assistant", content: note + local.reply, kind: local.kind, sources: local.sources }]);
    };

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      answerOffline();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          context,
          zone: readZone() ?? undefined,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (response.status === 429) {
        throw new Error("Trop de questions en peu de temps. Réessaie dans une minute.");
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

      const { text: cleaned, choices } = extractChoices(data.reply);
      setMessages([...next, { role: "assistant", content: cleaned, kind: data.kind, sources: data.sources, choices }]);
    } catch (caught) {
      if (caught instanceof TypeError) {
        // Le réseau a lâché : on répond sur l'appareil plutôt que de laisser la personne sans réponse.
        answerOffline();
        return;
      }
      setError(
        caught instanceof Error && caught.message.startsWith("Trop")
          ? caught.message
          : "Le service ne répond pas pour le moment. Si ta question est urgente, va au centre de santé le plus proche.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auto || auto.id === lastAuto.current) return;
    lastAuto.current = auto.id;
    void send(auto.text);
    // send dépend de l'état courant : on ne relance que pour un nouveau message automatique.
  }, [auto]);

  const examples = tips && tips.length > 0 ? tips : EXAMPLES;
  const persona = personaFor();
  const pro = audience === "prestataire";
  // Pour les prestataires : un repère neutre à la place du visage d'Afi.
  const avatar = pro ? <span className="avatar pro-avatar" aria-hidden="true">OMS</span> : null;

  return (
    <section aria-label="Conversation" className={`chat${embedded ? " embedded" : ""}`}>
      <div className="chat-log" aria-live="polite">
        {messages.length === 0 && (
          <div className="msg bot">
            {avatar ?? (
              <span className="avatar">
                <Silhouette who="afi" size={38} bust />
              </span>
            )}
            <div className="intro">
              <p>
                {greeting ?? (
                  <>
                    {pro ? (
                      <>
                        Assistant d'Alviosa pour les prestataires, fondé sur le guide de l'OMS. Pose ta question : je réponds court, avec les points à vérifier et quand orienter.
                      </>
                    ) : (
                      <>
                        Bonjour, je suis <strong>{persona.name}</strong>, {persona.role}. Pose ta question avec tes mots, ou choisis une idée :
                      </>
                    )}
                  </>
                )}
              </p>
              <div className="examples">
                {examples.map((example) => (
                  <button key={example} type="button" className="example" onClick={() => send(example)} disabled={loading}>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const isAlert = message.kind === "urgent" || message.kind === "crisis";

          if (message.role === "user") {
            return (
              <div key={index} className="msg user">
                <div className="bubble user">{message.content}</div>
              </div>
            );
          }

          return (
            <div key={index} className="msg bot">
              {avatar ?? (
                <span className="avatar">
                  <Silhouette who="afi" size={38} bust />
                </span>
              )}
              <div className="col">
                <div className={`bubble bot${isAlert ? " urgent" : ""}`}>
                  <RichText text={message.content} />
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="sources">Sources : {message.sources.join(" ; ")}</div>
                )}
                {index === messages.length - 1 && message.choices && message.choices.length > 0 && !loading && (
                  <div className="quick-replies" role="group" aria-label="Réponses rapides">
                    {message.choices.map((choice) => (
                      <button key={choice} type="button" className="example" onClick={() => send(choice)}>
                        {choice}
                      </button>
                    ))}
                  </div>
                )}
                <div className="chips">
                  <Speak text={toPlain(message.content)} label="Écouter" />
                  <Link className="chip-btn" href={isAlert ? "/urgence" : "/orientation"}>
                    <Icon name={isAlert ? "alert" : "pin"} size={18} />
                    {isAlert ? "Que faire maintenant" : "Trouver un centre"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="msg bot">
            {avatar ?? (
              <span className="avatar">
                <Silhouette who="afi" size={38} bust />
              </span>
            )}
            <div className="typing-bubble" role="status">
              <span className="sr-only">{persona.name} prépare une réponse</span>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </div>
          </div>
        )}
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
          Ta question
        </label>
        <textarea
          id="question"
          ref={areaRef}
          value={input}
          maxLength={1000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(input);
            }
          }}
          placeholder="Écris ta question"
          rows={1}
        />
        <VoiceInput onText={(text) => setInput((current) => `${current} ${text}`.trim())} />
        <button className="icon-btn primary" type="submit" aria-label="Envoyer" disabled={loading || input.trim().length === 0}>
          <Icon name="send" size={20} />
        </button>
      </form>

    </section>
  );
}
