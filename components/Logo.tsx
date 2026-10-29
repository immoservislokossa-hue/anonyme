// Deux cercles qui se rejoignent : l'espace commun est le soleil.
// Le croissant jaune est un tracé direct (sans clipPath), pour pouvoir afficher plusieurs logos par page.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Logo">
      <rect x="8" y="8" width="104" height="104" rx="30" fill="#C2185B" />
      <circle cx="48" cy="54" r="27" fill="#00C9B1" />
      <circle cx="72" cy="66" r="27" fill="#FFFFFF" />
      <path d="M70.48 39.05 A27 27 0 0 1 49.52 80.96 A27 27 0 0 1 70.48 39.05 Z" fill="#FFC233" />
    </svg>
  );
}
