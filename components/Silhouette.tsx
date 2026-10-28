import type { ReactNode } from "react";
import { personaFor } from "@/lib/brand";
import type { Voie } from "@/lib/domain";

const INK = "#1e1d3a";
const GOLD = "#ffc233";
const EYE_DARK = "#2b1a1a";

export type Mood = "neutre" | "joie" | "triste" | "peur" | "surpris" | "colere" | "pensif" | "gene";

type Palette = {
  bg: string;
  main: string;
  mainDark: string;
  second: string;
  secondDark: string;
  skin: string;
  skinDark: string;
  hair: string;
  hairLight: string;
  lip: string;
  blush: string;
};

// Dessin 2D tout simple : aplats de couleur, une seule ombre par pièce, grands yeux brillants.
const PALETTES: Record<Voie, Palette> = {
  sexuelle: {
    bg: "#d6f6f1",
    main: "#00c4ac",
    mainDark: "#00a08c",
    second: "#00a896",
    secondDark: "#008777",
    skin: "#a2673f",
    skinDark: "#8a5433",
    hair: "#2a1c24",
    hairLight: "#5b4150",
    lip: "#d9487a",
    blush: "#ff6b8e",
  },
  mentale: {
    bg: "#dfdffa",
    main: "#5a58e6",
    mainDark: "#4240c2",
    second: "#7a78f0",
    secondDark: "#5f5dd0",
    skin: "#f3c9a5",
    skinDark: "#e3b08a",
    hair: "#241a2e",
    hairLight: "#5d4b78",
    lip: "#e0587f",
    blush: "#ff7a9a",
  },
  "bien-etre": {
    bg: "#fff0c9",
    main: "#ffc233",
    mainDark: "#e8a712",
    second: "#4a48e0",
    secondDark: "#3634b8",
    skin: "#b07650",
    skinDark: "#9a6440",
    hair: "#2a1c24",
    hairLight: "#5b4150",
    lip: "#d9487a",
    blush: "#ff6b8e",
  },
};

type EyeKind = "ovale" | "heureux" | "ronds" | "plisses";

// Yeux, sourcils et bouche selon l'humeur.
function features(mood: Mood | undefined, c: Palette, smile: number) {
  let brows = { left: "M47 29.4 Q51.5 27 56 28.8", right: "M64 28.8 Q68.5 27 73 29.4" };
  let mouth: ReactNode = (
    <path d={`M55.4 50 Q60 ${52.6 + smile} 64.6 50`} stroke={c.lip} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  );
  let eyes: EyeKind = "ovale";
  let gx = 0;
  let gy = 0;
  let tear = false;
  let sweat = false;
  let blush = 0.4;

  switch (mood) {
    case "joie":
      brows = { left: "M47 28 Q51.5 25.4 56 27.4", right: "M64 27.4 Q68.5 25.4 73 28" };
      mouth = (
        <>
          <path d="M54.4 48.6 Q60 57.4 65.6 48.6 Q60 50.4 54.4 48.6 Z" fill="#6a1c3a" />
          <path d="M55.6 49.2 Q60 51.2 64.4 49.2 L63.8 50.8 Q60 52.2 56.2 50.8 Z" fill="#fff" />
          <ellipse cx="60" cy="52.8" rx="2.3" ry="1.1" fill="#ff7a9a" />
        </>
      );
      eyes = "heureux";
      blush = 0.65;
      break;
    case "triste":
      brows = { left: "M47 30.6 Q51.5 29.6 56 26.4", right: "M64 26.4 Q68.5 29.6 73 30.6" };
      mouth = <path d="M55.6 53 Q60 49.4 64.4 53" stroke={c.lip} strokeWidth="2.2" fill="none" strokeLinecap="round" />;
      gy = 0.9;
      tear = true;
      blush = 0.25;
      break;
    case "peur":
      brows = { left: "M47 28.4 Q51.5 24.6 56 26", right: "M64 26 Q68.5 24.6 73 28.4" };
      mouth = <ellipse cx="60" cy="52.4" rx="2.6" ry="3.2" fill="#6a1c3a" />;
      eyes = "ronds";
      sweat = true;
      blush = 0.15;
      break;
    case "surpris":
      brows = { left: "M47 26.4 Q51.5 22.8 56 25.6", right: "M64 25.6 Q68.5 22.8 73 26.4" };
      mouth = <ellipse cx="60" cy="52.6" rx="2.3" ry="3" fill="#6a1c3a" />;
      eyes = "ronds";
      break;
    case "colere":
      brows = { left: "M46.6 27.4 L56.2 30.4", right: "M63.8 30.4 L73.4 27.4" };
      mouth = <path d="M55.6 52.6 Q60 50.2 64.4 52.6" stroke={c.lip} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
      eyes = "plisses";
      break;
    case "pensif":
      brows = { left: "M47 29.2 Q51.5 27.6 56 29", right: "M64 26.6 Q68.5 24 73 27.2" };
      mouth = <path d="M56 52 Q59.6 52.6 64.4 50.6" stroke={c.lip} strokeWidth="2.1" fill="none" strokeLinecap="round" />;
      gx = 0.9;
      gy = -0.8;
      break;
    case "gene":
      brows = { left: "M47 29.4 Q51.5 27 56 30", right: "M64 30 Q68.5 27 73 29.4" };
      mouth = <path d="M55.6 51.6 Q57.6 53.2 59.8 51.6 Q62 50.2 64.6 51.8" stroke={c.lip} strokeWidth="2" fill="none" strokeLinecap="round" />;
      gx = -0.9;
      gy = 0.6;
      sweat = true;
      blush = 0.75;
      break;
    default:
      break;
  }
  return { brows, mouth, eyes, gx, gy, tear, sweat, blush };
}

