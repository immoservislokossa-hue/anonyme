import type { ReactNode } from "react";

// Illustrations dessinées pour Alviosa : formes simples, couleurs du site. Aucune image à charger.
// Les classes a-* (remplissage) et s-* (trait) sont définies dans globals.css avec les couleurs de la marque.

function Frame({ label, children, tone = "primary" }: { label: string; children: ReactNode; tone?: "primary" | "teal" | "sun" }) {
  return (
    <svg className="art" viewBox="0 0 200 140" role="img" aria-label={label}>
      <rect width="200" height="140" rx="26" className={tone === "teal" ? "a-tealsoft" : tone === "sun" ? "a-sunsoft" : "a-bg"} />
      {children}
    </svg>
  );
}

function Pill({ x, y, r = 0, w = 30, h = 14 }: { x: number; y: number; r?: number; w?: number; h?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} className="a-white s-dark" />
      <path d={`M0 ${-h / 2} h${w / 2 - h / 2} a${h / 2} ${h / 2} 0 0 1 0 ${h} h${-(w / 2 - h / 2)} z`} className="a-primary" />
    </g>
  );
}

function Blister({ x, y, rows = 4, cols = 7, inactive = 0 }: { x: number; y: number; rows?: number; cols?: number; inactive?: number }) {
  const dots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const last = r >= rows - (inactive > 0 ? 1 : 0);
      dots.push(<circle key={`${r}-${c}`} cx={x + 12 + c * 17} cy={y + 14 + r * 17} r="6" className={last ? "a-rose" : "a-primary"} />);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={cols * 17 + 7} height={rows * 17 + 11} rx="10" className="a-white s-muted" />
      {dots}
    </g>
  );
}

function Calendar({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x} y={y} width="62" height="58" rx="10" className="a-white s-primary" />
      <rect x={x} y={y} width="62" height="16" rx="10" className="a-primary" />
      <rect x={x + 12} y={y - 6} width="6" height="14" rx="3" className="a-dark" />
      <rect x={x + 44} y={y - 6} width="6" height="14" rx="3" className="a-dark" />
      {label ? (
        <text x={x + 31} y={y + 45} textAnchor="middle" className="art-text">
          {label}
        </text>
      ) : (
        <>
          <circle cx={x + 16} cy={y + 30} r="4" className="a-rose" />
          <circle cx={x + 31} cy={y + 30} r="4" className="a-rose" />
          <circle cx={x + 46} cy={y + 30} r="4" className="a-primary" />
          <circle cx={x + 16} cy={y + 44} r="4" className="a-rose" />
          <circle cx={x + 31} cy={y + 44} r="4" className="a-rose" />
        </>
      )}
    </g>
  );
}

function Clock({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="a-white s-primary" />
      <path d={`M${x} ${y - r * 0.6} V${y} L${x + r * 0.45} ${y + r * 0.25}`} className="s-dark" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Shield({ x, y, s = 1, mark = "check" }: { x: number; y: number; s?: number; mark?: "check" | "plus" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -30 L26 -20 V4 C26 20 12 30 0 36 C-12 30 -26 20 -26 4 V-20 Z" className="a-teal" />
      {mark === "check" ? (
        <path d="M-11 2 L-3 10 L12 -8" className="s-white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M0 -10 V14 M-12 2 H12" className="s-white" strokeWidth="5" strokeLinecap="round" />
      )}
    </g>
  );
}

function Bubble({ x, y, w = 70, h = 44, children, tail = "left" }: { x: number; y: number; w?: number; h?: number; children?: ReactNode; tail?: "left" | "right" }) {
  const tx = tail === "left" ? x + 14 : x + w - 14;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" className="a-white s-primary" />
      <path d={`M${tx} ${y + h - 1} l${tail === "left" ? -6 : 6} 12 l${tail === "left" ? 16 : -16} -12 z`} className="a-white s-primary" />
      <path d={`M${tx - 5} ${y + h - 1} h14`} className="s-white" strokeWidth="3" />
      {children}
    </g>
  );
}

function Beads({ cx, cy, r, count = 28 }: { cx: number; cy: number; r: number; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 - Math.PI / 2;
        const day = i + 1;
        const cls = day === 1 ? "a-alert" : day >= 8 && day <= 19 ? "a-white s-muted" : "a-brown";
        return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={r * 0.115} className={cls} />;
      })}
    </g>
  );
}

