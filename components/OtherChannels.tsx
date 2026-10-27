"use client";

import Link from "next/link";
import { useState } from "react";
import { channelsFrom, type ChannelId } from "@/lib/channels";

// Les valeurs viennent de variables NEXT_PUBLIC_* : numéro WhatsApp, page Messenger, numéro à appeler.
const channels = channelsFrom({
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  messenger: process.env.NEXT_PUBLIC_MESSENGER_PAGE,
  phone: process.env.NEXT_PUBLIC_CALL_NUMBER,
});

function Glyph({ id }: { id: ChannelId }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (id === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }
  if (id === "messenger") {
    return (
      <svg {...common}>
        <path d="M12 3C6.8 3 3 6.8 3 11.6c0 2.6 1.2 4.9 3.1 6.4V21l2.9-1.6c.9.2 1.9.4 3 .4 5.2 0 9-3.8 9-8.6S17.2 3 12 3Z" />
        <path d="m7.5 13.2 3-3.3 2.2 2 3.3-2.9" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3.5 20.5 5 16A8.5 8.5 0 1 1 8 19Z" />
      <path d="M9 9.5c.3 2.4 2.6 4.6 5 5l1.4-1.2-1.6-1.1-.8.6a4 4 0 0 1-1.6-1.6l.6-.8-1.1-1.6Z" />
    </svg>
  );
}

// Boutons pour parler autrement que sur le site. Sans configuration, un clic explique que c'est pour bientôt.
export default function OtherChannels() {
  const [soon, setSoon] = useState<string | null>(null);

  return (
    <section aria-label="Autres façons de nous parler" className="channels">
      <h2>Tu préfères parler autrement ?</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            {channel.href ? (
              <a className={`channel ${channel.id}`} href={channel.href} target={channel.id === "phone" ? undefined : "_blank"} rel="noopener noreferrer">
                <Glyph id={channel.id} />
                <span>{channel.label}</span>
              </a>
            ) : (
              <button type="button" className={`channel ${channel.id} soon`} onClick={() => setSoon(channel.label)} aria-describedby="channel-soon">
                <Glyph id={channel.id} />
                <span>{channel.label}</span>
                <em>Bientôt</em>
              </button>
            )}
          </li>
        ))}
      </ul>
      {soon && (
        <p id="channel-soon" className="channel-note" role="status">
          « {soon} » arrive bientôt. En attendant, <Link href="/chat?voie=sexuelle">pose ta question ici</Link>.
        </p>
      )}
    </section>
  );
}
