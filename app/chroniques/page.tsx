import { redirect } from "next/navigation";

// Page regroupée : on garde l'ancienne adresse pour les liens déjà partagés.
export default function Page() {
  redirect("/apprendre?onglet=serie");
}
