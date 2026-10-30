import type { Metadata } from "next";
import NewPasswordForm from "@/components/NewPasswordForm";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

export default function NouveauMotDePassePage() {
  return (
    <>
      <div data-space="plateforme" hidden />
      <header>
        <h1>Nouveau mot de passe</h1>
      </header>
      <NewPasswordForm />
    </>
  );
}
