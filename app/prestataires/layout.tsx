import Link from "next/link";

export default function PrestatairesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b2b">
      <div data-space="prestataires" hidden />
      <p className="b2b-banner">Alviosa Prestataires : outil d'aide au conseil. Il ne remplace ni le protocole national, ni ton jugement de professionnel. <Link href="/connexion">Se connecter</Link></p>
      {children}
    </div>
  );
}