function Person({ x, y, s = 1, tone = "a-skin", body = "a-primary" }: { x: number; y: number; s?: number; tone?: string; body?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-26" r="11" className={tone} />
      <path d="M-16 24 C-16 -2 16 -2 16 24 Z" className={body} />
    </g>
  );
}

// ---------- Méthodes ----------
export function MethodArt({ id }: { id: string }) {
  switch (id) {
    case "implants":
      return (
        <Frame label="Un petit bâtonnet sous la peau du bras">
          <path d="M14 82 C14 62 34 56 54 56 L146 50 C178 50 188 68 188 80 C188 94 178 102 146 102 L54 100 C34 100 14 98 14 82 Z" className="a-skin" />
          <rect x="80" y="70" width="58" height="9" rx="4.5" className="a-white s-primary" />
          <circle cx="146" cy="34" r="26" className="a-white s-primary" />
          <rect x="126" y="30" width="40" height="9" rx="4.5" className="a-primary" />
          <path d="M126 52 L110 70" className="s-primary" strokeWidth="2" strokeDasharray="4 4" />
        </Frame>
      );
    case "sterilet":
      return (
        <Frame label="Un petit T en plastique dans l'utérus">
          <path d="M100 18 C66 18 48 42 58 72 C64 90 84 98 100 120 C116 98 136 90 142 72 C152 42 134 18 100 18 Z" className="a-rose" />
          <rect x="95" y="48" width="10" height="52" rx="5" className="a-white" />
          <rect x="72" y="42" width="56" height="10" rx="5" className="a-white" />
          <path d="M95 62 h10 M95 72 h10 M95 82 h10" className="s-sun" strokeWidth="3" />
        </Frame>
      );
    case "sterilisation-feminine":
      return (
        <Frame label="Les trompes sont fermées : l'ovule ne rencontre plus le spermatozoïde">
          <path d="M100 56 C84 56 76 70 82 84 C86 96 96 100 100 108 C104 100 114 96 118 84 C124 70 116 56 100 56 Z" className="a-rose" />
          <path d="M84 62 C60 56 44 44 36 30 M116 62 C140 56 156 44 164 30" className="s-primary" strokeWidth="6" strokeLinecap="round" />
          <circle cx="36" cy="28" r="9" className="a-white s-primary" />
          <circle cx="164" cy="28" r="9" className="a-white s-primary" />
          <path d="M60 50 l12 12 M72 50 l-12 12 M128 50 l12 12 M140 50 l-12 12" className="s-alert" strokeWidth="5" strokeLinecap="round" />
        </Frame>
      );
    case "vasectomie":
      return (
        <Frame label="Les canaux sont coupés : plus de spermatozoïdes dans le sperme">
          <ellipse cx="46" cy="94" rx="20" ry="26" className="a-rose" />
          <ellipse cx="154" cy="94" rx="20" ry="26" className="a-rose" />
          <path d="M46 70 C46 30 70 24 100 24 C130 24 154 30 154 70" className="s-primary" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M60 36 l14 14 M74 36 l-14 14 M126 36 l14 14 M140 36 l-14 14" className="s-alert" strokeWidth="5" strokeLinecap="round" />
        </Frame>
      );
    case "pilule":
      return (
        <Frame label="Une pilule chaque jour">
          <Blister x={28} y={30} inactive={1} />
          <Pill x={160} y={112} r={-25} w={34} h={15} />
        </Frame>
      );
    case "pilule-minidosee":
      return (
        <Frame label="Une pilule chaque jour, à la même heure">
          <Blister x={20} y={36} />
          <Clock x={166} y={36} r={22} />
        </Frame>
      );
    case "injectables":
      return (
        <Frame label="Une injection tous les 2 ou 3 mois">
          <g transform="rotate(-35 70 80)">
            <rect x="26" y="70" width="84" height="20" rx="8" className="a-white s-primary" />
            <rect x="34" y="75" width="46" height="10" rx="4" className="a-primary" />
            <rect x="104" y="76" width="30" height="8" rx="4" className="a-white s-primary" />
            <path d="M134 80 H168" className="s-dark" strokeWidth="3" strokeLinecap="round" />
            <rect x="14" y="64" width="12" height="32" rx="5" className="a-dark" />
          </g>
          <Calendar x={118} y={56} label="3 mois" />
        </Frame>
      );
    case "mama":
      return (
        <Frame label="Allaiter exclusivement, jusqu'à 6 mois" tone="teal">
          <Person x={72} y={92} s={1.6} tone="a-skin" body="a-teal" />
          <circle cx="104" cy="82" r="10" className="a-skin" />
          <path d="M92 118 C92 96 118 96 118 118 Z" className="a-sun" />
          <circle cx="158" cy="40" r="22" className="a-white s-teal" />
          <text x="158" y="46" textAnchor="middle" className="art-text">
            6 mois
          </text>
        </Frame>
      );
    case "preservatif-masculin":
      return (
        <Frame label="Le préservatif protège de la grossesse et des IST">
          <rect x="70" y="30" width="44" height="86" rx="22" className="a-white s-primary" />
          <rect x="62" y="24" width="60" height="14" rx="7" className="a-primary" />
          <path d="M80 54 V100" className="s-rose" strokeWidth="4" strokeLinecap="round" />
          <Shield x={154} y={52} s={0.9} mark="plus" />
        </Frame>
      );
    case "preservatif-feminin":
      return (
        <Frame label="Le préservatif féminin, une gaine souple">
          <rect x="78" y="46" width="44" height="82" rx="22" className="a-white s-primary" />
          <ellipse cx="100" cy="40" rx="34" ry="14" className="a-white s-primary" strokeWidth="6" />
          <ellipse cx="100" cy="112" rx="14" ry="8" className="a-white s-primary" />
          <Shield x={160} y={36} s={0.7} mark="plus" />
        </Frame>
      );
    case "jours-fixes":
      return (
        <Frame label="Le collier du cycle : jours fertiles du 8e au 19e jour">
          <Beads cx={100} cy={70} r={50} />
          <text x="100" y="66" textAnchor="middle" className="art-text">
            8 → 19
          </text>
          <text x="100" y="84" textAnchor="middle" className="art-text art-small">
            jours fertiles
          </text>
        </Frame>
      );
    case "retrait":
      return (
        <Frame label="Le retrait avant l'éjaculation, moins efficace">
          <Person x={62} y={96} s={1.4} />
          <Person x={140} y={96} s={1.4} tone="a-skin" body="a-teal" />
          <path d="M84 56 H116" className="s-alert" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" />
          <path d="M104 46 l14 10 l-14 10" className="s-alert" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
      );
    case "contraception-urgence":
      return (
        <Frame label="La pilule d'urgence, jusqu'à 5 jours après le rapport">
          <Pill x={52} y={44} r={-20} w={46} h={20} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx={34 + i * 33} cy={104} r="13" className={i === 0 ? "a-primary" : i < 3 ? "a-rose" : "a-white s-muted"} />
              <text x={34 + i * 33} y={109} textAnchor="middle" className="art-text art-small">
                {i + 1}
              </text>
            </g>
          ))}
          <text x="150" y="40" textAnchor="middle" className="art-text art-small">
            plus tôt =
          </text>
          <text x="150" y="56" textAnchor="middle" className="art-text art-small">
            mieux
          </text>
        </Frame>
      );
    default:
      return (
        <Frame label="Méthode de planification familiale">
          <Pill x={100} y={70} r={-20} w={60} h={26} />
        </Frame>
      );
  }
}

