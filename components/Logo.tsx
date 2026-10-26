// Signe provisoire : un soleil posé sur un chemin, dans un carré arrondi.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Logo">
      <rect x="8" y="8" width="104" height="104" rx="30" fill="#3D3BD9" />
      <circle cx="60" cy="54" r="20" fill="#FFC233" />
      <path d="M26 86 Q60 66 94 86" stroke="#00C9B1" strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  );
}
