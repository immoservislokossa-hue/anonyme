"use client";

import Speak from "@/components/Speak";

// « Écouter l'essentiel » : la page lue à voix haute, pour ceux qui n'ont pas le temps ou pas envie de lire.
export default function ListenButton({ text }: { text: string }) {
  return <Speak text={text} label="Écouter l'essentiel" />;
}
