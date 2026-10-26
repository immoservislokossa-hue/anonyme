// Icônes simples en traits, héritent la couleur du texte (currentColor).
export type IconName =
  | "home"
  | "chat"
  | "quiz"
  | "pin"
  | "alert"
  | "mic"
  | "send"
  | "speaker"
  | "check"
  | "star"
  | "flame"
  | "book"
  | "heart"
  | "sun"
  | "circles"
  | "shield";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.5A8 8 0 1 1 21 12z" />,
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.2 1-1.2 1.8" />
      <path d="M12 17h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5h.01" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </>
  ),
  send: (
    <>
      <path d="M21 3L10 14" />
      <path d="M21 3l-6.5 18-4-8-8-4z" />
    </>
  ),
  speaker: (
    <>
      <path d="M11 5L6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  star: <path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.5l6.3-.7z" />,
  flame: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z" />,
  book: (
    <>
      <path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H19v-5" />
    </>
  ),
  heart: <path d="M12 20.5s-8-4.8-8-10.6A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 8 2.7c0 5.8-8 10.6-8 10.6z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  circles: (
    <>
      <circle cx="9" cy="10" r="6" />
      <circle cx="15" cy="14" r="6" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />,
};

export default function Icon({ name, size = 22, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
