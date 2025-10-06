"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { 
  FiSend, FiUser, FiCheckCircle, FiLoader
} from "react-icons/fi";
import { RiWhatsappFill } from "react-icons/ri";

export default function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      setStatus("⚠️ Le message est vide !");
      return;
    }

    setLoading(true);
    setStatus("⏳ Envoi du message...");

    const { error } = await supabase.from("messages").insert({ content: message });

    if (error) {
      console.error(error);
      setStatus("❌ Erreur lors de l'envoi du message.");
      setLoading(false);
    } else {
      setStatus("✅ Message envoyé avec succès !");
      setMessage("");
      setTimeout(() => {
        setStatus("");
      }, 3000);
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const text = "Bonjour ! Je souhaite discuter avec vous directement 💬";
    window.open(`https://wa.me/2290140856523?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black p-6 relative overflow-hidden text-white">
      {/* 🌌 Effets d’arrière-plan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.4),black)]"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Carte principale */}
      <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-8 w-full max-w-md z-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
          💬 Message Anonyme
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Partagez vos pensées en toute discrétion.
        </p>

        {/* Zone de saisie */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écris ton message ici..."
          rows={5}
          className="w-full bg-black/80 border border-zinc-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200 resize-none text-lg"
        />

        {/* Bouton d'envoi animé */}
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`mt-5 w-full py-3 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300
            ${
              loading
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
            }
          `}
        >
          {loading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : status.includes("✅") ? (
            <>
              <FiCheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
              Message envoyé !
            </>
          ) : (
            <>
              <FiSend className="w-5 h-5" />
              Envoyer anonymement
            </>
          )}
        </button>

        {/* Statut */}
        {status && (
          <p
            className={`mt-4 text-center text-sm font-medium p-3 rounded-lg transition-all duration-300 ${
              status.includes("✅")
                ? "text-green-400 bg-green-900/30 border border-green-700/30"
                : status.includes("❌")
                ? "text-red-400 bg-red-900/30 border border-red-700/30"
                : "text-yellow-400 bg-yellow-900/30 border border-yellow-700/30"
            }`}
          >
            {status}
          </p>
        )}
      </div>

      {/* Bouton WhatsApp */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transform transition-all duration-300 animate-bounce z-50 group"
      >
        <RiWhatsappFill className="w-6 h-6 text-white" />
        <div className="absolute right-full mr-3 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-zinc-700">
          Discuter sur WhatsApp
        </div>
      </button>

      {/* Footer */}
      <footer className="mt-10 text-gray-600 text-sm text-center z-10">
        <p className="flex items-center justify-center gap-2">
          <FiUser className="w-4 h-4" />
          Propulsé par Brandgrowthlabs — École des Webpreneurs
        </p>
      </footer>
    </main>
  );
}