// ---------- Outils ----------
export function ToolArt({ id }: { id: string }) {
  switch (id) {
    case "risque":
      return (
        <Frame label="Le temps compte : la pilule d'urgence, vite" tone="sun">
          <Clock x={64} y={70} r={40} />
          <Pill x={140} y={58} r={-25} w={50} h={22} />
          <path d="M112 100 h50" className="s-primary" strokeWidth="5" strokeLinecap="round" />
          <text x="137" y="124" textAnchor="middle" className="art-text art-small">
            72 h · 5 jours
          </text>
        </Frame>
      );
    case "choisir":
      return (
        <Frame label="Plusieurs méthodes, tu choisis">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${26 + i * 54} ${34 + (i === 1 ? -8 : 0)})`}>
              <rect width="46" height="74" rx="12" className="a-white s-primary" />
              <circle cx="23" cy="26" r="9" className={i === 1 ? "a-teal" : "a-rose"} />
              <path d="M10 50 h26 M10 60 h18" className="s-muted" strokeWidth="4" strokeLinecap="round" />
            </g>
          ))}
          <path d="M96 52 l6 6 l12 -14" className="s-white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
      );
    case "commencer":
      return (
        <Frame label="Une liste de contrôle de six questions">
          <rect x="52" y="20" width="96" height="104" rx="14" className="a-white s-primary" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="64" y={34 + i * 22} width="14" height="14" rx="4" className={i < 2 ? "a-teal" : "a-white s-muted"} />
              <path d={`M92 ${41 + i * 22} h40`} className="s-muted" strokeWidth="4" strokeLinecap="round" />
            </g>
          ))}
          <path d="M67 41 l3 3 l6 -7 M67 63 l3 3 l6 -7" className="s-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
      );
    case "plan":
      return (
        <Frame label="Un calendrier avec des rappels" tone="teal">
          <Calendar x={42} y={36} />
          <path d="M146 40 c-16 0 -22 14 -22 30 v14 l-8 10 h60 l-8 -10 v-14 c0 -16 -6 -30 -22 -30 z" className="a-primary" transform="translate(-10 0) scale(0.9)" />
          <circle cx="140" cy="108" r="6" className="a-dark" />
        </Frame>
      );
    case "cycle":
      return (
        <Frame label="Le collier du cycle" tone="sun">
          <Beads cx={100} cy={70} r={48} />
          <circle cx="100" cy="70" r="26" className="a-white s-muted" />
          <text x="100" y="75" textAnchor="middle" className="art-text">
            28 j
          </text>
        </Frame>
      );
    default:
      return (
        <Frame label="Une question sur ta méthode">
          <Bubble x={34} y={22} w={90} h={52}>
            <text x="79" y="58" textAnchor="middle" className="art-text" style={{ fontSize: 26 }}>
              ?
            </text>
          </Bubble>
          <Blister x={96} y={78} rows={2} cols={5} />
        </Frame>
      );
  }
}

// ---------- Sujets ----------
export function TopicArt({ id }: { id: string }) {
  switch (id) {
    case "eviter":
      return (
        <Frame label="Choisir une méthode">
          <Blister x={24} y={30} rows={3} cols={5} />
          <Shield x={152} y={64} s={1.3} />
        </Frame>
      );
    case "risque":
      return (
        <Frame label="Agir vite après un risque" tone="sun">
          <Clock x={62} y={70} r={38} />
          <Pill x={140} y={64} r={-25} w={54} h={24} />
        </Frame>
      );
    case "regles":
      return (
        <Frame label="Les règles et le cycle" tone="sun">
          <Calendar x={32} y={36} />
          <path d="M146 44 C146 44 124 70 124 86 a22 22 0 0 0 44 0 C168 70 146 44 146 44 Z" className="a-alert" />
        </Frame>
      );
    case "grossesse":
      return (
        <Frame label="Grossesse : un test, puis le centre">
          <rect x="36" y="58" width="100" height="26" rx="13" className="a-white s-primary" transform="rotate(-18 86 70)" />
          <rect x="52" y="64" width="26" height="14" rx="7" className="a-rose" transform="rotate(-18 65 71)" />
          <path d="M148 62 c-10 -16 -32 -4 -18 12 l18 18 l18 -18 c14 -16 -8 -28 -18 -12 z" className="a-primary" />
        </Frame>
      );
    case "ist":
      return (
        <Frame label="Se protéger des IST et du VIH" tone="teal">
          <Shield x={100} y={72} s={1.7} mark="plus" />
        </Frame>
      );
    case "relations":
      return (
        <Frame label="Des relations respectueuses">
          <circle cx="82" cy="70" r="38" className="a-rose" />
          <circle cx="118" cy="70" r="38" className="a-teal" opacity="0.8" />
          <path d="M100 58 c-8 -12 -26 -2 -14 10 l14 14 l14 -14 c12 -12 -6 -22 -14 -10 z" className="a-white" />
        </Frame>
      );
    case "violence":
      return (
        <Frame label="Un endroit sûr, des soins">
          <Shield x={100} y={72} s={1.6} mark="check" />
          <circle cx="42" cy="34" r="8" className="a-primary" />
          <circle cx="164" cy="104" r="8" className="a-sun" />
        </Frame>
      );
    case "garcons":
      return (
        <Frame label="Les garçons aussi">
          <Person x={70} y={100} s={1.7} />
          <rect x="118" y="44" width="34" height="62" rx="17" className="a-white s-primary" />
          <rect x="112" y="38" width="46" height="11" rx="5.5" className="a-primary" />
        </Frame>
      );
    default:
      return (
        <Frame label="Rumeurs et vérités">
          <Bubble x={24} y={24} w={72} h={46}>
            <path d="M48 38 l22 22 M70 38 l-22 22" className="s-alert" strokeWidth="6" strokeLinecap="round" />
          </Bubble>
          <Bubble x={104} y={64} w={72} h={46} tail="right">
            <path d="M126 88 l10 10 l22 -22" className="s-teal" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </Bubble>
        </Frame>
      );
  }
}

// ---------- Hub ----------
export function HubArt({ id }: { id: string }) {
  switch (id) {
    case "sujets":
      return (
        <Frame label="Les sujets">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={36 + i * 12} y={22 + i * 12} width="104" height="64" rx="14" className={i === 2 ? "a-white s-primary" : i === 1 ? "a-rose" : "a-muted"} />
          ))}
          <path d="M70 74 h60 M70 88 h40" className="s-primary" strokeWidth="5" strokeLinecap="round" />
        </Frame>
      );
    case "outils":
      return (
        <Frame label="Les outils" tone="sun">
          <rect x="34" y="36" width="132" height="14" rx="7" className="a-white s-primary" />
          <rect x="34" y="66" width="132" height="14" rx="7" className="a-white s-primary" />
          <rect x="34" y="96" width="132" height="14" rx="7" className="a-white s-primary" />
          <circle cx="74" cy="43" r="12" className="a-primary" />
          <circle cx="128" cy="73" r="12" className="a-teal" />
          <circle cx="96" cy="103" r="12" className="a-dark" />
        </Frame>
      );
    case "methodes":
      return (
        <Frame label="Les méthodes" tone="teal">
          <Blister x={20} y={26} rows={2} cols={4} />
          <rect x="116" y="30" width="26" height="62" rx="13" className="a-white s-primary" />
          <rect x="112" y="26" width="34" height="9" rx="4.5" className="a-primary" />
          <rect x="152" y="58" width="30" height="8" rx="4" className="a-white s-primary" />
          <path d="M42 112 C60 100 90 100 168 112" className="s-primary" strokeWidth="5" strokeLinecap="round" />
        </Frame>
      );
    default:
      return (
        <Frame label="La série">
          <rect x="30" y="28" width="140" height="84" rx="16" className="a-white s-primary" />
          <path d="M88 52 L124 70 L88 88 Z" className="a-primary" />
          <circle cx="44" cy="124" r="5" className="a-primary" />
          <circle cx="60" cy="124" r="5" className="a-rose" />
          <circle cx="76" cy="124" r="5" className="a-rose" />
        </Frame>
      );
  }
}
