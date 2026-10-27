import { personaFor } from "@/lib/brand";
import type { Voie } from "@/lib/domain";

const INK = "#1e1d3a";

type Palette = { bg: string; main: string; second: string; skin: string };

const PALETTES: Record<Voie, Palette> = {
  sexuelle: { bg: "#d6f6f1", main: "#00c9b1", second: "#00a896", skin: "#8d5a3b" },
  mentale: { bg: "#dfdffa", main: "#3d3bd9", second: "#6a68ee", skin: "#e3ae86" },
  "bien-etre": { bg: "#fff0c9", main: "#ffc233", second: "#3d3bd9", skin: "#a06a47" },
};

const GOLD = "#ffc233";
const LIPS = "#b3123f";

// Visage commun : yeux avec cils, sourcils, sourire, joues, boucles d'oreilles.
function Face({ skin, smile = 1 }: { skin: string; smile?: number }) {
  return (
    <>
      <path d="M54 52 L54 64 Q60 68 66 64 L66 52 Z" fill={skin} />
      <path d="M54 56 Q60 62 66 56 L66 60 Q60 66 54 60 Z" fill={INK} opacity="0.16" />
      <ellipse cx="60" cy="38" rx="15" ry="17.5" fill={skin} />
      <ellipse cx="53" cy="33" rx="4" ry="6" fill="#fff" opacity="0.1" />
      <circle cx="47" cy="44" r="3.6" fill="#ff3d8b" opacity="0.22" />
      <circle cx="73" cy="44" r="3.6" fill="#ff3d8b" opacity="0.22" />
      <path d="M49.5 30.5 Q54 28 57.5 30.5" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M62.5 30.5 Q66 28 70.5 30.5" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="53.5" cy="37" rx="2.4" ry="2.9" fill={INK} />
      <ellipse cx="66.5" cy="37" rx="2.4" ry="2.9" fill={INK} />
      <circle cx="54.3" cy="36" r="0.9" fill="#fff" />
      <circle cx="67.3" cy="36" r="0.9" fill="#fff" />
      <path d="M50.5 35.2 L49 33.8 M69.5 35.2 L71 33.8" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M60 39 Q59 43 61 43.5" stroke={INK} strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
      <g className="sil-mouth">
        <path d={`M54 ${47} Q60 ${47 + 5 * smile} 66 47 Q60 ${48.5 + 1.5 * smile} 54 47 Z`} fill={LIPS} />
      </g>
      <circle cx="44.8" cy="43" r="2.2" fill={GOLD} />
      <circle cx="75.2" cy="43" r="2.2" fill={GOLD} />
    </>
  );
}

// Afi, la grande sœur : foulard noué, robe en tissu imprimé, main sur la hanche, l'autre main salue.
function Afi({ c }: { c: Palette }) {
  const dots: [number, number][] = [
    [50, 80],
    [68, 86],
    [44, 112],
    [60, 120],
    [78, 112],
    [38, 140],
    [54, 146],
    [72, 142],
    [86, 148],
  ];
  return (
    <g className="sil-breathe">
      <path d="M41 64 Q60 56 79 64 L74 97 Q97 124 93 158 Q60 166 27 158 Q23 124 46 97 Z" fill={c.main} />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill={GOLD} opacity="0.85" />
      ))}
      <path d="M46 97 Q60 104 74 97" stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M42 66 L32 92 L47 102" stroke={c.skin} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Face skin={c.skin} />
      <path d="M43 36 C40 10 80 10 77 36 C72 24 48 24 43 36 Z" fill="#ff3d8b" />
      <path d="M45 26 C54 18 68 18 76 28" stroke={GOLD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M72 14 L90 6 L88 22 Z" fill="#ff3d8b" />
      <path d="M72 14 L88 22 L74 24 Z" fill="#d92874" />
      <g className="sil-wave">
        <path d="M78 66 L98 44" stroke={c.skin} strokeWidth="7" strokeLinecap="round" />
        <circle cx="100" cy="41" r="5.5" fill={c.skin} />
      </g>
    </g>
  );
}

