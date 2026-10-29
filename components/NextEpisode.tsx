import Link from "next/link";
import AskAfi from "@/components/AskAfi";
import { SEASON, nextEpisode, type Story } from "@/lib/stories";

// Fin d'épisode : le teaser donne envie de voir la suite, ou la saison se termine.
export default function NextEpisode({ story }: { story: Story }) {
  const next = nextEpisode(story);
  return (
    <aside className="next-episode panel" aria-label="Épisode suivant">
      <p className="eyebrow">{next ? "La suite" : `Fin de la saison ${SEASON}`}</p>
      <p className="teaser">{story.teaser}</p>
      {next ? (
        <Link className="btn primary" href={`/histoires/${next.id}`}>
          Épisode {next.episode} · {next.titre}
        </Link>
      ) : (
        <AskAfi className="btn primary">Poser une question à Afi</AskAfi>
      )}
    </aside>
  );
}
