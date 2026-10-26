// Deux cercles qui se rejoignent : l'espace commun est le soleil.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Logo">
      <defs>
        <clipPath id="logo-overlap">
          <circle cx="48" cy="54" r="27" />
        </clipPath>
      </defs>
      <rect x="8" y="8" width="104" height="104" rx="30" fill="#3D3BD9" />
      <circle cx="48" cy="54" r="27" fill="#00C9B1" />
      <circle cx="72" cy="66" r="27" fill="#FFFFFF" />
      <g clipPath="url(#logo-overlap)">
        <circle cx="72" cy="66" r="27" fill="#FFC233" />
      </g>
    </svg>
  );
}
