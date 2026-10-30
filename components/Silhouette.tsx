import type { ReactNode } from "react";
import { personaFor, type Character } from "@/lib/brand";

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
const PALETTES: Record<Character, Palette> = {
  afi: {
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
  fallone: {
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
  chimene: {
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
            rx={kind === "ronds" ? 3.8 : 3.3}
            ry={kind === "ronds" ? 4.9 : kind === "plisses" ? 3.3 : 4.4}
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

const HEAD = "translate(60 27) scale(0.66) translate(-60 -38)";

// Bras long et fin ; la main est un simple rond.
function Arm({ d, c, w = 5 }: { d: string; c: Palette; w?: number }) {
  return <path d={d} stroke={c.skin} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

function Hand({ x, y, c }: { x: number; y: number; c: Palette }) {
  return <circle cx={x} cy={y} r="3.3" fill={c.skin} />;
}

function Neck({ c }: { c: Palette }) {
  return (
    <>
      <rect x="56" y="36" width="8" height="12" rx="3" fill={c.skin} />
      <path d="M56 38 Q60 43 64 38 L64 41 Q60 46 56 41 Z" fill={c.skinDark} opacity="0.5" />
    </>
  );
}

function Shoes({ y = 158, fill = "#2a2150" }: { y?: number; fill?: string }) {
  return (
    <>
      <ellipse cx="51" cy={y} rx="7.5" ry="3" fill={fill} />
      <ellipse cx="69" cy={y} rx="7.5" ry="3" fill={fill} />
    </>
  );
}

// Afi, la grande sœur : grand foulard rose noué, haut près du corps, pagne imprimé, une main sur la hanche. Elle fait des gestes quand elle parle.
function Afi({ c, mood }: { c: Palette; mood?: Mood }) {
  const motifs: [number, number][] = [
    [50, 96],
    [62, 100],
    [71, 94],
    [46, 118],
    [58, 122],
    [70, 116],
    [42, 140],
    [55, 144],
    [68, 140],
    [79, 144],
  ];
  return (
    <g className="sil-breathe">
      <rect x="47.5" y="146" width="5" height="12" rx="2.5" fill={c.skin} />
      <rect x="67.5" y="146" width="5" height="12" rx="2.5" fill={c.skin} />
      <Shoes y={159} fill="#c4633f" />
      <path d="M48 80 L72 80 Q80 112 85 152 Q60 158 35 152 Q40 112 48 80 Z" fill="#3d3bd9" />
      <path d="M60 80 L72 80 Q80 112 85 152 Q72 155 62 155 Z" fill="#2f2db0" opacity="0.55" />
      {motifs.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 3.4} Q${x + 3} ${y} ${x} ${y + 3.4} Q${x - 3} ${y} ${x} ${y - 3.4} Z`} fill={GOLD} />
      ))}
      <path d="M35 150 Q60 156 85 150" stroke={GOLD} strokeWidth="2.2" fill="none" />
      <path d="M44 46 Q60 41 76 46 L74 62 Q72 72 71 80 L49 80 Q48 72 46 62 Z" fill={c.main} />
      <path d="M60 44 L76 46 L74 62 Q72 72 71 80 L60 80 Z" fill={c.mainDark} opacity="0.4" />
      <path d="M48 79 L72 79 L72 83 L48 83 Z" fill={GOLD} />
      <Neck c={c} />
      <path d="M53 45 Q60 56 67 45 Q60 49 53 45 Z" fill={c.skin} />
      <ellipse cx="44" cy="49" rx="5" ry="5.4" fill={c.main} />
      <ellipse cx="76" cy="49" rx="5" ry="5.4" fill={c.main} />
      <Arm d="M44 51 Q31 68 49 82" c={c} />
      <Hand x={50} y={82} c={c} />
      <g transform={HEAD}>
        <Face c={c} mood={mood} />
        <path d="M41.5 34 C36 -2 84 -2 78.5 34 C74 17 46 17 41.5 34 Z" fill="#ff4f95" />
        <path d="M50 10 Q60 3 71 10" stroke="#ff9cc4" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M42 22 Q60 13 78 22" stroke="#d92874" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M43 30 Q60 21 77 30" stroke={GOLD} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M70 8 L96 -4 L92 22 Z" fill="#ff4f95" />
        <path d="M70 8 L92 22 L74 24 Z" fill="#d92874" />
      </g>
      <g className="sil-wave">
        <Arm d="M76 51 Q88 68 85 92" c={c} />
        <Hand x={85} y={93} c={c} />
      </g>
    </g>
  );
}

// Fallone, l'amie : longs cheveux noirs et brillants, chemisier doux, pantalon large clair.
function Fallone({ c, mood, framed }: { c: Palette; mood?: Mood; framed: boolean }) {
  return (
    <g className="sil-breathe">
      <g transform={HEAD}>
        <path d="M41 30 C36 2 84 2 79 30 C90 52 90 84 82 104 L70 100 L69 62 L51 62 L50 100 L38 104 C30 84 30 52 41 30 Z" fill={c.hair} />
      </g>
      <Shoes y={158} fill="#caa985" />
      <path d="M47 80 L73 80 L81 156 L62 156 L60 104 L58 156 L39 156 Z" fill="#f1e3cb" />
      <path d="M60 80 L73 80 L81 156 L62 156 L60 104 Z" fill="#d9c6a6" opacity="0.6" />
      <path d="M44 46 Q60 41 76 46 L75 66 Q75 76 73 82 L47 82 Q45 76 45 66 Z" fill={c.main} />
      <path d="M60 44 L76 46 L75 66 Q75 76 73 82 L60 82 Z" fill={c.mainDark} opacity="0.4" />
      <path d="M47 80 L73 80 L73 84 L47 84 Z" fill={GOLD} />
      <Neck c={c} />
      <path d="M54 45 Q60 54 66 45 Q60 49 54 45 Z" fill={c.skin} />
      <ellipse cx="44" cy="49" rx="5" ry="5.4" fill={c.main} />
      <ellipse cx="76" cy="49" rx="5" ry="5.4" fill={c.main} />
      <Arm d="M43 52 Q35 70 41 90" c={c} />
      <Hand x={41.4} y={91} c={c} />
      <Arm d="M77 52 Q85 70 79 90" c={c} />
      <Hand x={78.6} y={91} c={c} />
      <g className="sil-sway">
        <g transform={HEAD}>
          <Face c={c} mood={mood} />
          <path d="M43 36 C42 18 52 12 61 14 C72 16 78 24 77 36 C75 28 69 21 60 20 C52 21 46 27 43 36 Z" fill={c.hair} />
          <path d="M43 34 C41 48 42 62 38 76 C36 86 38 96 41 104 L50 102 C47 90 48 76 49 62 C50 50 47 42 43 34 Z" fill={c.hair} />
          <path d="M77 34 C79 48 78 62 82 76 C84 86 82 96 79 104 L70 102 C73 90 72 76 71 62 C70 50 73 42 77 34 Z" fill={c.hair} />
          <path d="M50 17 C58 12 68 14 73 21" stroke={c.hairLight} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M41 56 C40 70 41 84 43 96 M79 56 C80 70 79 84 77 96" stroke={c.hairLight} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      </g>
      {framed && <path className="sil-heart" d="M96 30 C90 24 84 30 90 36 L96 42 L102 36 C108 30 102 24 96 30 Z" fill="#ff4f95" />}
    </g>
  );
}

// Chimène, la petite sœur : plus petite, cheveux bouclés avec un bandeau et une fleur, t-shirt, jupe et baskets.
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
        <g transform="translate(60 160) scale(0.93) translate(-60 -160)">
          <rect x="47" y="108" width="7" height="46" rx="3.5" fill={c.skin} />
          <rect x="66" y="108" width="7" height="46" rx="3.5" fill={c.skin} />
          <path d="M44 150 L56 150 L56 158 Q50 161 42 158 Z M64 150 L76 150 L78 158 Q70 161 64 158 Z" fill="#fff" />
          <path d="M42 156 L56 156 M64 156 L78 156" stroke="#ff4f95" strokeWidth="1.8" />
          <path d="M44 74 L76 74 L84 110 L36 110 Z" fill={c.second} />
          <path d="M60 74 L76 74 L84 110 L60 110 Z" fill={c.secondDark} opacity="0.45" />
          <path d="M45 46 Q60 41 75 46 L78 76 L42 76 Z" fill={c.main} />
          <path d="M60 44 L75 46 L78 76 L60 76 Z" fill={c.mainDark} opacity="0.35" />
          <Neck c={c} />
          <path d="M54 45 Q60 53 66 45 Q60 48 54 45 Z" fill={c.skin} />
          <ellipse cx="44" cy="49" rx="5.5" ry="5.6" fill={c.main} />
          <ellipse cx="76" cy="49" rx="5.5" ry="5.6" fill={c.main} />
          <Arm d="M43 52 Q34 72 40 92" c={c} />
          <Hand x={40.4} y={93} c={c} />
          <g className="sil-wave">
            <Arm d="M77 52 Q86 72 80 92" c={c} />
            <Hand x={79.6} y={93} c={c} />
          </g>
          <g transform={HEAD}>
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
      </g>
    </>
  );
}

export default function Silhouette({
  who,
  size = 96,
  bust = false,
  framed = true,
  talking = false,
  mood,
}: {
  who: Character;
  size?: number;
  bust?: boolean;
  framed?: boolean;
  talking?: boolean;
  mood?: Mood;
}) {
  const c = PALETTES[who];
  const persona = personaFor(who);
  const viewBox = bust ? "34 8 52 50" : "0 0 120 170";
  const width = bust ? size : (size * 120) / 170;

  return (
    <svg
      className={`sil sil-${who}${talking ? " talking" : ""}${bust ? " bust" : ""}`}
      width={width}
      height={bust ? (size * 50) / 52 : size}
      viewBox={viewBox}
      role="img"
      aria-label={`${persona.name}, ${persona.role}`}
    >
      {framed && !bust && <circle cx="60" cy="92" r="66" fill={c.bg} />}
      {framed && bust && <rect x="34" y="8" width="52" height="50" fill={c.bg} />}
      {!bust && <ellipse cx="60" cy="162" rx="26" ry="4" fill={INK} opacity="0.12" />}
      {who === "afi" && <Afi c={c} mood={mood} />}
      {who === "fallone" && <Fallone c={c} mood={mood} framed={framed} />}
      {who === "chimene" && <Chimene c={c} mood={mood} framed={framed} />}
    </svg>
  );
}
