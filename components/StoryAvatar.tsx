import Silhouette, { type Mood } from "@/components/Silhouette";
import { characterOf, speakerInfo, type Speaker } from "@/lib/stories";

// Portrait d'un personnage, ou une pastille neutre pour la narration.
export default function StoryAvatar({ who, size = 44, talking = false, mood }: { who: Speaker; size?: number; talking?: boolean; mood?: Mood }) {
  const character = characterOf(who);
  if (!character) {
    return (
      <span className="narrator-dot" style={{ width: size, height: size }} aria-label={speakerInfo(who).name}>
        ✦
      </span>
    );
  }
  return <Silhouette who={character} size={size} bust talking={talking} mood={mood} />;
}
