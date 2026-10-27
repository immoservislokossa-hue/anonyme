import Silhouette from "@/components/Silhouette";
import { speakerInfo, voieOf, type Speaker } from "@/lib/stories";

// Portrait d'un personnage, ou une pastille neutre pour la narration.
export default function StoryAvatar({ who, size = 44, talking = false }: { who: Speaker; size?: number; talking?: boolean }) {
  const voie = voieOf(who);
  if (!voie) {
    return (
      <span className="narrator-dot" style={{ width: size, height: size }} aria-label={speakerInfo(who).name}>
        ✦
      </span>
    );
  }
  return <Silhouette voie={voie} size={size} bust talking={talking} />;
}
