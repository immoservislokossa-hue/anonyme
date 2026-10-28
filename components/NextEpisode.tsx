import Link from "next/link";
import { SEASON, nextEpisode, type Story } from "@/lib/stories";

// Fin d'épisode : le teaser donne envie de voir la suite, ou la saison se termine.
export default function NextEpisode({ story }: { story: Story }) {
  const next = nextEpisode(story);
  return (
    <aside className="next-episode panel" aria-label="Épisode suivant">
      <p className="eyebrow">{next ? "La suite" : `Fin de la saison ${SEASON}`}</p>
      <p className="teaser">{story.teaser}</p>
      {next ? (
        <Link className="btn indigo" href={`/histoires/${next.id}`}>
          Épisode {next.episode} · {next.titre}
        </Link>
      ) : (
        <Link className="btn indigo" href="/chat">
          Poser une question
        </Link>
      )}
    </aside>
  );
}
