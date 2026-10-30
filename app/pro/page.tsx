import { redirect } from "next/navigation";

// Ancienne adresse de l'espace agent de santé.
export default function ProRedirect() {
  redirect("/prestataires");
}
