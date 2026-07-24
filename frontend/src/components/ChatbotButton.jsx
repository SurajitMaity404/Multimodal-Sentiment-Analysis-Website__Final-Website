import { Bot } from "lucide-react";

export default function ChatbotButton() {
  return (
    <button
      onClick={() => {
        // Open chatbot page or modal
        window.location.href = "/support";
      }}
      className="group fixed bottom-8 right-8 z-[9999]"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-40 group-hover:opacity-80 transition-all animate-pulse"></div>

      {/* Button */}
      <div className="relative h-16 w-16 rounded-full border border-cyan-400/40 bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,.45)] hover:scale-110 transition-all duration-300">

        <Bot
          size={34}
          className="text-cyan-300 group-hover:rotate-12 transition"
        />

      </div>

      {/* Tooltip */}

      <div className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-cyan-400/20 bg-[#09111f]/90 px-4 py-2 text-sm text-cyan-300 opacity-0 group-hover:opacity-100 transition backdrop-blur-xl shadow-xl">

        AI Assistant

      </div>

    </button>
  );
}