// Un œil, dessiné pour la gauche. L'œil droit est son miroir.
function Eye({ kind, gx, gy, right }: { kind: EyeKind; gx: number; gy: number; right: boolean }) {
  const dx = right ? -gx : gx;
  return (
    <g transform={right ? "translate(120 0) scale(-1 1)" : undefined}>
      {kind === "heureux" ? (
        <path d="M47.6 39.4 Q52 33.2 56.4 39.4" stroke={EYE_DARK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse
            cx={52 + dx}
            cy={38.4 + gy}
            rx={kind === "ronds" ? 4.1 : 3.7}
            ry={kind === "ronds" ? 5.2 : kind === "plisses" ? 3.6 : 4.8}
            fill={EYE_DARK}
          />
          <ellipse cx={52 + dx} cy={40.6 + gy} rx="2.7" ry="2" fill="#7b4a30" opacity="0.55" />
          <circle cx={50.6 + dx} cy={36.4 + gy} r="1.5" fill="#fff" />
          <circle cx={53.4 + dx} cy={40.4 + gy} r="0.7" fill="#fff" />
          <path d="M47.9 36.6 Q52 33.2 56.1 36.4" stroke={EYE_DARK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M48.2 36.4 L46.6 35.2" stroke={EYE_DARK} strokeWidth="1.1" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

// Visage rond et doux : grands yeux brillants, petit nez, joues roses.
function Face({ c, smile = 1, mood }: { c: Palette; smile?: number; mood?: Mood }) {
  const f = features(mood, c, smile);
  return (
    <>
      <rect x="54" y="50" width="12" height="16" rx="5" fill={c.skin} />
      <path d="M53 56 Q60 62 67 56 L67 60 Q60 66 53 60 Z" fill={c.skinDark} opacity="0.55" />
      <ellipse cx="43.4" cy="40" rx="2.8" ry="3.8" fill={c.skin} />
      <ellipse cx="76.6" cy="40" rx="2.8" ry="3.8" fill={c.skin} />
      <path d="M43 36 C43 22 50 15 60 15 C70 15 77 22 77 36 C77 48 70 56 60 56 C50 56 43 48 43 36 Z" fill={c.skin} />
      <ellipse cx="48.6" cy="46.2" rx="4.6" ry="2.8" fill={c.blush} opacity={f.blush} />
      <ellipse cx="71.4" cy="46.2" rx="4.6" ry="2.8" fill={c.blush} opacity={f.blush} />
      <path d={f.brows.left} stroke={c.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={f.brows.right} stroke={c.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <g className="sil-eyes">
        <Eye kind={f.eyes} gx={f.gx} gy={f.gy} right={false} />
        <Eye kind={f.eyes} gx={f.gx} gy={f.gy} right />
      </g>
      <path d="M59 44.4 Q60 45.6 61 44.4" stroke={c.skinDark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {f.tear && <path className="sil-tear" d="M48.6 43.6 Q46.8 47.2 48.6 48.8 Q50.4 47.2 48.6 43.6 Z" fill="#8fd0ff" />}
      {f.sweat && <path d="M75 27 Q72.8 31.4 75 33 Q77.2 31.4 75 27 Z" fill="#8fd0ff" />}
      <g className="sil-mouth">{f.mouth}</g>
      <circle cx="43.4" cy="44" r="1.5" fill={GOLD} />
      <circle cx="76.6" cy="44" r="1.5" fill={GOLD} />
    </>
  );
}

function Arm({ d, c, w = 6.4 }: { d: string; c: Palette; w?: number }) {
  return <path d={d} stroke={c.skin} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

function Hand({ x, y, c }: { x: number; y: number; c: Palette }) {
  return <circle cx={x} cy={y} r="4" fill={c.skin} />;
}

// Afi, la grande sœur : foulard rose noué, robe en tissu imprimé, une main sur la hanche. Elle fait des gestes quand elle parle.
function Afi({ c, mood }: { c: Palette; mood?: Mood }) {
  const dots: [number, number][] = [
    [50, 86],
    [68, 92],
    [44, 116],
    [60, 124],
    [76, 116],
    [40, 144],
    [54, 150],
    [70, 146],
    [82, 150],
  ];
  return (
    <g className="sil-breathe">
      <ellipse cx="50" cy="161" rx="7" ry="3" fill="#2a2150" />
      <ellipse cx="70" cy="161" rx="7" ry="3" fill="#2a2150" />
      <path d="M42 70 Q60 63 78 70 L75 98 Q90 124 87 158 Q60 164 33 158 Q30 124 45 98 Z" fill={c.main} />
      <path d="M60 104 Q74 122 78 156 Q88 154 87 158 Q60 164 60 164 Z" fill={c.mainDark} opacity="0.45" />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={GOLD} />
      ))}
      <path d="M46 99 Q60 107 74 99" stroke={GOLD} strokeWidth="4.4" fill="none" strokeLinecap="round" />
      <path d="M49 69 Q60 79 71 69 Q60 73 49 69 Z" fill={c.skin} />
      <Arm d="M42.5 72 Q30 86 44 101" c={c} />
      <Hand x={45} y={101} c={c} />
      <g transform="translate(0 4)">
      <Face c={c} mood={mood} />
      <path d="M41.5 34 C37 3 83 3 78.5 34 C74 21 46 21 41.5 34 Z" fill="#ff4f95" />
      <path d="M52 15 Q60 10 70 15" stroke="#ff8fbd" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M43 25 Q60 18 77 25" stroke="#d92874" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M43.5 30 Q60 22 76.5 30" stroke={GOLD} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M72 13 L92 5 L90 23 Z" fill="#ff4f95" />
      <path d="M72 13 L90 23 L75 25 Z" fill="#d92874" />
      </g>
      <g className="sil-wave">
        <Arm d="M77.5 72 Q92 88 91 110" c={c} />
        <Hand x={91} y={111} c={c} />
      </g>
    </g>
  );
}

// Fallone, l'amie : longs cheveux noirs et brillants, robe fluide, regard doux.
function Fallone({ c, mood, framed }: { c: Palette; mood?: Mood; framed: boolean }) {
  return (
    <g className="sil-breathe">
      <ellipse cx="50" cy="161" rx="7" ry="3" fill="#2a2150" />
      <ellipse cx="70" cy="161" rx="7" ry="3" fill="#2a2150" />
      <path transform="translate(0 4)" d="M41 28 C36 4 84 4 79 28 C88 48 88 78 82 98 L70 96 L69 62 L51 62 L50 96 L38 98 C32 78 32 48 41 28 Z" fill={c.hair} />
      <path d="M41 70 Q60 63 79 70 L76 99 Q93 125 90 158 Q60 164 30 158 Q27 125 44 99 Z" fill={c.main} />
      <path d="M60 104 Q76 124 80 156 Q90 154 90 158 Q60 164 60 164 Z" fill={c.mainDark} opacity="0.45" />
      <path d="M44 100 Q60 108 76 100" stroke={c.second} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M48 69 Q60 82 72 69 Q60 73 48 69 Z" fill={c.skin} />
      <ellipse cx="42" cy="74" rx="6" ry="6.4" fill={c.main} />
      <ellipse cx="78" cy="74" rx="6" ry="6.4" fill={c.main} />
      <Arm d="M41 76 Q33 92 39 110" c={c} />
      <Hand x={39.4} y={111} c={c} />
      <Arm d="M79 76 Q87 92 81 110" c={c} />
      <Hand x={80.6} y={111} c={c} />
      <g className="sil-sway">
        <g transform="translate(0 4)">
        <Face c={c} mood={mood} />
        <path d="M43 36 C42 18 52 12 61 14 C72 16 78 24 77 36 C75 28 69 21 60 20 C52 21 46 27 43 36 Z" fill={c.hair} />
        <path d="M43 34 C41 46 42 58 40 70 C39 80 40 90 42 98 L49 98 C47 86 47.6 74 49 60 C50 50 47 42 43 34 Z" fill={c.hair} />
        <path d="M77 34 C79 46 78 58 80 70 C81 80 80 90 78 98 L71 98 C73 86 72.4 74 71 60 C70 50 73 42 77 34 Z" fill={c.hair} />
        <path d="M50 17 C58 12 68 14 73 21" stroke={c.hairLight} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M41.4 52 C41 64 42 78 43 90 M78.6 52 C79 64 78 78 77 90" stroke={c.hairLight} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      </g>
      {framed && <path className="sil-heart" d="M96 30 C90 24 84 30 90 36 L96 42 L102 36 C108 30 102 24 96 30 Z" fill="#ff4f95" />}
    </g>
  );
}

// Chimène, la sœur : cheveux bouclés avec un bandeau et une fleur, tenue décontractée, grand sourire.
function Chimene({ c, mood, framed }: { c: Palette; mood?: Mood; framed: boolean }) {
  const rays = Array.from({ length: 10 }, (_, i) => i * 36);
  const curls: [number, number, number][] = [
    [38, 26, 9],
    [41, 14, 9.5],
    [50, 8, 10],
    [61, 6, 10.5],
    [72, 8, 10],
    [80, 14, 9.5],
    [83, 26, 9],
    [60, 18, 10],
  ];
  return (
    <>
      {framed && (
        <g className="sil-rays" stroke={c.main} strokeWidth="4" strokeLinecap="round">
          {rays.map((angle) => (
            <line key={angle} x1="60" y1="-2" x2="60" y2="8" transform={`rotate(${angle} 60 40)`} />
          ))}
        </g>
      )}
      <g className="sil-bounce">
        <ellipse cx="50" cy="161" rx="8" ry="3" fill="#2a2150" />
        <ellipse cx="70" cy="161" rx="8" ry="3" fill="#2a2150" />
        <path d="M43 104 L77 104 Q92 128 88 158 L66 158 L60 124 L54 158 L32 158 Q28 128 43 104 Z" fill={c.second} />
        <path d="M60 124 L66 158 L88 158 Q92 128 77 104 L60 104 Z" fill={c.secondDark} opacity="0.45" />
        <path d="M41 70 Q60 63 79 70 L80 102 L40 102 Z" fill={c.main} />
        <path d="M60 66 L79 70 L80 102 L60 102 Z" fill={c.mainDark} opacity="0.35" />
        <path d="M50 69 Q60 77 70 69 Q60 71 50 69 Z" fill={c.skin} />
        <Arm d="M42 72 Q31 92 37 112" c={c} />
        <Hand x={37.4} y={113} c={c} />
        <g className="sil-wave">
          <Arm d="M78 72 Q89 92 83 112" c={c} />
          <Hand x={82.6} y={113} c={c} />
        </g>
        <g transform="translate(0 4)">
        {curls.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={c.hair} />
        ))}
        <Face c={c} smile={1.6} mood={mood} />
        <path d="M43 33 C44 20 76 20 77 33 C71 27 49 27 43 33 Z" fill={c.hair} />
        <path d="M44 27.6 Q60 19 76 27.6" stroke="#ff4f95" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <g transform="translate(79 14)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse key={angle} cx="0" cy="-5" rx="3.3" ry="5" fill="#ff4f95" transform={`rotate(${angle})`} />
          ))}
          <circle r="2.9" fill={GOLD} />
        </g>
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
  mood,
}: {
  voie: Voie;
  size?: number;
  bust?: boolean;
  framed?: boolean;
  talking?: boolean;
  mood?: Mood;
}) {
  const c = PALETTES[voie];
  const persona = personaFor(voie);
  const viewBox = bust ? "8 8 104 100" : "0 0 120 170";
  const width = bust ? size : (size * 120) / 170;

  return (
    <svg
      className={`sil sil-${voie}${talking ? " talking" : ""}${bust ? " bust" : ""}`}
      width={width}
      height={bust ? (size * 100) / 104 : size}
      viewBox={viewBox}
      role="img"
      aria-label={`${persona.name}, ${persona.role}`}
    >
      {framed && !bust && <circle cx="60" cy="92" r="66" fill={c.bg} />}
      {framed && bust && <rect x="8" y="8" width="104" height="100" fill={c.bg} />}
      {!bust && <ellipse cx="60" cy="163" rx="30" ry="4.5" fill={INK} opacity="0.12" />}
      {voie === "sexuelle" && <Afi c={c} mood={mood} />}
      {voie === "mentale" && <Fallone c={c} mood={mood} framed={framed} />}
      {voie === "bien-etre" && <Chimene c={c} mood={mood} framed={framed} />}
    </svg>
  );
}
