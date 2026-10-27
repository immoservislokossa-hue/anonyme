// Autres façons de parler à Alviosa : WhatsApp, Messenger, téléphone.
// Tant qu'un canal n'est pas configuré, le bouton s'affiche avec « Bientôt » et ne mène nulle part.
export type ChannelId = "whatsapp" | "messenger" | "phone";

export type ChannelConfig = { whatsapp?: string; messenger?: string; phone?: string };

export type Channel = { id: ChannelId; label: string; href: string | null };

const digits = (value: string) => value.replace(/\D/g, "");

export function channelsFrom(config: ChannelConfig): Channel[] {
  const whatsapp = config.whatsapp ? digits(config.whatsapp) : "";
  const messenger = config.messenger?.trim().replace(/[^A-Za-z0-9._-]/g, "") ?? "";
  const phone = config.phone ? config.phone.replace(/[^\d+]/g, "") : "";

  return [
    { id: "whatsapp", label: "Discuter sur WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Bonjour")}` : null },
    { id: "messenger", label: "Discuter sur Messenger", href: messenger ? `https://m.me/${messenger}` : null },
    { id: "phone", label: "Appeler", href: phone ? `tel:${phone}` : null },
  ];
}
