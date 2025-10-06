"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { 
  FiSend, 
  FiMessageSquare, 
  FiUser,
  FiHeart,
  FiShare2,
  FiMail,
  FiPhone
} from "react-icons/fi";
import { 
  RiWhatsappFill,
  RiSendPlaneFill,
  RiEmotionLine,
  RiSparkling2Line
} from "react-icons/ri";

export default function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      setStatus("⚠️ Le message est vide !");
      return;
    }

    const { error } = await supabase.from("messages").insert({ content: message });
    if (error) {
      console.error(error);
      setStatus("❌ Erreur lors de l'envoi du message.");
    } else {
      setStatus("✅ Message envoyé anonymement !");
      setMessage("");
    }
  };

  const openWhatsApp = () => {
    const text = "Bonjour ! Je souhaite discuter avec vous directement 💬";
    window.open(`https://wa.me/2290140856523?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
   
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/10 via-slate-900/10 to-slate-900"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-3xl blur-3xl rotate-12 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-3xl blur-3xl -rotate-12 animate-float-delayed"></div>

      {/* Profile Section */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-105"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/emmaking.png"
                alt="Votre photo"
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="text-left">
              <h2 className="text-white font-semibold text-lg">Emmanuel ADJOU - Stratège et Dev</h2>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                En ligne
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 max-w-md w-full transform hover:scale-[1.02] transition-all duration-300">
        {/* Header with Icons */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Message Anonyme
            </h1>
                </div>
          <p className="text-slate-300 text-lg flex items-center justify-center gap-2">
            <RiEmotionLine className="w-5 h-5" />
            Partagez ce que vous avez sur le cœur
          </p>
        </div>

        {/* Message Input */}
        <div className="relative mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=" Exprimez-vous librement..."
            rows={5}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-200 resize-none text-lg pr-12"
          />
          <FiMessageSquare className="absolute top-4 right-4 w-6 h-6 text-slate-400" />
        </div>


        {/* Send Button */}
        <button
          onClick={sendMessage}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl transform hover:scale-[1.02] transition-all duration-200 shadow-xl hover:shadow-blue-500/20 relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isHovering ? (
              <>
                <RiSendPlaneFill className="w-5 h-5 animate-pulse" />
                <span className="text-lg">Envoyer le message</span>
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5" />
                <span className="text-lg">Envoyer anonymement</span>
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>

        {/* Status Message */}
        {status && (
          <div className={`mt-6 p-4 rounded-2xl text-center font-medium border transition-all duration-300 flex items-center justify-center gap-3 ${
            status.includes("✅") 
              ? "bg-emerald-900/20 text-emerald-300 border-emerald-500/30" 
              : status.includes("❌")
              ? "bg-rose-900/20 text-rose-300 border-rose-500/30"
              : "bg-amber-900/20 text-amber-300 border-amber-500/30"
          }`}>
            {status.includes("✅") && <FiMail className="w-5 h-5" />}
            {status.includes("❌") && <FiMail className="w-5 h-5" />}
            {status.includes("⚠️") && <FiMail className="w-5 h-5" />}
            {status}
          </div>
        )}
      </div>

      {/* Contact Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transform transition-all duration-300 group relative"
        >
          <RiWhatsappFill className="w-7 h-7 text-white" />
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-x-2 group-hover:translate-x-0 border border-slate-700">
            Discuter sur WhatsApp
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 transform -translate-y-1/2 rotate-45 border-r border-b border-slate-700"></div>
          </div>
        </button>

    
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
          <FiUser className="w-4 h-4" />
          Propulsé par Brandgrowthlabs - Ecole des Weebpreneurs
        </p>
      </footer>
    </main>
  );
}