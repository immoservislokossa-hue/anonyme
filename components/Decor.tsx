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
