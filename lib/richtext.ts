// Mise en forme des réponses de l'assistante : un Markdown très réduit (gras, listes, paragraphes),
// lu par notre propre code. Aucun HTML venant du modèle n'est jamais injecté dans la page.
export type Inline = { text: string; bold: boolean };
export type Block =
  | { kind: "p"; inline: Inline[] }
  | { kind: "ul"; items: Inline[][] }
  | { kind: "ol"; items: Inline[][] };

export function parseInline(text: string): Inline[] {
  const parts: Inline[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), bold: false });
    parts.push({ text: match[1], bold: true });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false });
  // Les astérisques isolés ou les # laissés par le modèle ne doivent pas s'afficher.
  return parts.map((p) => ({ ...p, text: p.text.replace(/\*+/g, "").replace(/^#{1,6}\s+/, "") })).filter((p) => p.text.length > 0);
}

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ kind: "p", inline: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ kind: list.ordered ? "ol" : "ul", items: list.items.map(parseInline) });
    list = null;
  };

  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const bullet = /^[-•*]\s+(.*)$/.exec(line);
    const number = /^\d+[.)]\s+(.*)$/.exec(line);
    if (line === "") {
      flushParagraph();
      flushList();
    } else if (bullet || number) {
      flushParagraph();
      const ordered = Boolean(number);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? number)![1]);
    } else {
      flushList();
      // Une ligne qui se termine par « : » ouvre souvent une liste : on la garde comme paragraphe à part.
      paragraph.push(line);
      if (line.endsWith(":")) flushParagraph();
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

// La dernière ligne « Choix : a | b | c » devient des boutons de réponse rapide.
export function extractChoices(text: string): { text: string; choices: string[] } {
  const lines = text.replace(/\r/g, "").split("\n");
  let index = -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].trim() === "") continue;
    if (/^\s*(choix|réponses?|options?)\s*:/i.test(lines[i])) index = i;
    break;
  }
  if (index === -1) return { text: text.trim(), choices: [] };
  const choices = lines[index]
    .replace(/^\s*[^:]+:\s*/, "")
    .split("|")
    .map((c) => c.replace(/\*+/g, "").trim())
    .filter((c) => c.length > 0 && c.length <= 60)
    .slice(0, 4);
  return { text: lines.slice(0, index).join("\n").trim(), choices };
}

// Texte sans mise en forme, pour la lecture à voix haute.
export function toPlain(text: string): string {
  return parseBlocks(text)
    .map((block) => (block.kind === "p" ? block.inline.map((i) => i.text).join("") : block.items.map((item) => item.map((i) => i.text).join("")).join(". ")))
    .join(" ");
}
