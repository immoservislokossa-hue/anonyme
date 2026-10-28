import type { Decor as DecorName } from "@/lib/stories";

// Décors du dessin animé : de simples formes, légères et sans image à charger.
export default function Decor({ name }: { name: DecorName }) {
  return (
    <svg className="decor" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {name === "cour" && (
        <>
          <defs>
            <linearGradient id="sky-cour" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#bfe9ff" />
              <stop offset="1" stopColor="#fff6e0" />
            </linearGradient>
          </defs>
          <rect width="600" height="340" fill="url(#sky-cour)" />
          <circle cx="500" cy="70" r="34" fill="#ffc233" />
          <g className="drift" fill="#fff" opacity="0.85">
            <ellipse cx="150" cy="56" rx="48" ry="13" />
            <ellipse cx="300" cy="86" rx="36" ry="11" />
          </g>
          <rect y="236" width="600" height="104" fill="#f1dcb7" />
          <rect x="40" y="120" width="150" height="116" rx="6" fill="#e9c9a0" />
          <rect x="95" y="170" width="40" height="66" rx="4" fill="#8d5a3b" />
          <path d="M30 124 L115 70 L200 124 Z" fill="#c4633f" />
          <rect x="430" y="150" width="14" height="86" fill="#8d5a3b" />
          <circle cx="437" cy="130" r="42" fill="#3fae6a" />
          <circle cx="410" cy="150" r="28" fill="#4cc27b" />
          <circle cx="466" cy="152" r="28" fill="#4cc27b" />
        </>
      )}
      {name === "chambre" && (
        <>
          <rect width="600" height="340" fill="#f7e6f2" />
          <rect y="250" width="600" height="90" fill="#e5cfe0" />
          <rect x="60" y="60" width="150" height="120" rx="8" fill="#bfe9ff" stroke="#fff" strokeWidth="8" />
          <path d="M135 60 V180 M60 120 H210" stroke="#fff" strokeWidth="6" />
          <rect x="360" y="190" width="200" height="70" rx="10" fill="#6a68ee" />
          <rect x="360" y="170" width="70" height="30" rx="10" fill="#fff" />
          <rect x="300" y="170" width="10" height="90" fill="#8d5a3b" />
          <path d="M280 170 H330 L318 130 H292 Z" fill="#ffc233" />
        </>
      )}
      {name === "centre" && (
        <>
          <rect width="600" height="340" fill="#e4f8f4" />
          <rect y="250" width="600" height="90" fill="#cfeee8" />
          <rect x="230" y="60" width="140" height="60" rx="10" fill="#fff" />
          <path d="M300 72 V108 M282 90 H318" stroke="#00c9b1" strokeWidth="12" strokeLinecap="round" />
          <rect x="250" y="140" width="100" height="110" rx="6" fill="#fff" stroke="#00c9b1" strokeWidth="5" />
          <path d="M300 140 V250" stroke="#00c9b1" strokeWidth="4" />
          <rect x="60" y="215" width="120" height="14" rx="6" fill="#8d5a3b" />
          <rect x="70" y="229" width="10" height="26" fill="#8d5a3b" />
          <rect x="160" y="229" width="10" height="26" fill="#8d5a3b" />
          <rect x="440" y="120" width="120" height="90" rx="6" fill="#fff" stroke="#00c9b1" strokeWidth="4" />
          <path d="M455 150 H545 M455 175 H520" stroke="#b7e8e0" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {name === "ecole" && (
        <>
          <defs>
            <linearGradient id="sky-ecole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a9dcff" />
              <stop offset="1" stopColor="#eaf7ff" />
            </linearGradient>
          </defs>
          <rect width="600" height="340" fill="url(#sky-ecole)" />
          <g className="drift" fill="#fff" opacity="0.9">
            <ellipse cx="120" cy="60" rx="46" ry="14" />
            <ellipse cx="150" cy="50" rx="30" ry="12" />
            <ellipse cx="430" cy="88" rx="52" ry="14" />
          </g>
          <rect y="244" width="600" height="96" fill="#e9d6b0" />
          <rect x="70" y="116" width="460" height="128" fill="#f4e3c1" />
          <path d="M60 120 L300 70 L540 120 Z" fill="#c4633f" />
          <rect x="268" y="170" width="64" height="74" rx="4" fill="#8d5a3b" />
          <g fill="#6fb7e8">
            <rect x="100" y="150" width="46" height="46" rx="3" />
            <rect x="170" y="150" width="46" height="46" rx="3" />
            <rect x="384" y="150" width="46" height="46" rx="3" />
            <rect x="454" y="150" width="46" height="46" rx="3" />
          </g>
          <rect x="296" y="26" width="3" height="48" fill="#8d5a3b" />
          <path d="M299 28 H330 L322 38 L330 48 H299 Z" fill="#00c9b1" />
        </>
      )}
      {name === "nuit" && (
        <>
          <rect width="600" height="340" fill="#25244f" />
          <rect y="250" width="600" height="90" fill="#35336a" />
          <rect x="60" y="56" width="160" height="128" rx="8" fill="#14143a" stroke="#4b49a0" strokeWidth="8" />
          <path d="M140 56 V184 M60 120 H220" stroke="#4b49a0" strokeWidth="5" />
          <circle cx="178" cy="96" r="20" fill="#fff4c9" />
          <circle cx="170" cy="90" r="18" fill="#14143a" />
          <g className="twinkle" fill="#fff">
            <circle cx="86" cy="84" r="2" />
            <circle cx="112" cy="150" r="1.6" />
            <circle cx="196" cy="150" r="2" />
            <circle cx="116" cy="74" r="1.4" />
          </g>
          <rect x="370" y="196" width="200" height="66" rx="10" fill="#4b49a0" />
          <rect x="370" y="176" width="66" height="30" rx="10" fill="#c9c8f0" />
          <rect x="316" y="180" width="8" height="82" fill="#8d5a3b" />
          <path d="M296 182 H344 L332 142 H308 Z" fill="#ffc233" />
          <circle cx="320" cy="170" r="70" fill="#ffc233" opacity="0.12" />
        </>
      )}
      {name === "pharmacie" && (
        <>
          <rect width="600" height="340" fill="#eaf8ef" />
          <rect y="262" width="600" height="78" fill="#cde9d6" />
          <rect x="230" y="30" width="140" height="56" rx="10" fill="#fff" />
          <path d="M300 40 V76 M282 58 H318" stroke="#2fb36a" strokeWidth="12" strokeLinecap="round" />
          <g fill="#fff" stroke="#bfe3cc" strokeWidth="3">
            <rect x="40" y="110" width="150" height="90" rx="6" />
            <rect x="410" y="110" width="150" height="90" rx="6" />
          </g>
          <g fill="#7fd1a2">
            <rect x="54" y="124" width="22" height="30" rx="4" />
            <rect x="84" y="124" width="22" height="30" rx="4" />
            <rect x="114" y="124" width="22" height="30" rx="4" />
            <rect x="424" y="124" width="22" height="30" rx="4" />
            <rect x="454" y="124" width="22" height="30" rx="4" />
            <rect x="484" y="124" width="22" height="30" rx="4" />
          </g>
          <rect x="190" y="206" width="220" height="56" rx="8" fill="#f6fff9" stroke="#bfe3cc" strokeWidth="4" />
        </>
      )}
      {name === "soir" && (
        <>
          <defs>
            <linearGradient id="sky-soir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6a68ee" />
              <stop offset="0.55" stopColor="#ff9db5" />
              <stop offset="1" stopColor="#ffd9a0" />
            </linearGradient>
          </defs>
          <rect width="600" height="340" fill="url(#sky-soir)" />
          <circle cx="300" cy="190" r="48" fill="#ffe08a" />
          <g className="drift" fill="#fff" opacity="0.35">
            <ellipse cx="110" cy="70" rx="56" ry="12" />
            <ellipse cx="470" cy="100" rx="64" ry="12" />
          </g>
          <g fill="#4a3f7a">
            <rect x="0" y="170" width="110" height="110" />
            <rect x="120" y="140" width="90" height="140" />
            <rect x="400" y="150" width="100" height="130" />
            <rect x="510" y="180" width="90" height="100" />
          </g>
          <g fill="#ffd36e" opacity="0.9">
            <rect x="20" y="190" width="14" height="18" />
            <rect x="140" y="160" width="14" height="18" />
            <rect x="170" y="200" width="14" height="18" />
            <rect x="420" y="170" width="14" height="18" />
            <rect x="530" y="200" width="14" height="18" />
          </g>
          <rect y="262" width="600" height="78" fill="#7d6a8e" />
          <path d="M0 304 H600" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" strokeDasharray="28 20" />
        </>
      )}
      {name === "rue" && (
        <>
          <defs>
            <linearGradient id="sky-rue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd6a5" />
              <stop offset="1" stopColor="#ffe9f1" />
            </linearGradient>
          </defs>
          <rect width="600" height="340" fill="url(#sky-rue)" />
          <circle cx="110" cy="90" r="30" fill="#ffc233" />
          <rect x="40" y="130" width="90" height="110" fill="#8e8ce6" />
          <rect x="150" y="100" width="110" height="140" fill="#6a68ee" />
          <rect x="400" y="120" width="100" height="120" fill="#8e8ce6" />
          <rect x="510" y="150" width="90" height="90" fill="#6a68ee" />
          <g fill="#fff" opacity="0.8">
            <rect x="60" y="150" width="16" height="20" />
            <rect x="90" y="150" width="16" height="20" />
            <rect x="172" y="120" width="16" height="20" />
            <rect x="210" y="120" width="16" height="20" />
            <rect x="172" y="160" width="16" height="20" />
            <rect x="420" y="140" width="16" height="20" />
            <rect x="454" y="140" width="16" height="20" />
          </g>
          <rect y="240" width="600" height="100" fill="#d9c7a8" />
          <path d="M0 290 H600" stroke="#fff" strokeWidth="5" strokeDasharray="30 22" />
        </>
      )}
    </svg>
  );
}