// Fallone, l'amie : longs cheveux brillants, robe fluide, tête légèrement penchée, un cœur qui bat.
function Fallone({ c }: { c: Palette }) {
  return (
    <g className="sil-breathe">
      <path d="M40 64 Q60 56 80 64 L76 98 Q100 128 96 158 Q60 166 24 158 Q20 128 44 98 Z" fill={c.main} />
      <path d="M48 64 Q60 76 72 64" stroke={c.skin} strokeWidth="3" fill="none" />
      <path d="M44 98 Q60 106 76 98" stroke={c.second} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M40 130 Q60 140 80 130" stroke={c.second} strokeWidth="2.5" fill="none" opacity="0.7" />
      <path d="M42 66 L37 102" stroke={c.skin} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M78 66 L83 102" stroke={c.skin} strokeWidth="6.5" strokeLinecap="round" />
      <g className="sil-sway">
        <path d="M43 38 C38 6 82 6 77 38 C86 56 86 84 78 98 Q70 100 68 90 L68 56 L52 56 L52 90 Q50 100 42 98 C34 84 34 56 43 38 Z" fill={INK} />
        <Face skin={c.skin} />
        <path d="M44 36 C45 14 75 14 76 36 C70 24 62 22 58 20 C54 28 50 32 44 36 Z" fill={INK} />
        <path d="M50 18 C58 12 68 14 72 22" stroke="#5a5890" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M40 60 C38 74 40 84 44 92" stroke="#5a5890" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      <path
        className="sil-heart"
        d="M96 30 C90 24 84 30 90 36 L96 42 L102 36 C108 30 102 24 96 30 Z"
        fill="#ff3d8b"
      />
    </g>
  );
}

// Chimène, la sœur : cheveux bouclés avec une fleur, bras en l'air, un soleil derrière elle.
function Chimene({ c }: { c: Palette }) {
  const rays = Array.from({ length: 10 }, (_, i) => i * 36);
  const curls: [number, number, number][] = [
    [42, 30, 8],
    [46, 20, 9],
    [56, 14, 9.5],
    [67, 14, 9.5],
    [75, 20, 9],
    [79, 30, 8],
    [60, 21, 9],
  ];
  return (
    <>
      <g className="sil-rays" stroke={c.main} strokeWidth="4" strokeLinecap="round">
        {rays.map((angle) => (
          <line key={angle} x1="60" y1="-2" x2="60" y2="8" transform={`rotate(${angle} 60 40)`} />
        ))}
      </g>
      <g className="sil-bounce">
        <path d="M43 104 L77 104 Q92 128 88 158 L66 158 L60 124 L54 158 L32 158 Q28 128 43 104 Z" fill={c.second} />
        <path d="M41 64 Q60 56 79 64 L80 100 L40 100 Z" fill={c.main} />
        <path d="M40 100 L80 100" stroke={INK} strokeWidth="1.5" opacity="0.15" />
        <path d="M42 66 L26 40" stroke={c.skin} strokeWidth="7" strokeLinecap="round" />
        <path d="M78 66 L94 40" stroke={c.skin} strokeWidth="7" strokeLinecap="round" />
        <circle cx="25" cy="38" r="5.5" fill={c.skin} />
        <circle cx="95" cy="38" r="5.5" fill={c.skin} />
        {curls.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={INK} />
        ))}
        <Face skin={c.skin} smile={1.5} />
        <path d="M45 34 C46 22 74 22 75 34 C68 28 52 28 45 34 Z" fill={INK} />
        <g transform="translate(76 14)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse key={angle} cx="0" cy="-5" rx="3.2" ry="5" fill="#ff3d8b" transform={`rotate(${angle})`} />
          ))}
          <circle r="3" fill={GOLD} />
        </g>
      </g>
    </>
  );
}

export default function Silhouette({
  voie,
  size = 96,
  bust = false,
  framed = true,
  talking = false,
}: {
  voie: Voie;
  size?: number;
  bust?: boolean;
  framed?: boolean;
  talking?: boolean;
}) {
  const c = PALETTES[voie];
  const persona = personaFor(voie);
  const viewBox = bust ? "8 0 104 100" : "0 0 120 170";
  const width = bust ? size : (size * 120) / 170;

  return (
    <svg
      className={`sil sil-${voie}${talking ? " talking" : ""}`}
      width={width}
      height={bust ? (size * 100) / 104 : size}
      viewBox={viewBox}
      role="img"
      aria-label={`${persona.name}, ${persona.role}`}
    >
      {framed && !bust && <circle cx="60" cy="92" r="66" fill={c.bg} />}
      {framed && bust && <rect x="8" y="0" width="104" height="100" fill={c.bg} />}
      {!bust && <ellipse cx="60" cy="163" rx="30" ry="4.5" fill={INK} opacity="0.12" />}
      {voie === "sexuelle" && <Afi c={c} />}
      {voie === "mentale" && <Fallone c={c} />}
      {voie === "bien-etre" && <Chimene c={c} />}
    </svg>
  );
}
