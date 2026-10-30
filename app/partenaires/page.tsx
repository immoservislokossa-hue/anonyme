import { redirect } from "next/navigation";

// Ancienne adresse du suivi des partenaires.
export default function PartenairesRedirect() {
  redirect("/pilotage");
}
