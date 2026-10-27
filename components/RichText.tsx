import { parseBlocks, type Inline } from "@/lib/richtext";

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, index) => (part.bold ? <strong key={index}>{part.text}</strong> : <span key={index}>{part.text}</span>))}
    </>
  );
}

// Affiche une réponse mise en forme : paragraphes, listes et mots en gras.
export default function RichText({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className="rich">
      {blocks.map((block, index) => {
        if (block.kind === "p") {
          return (
            <p key={index}>
              <Inlines parts={block.inline} />
            </p>
          );
        }
        const Tag = block.kind === "ol" ? "ol" : "ul";
        return (
          <Tag key={index}>
            {block.items.map((item, i) => (
              <li key={i}>
                <Inlines parts={item} />
              </li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
