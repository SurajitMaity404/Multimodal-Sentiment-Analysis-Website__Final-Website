import { Link } from "react-router-dom";

export default function DashBoard() {
  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">

      <div className="text-center max-w-3xl">

        <p className="font-mono uppercase tracking-[0.35em] text-signal text-sm">
          AI • MULTIMODAL • SENTIMENT ANALYSIS
        </p>

        <h1 className="font-display text-7xl font-bold mt-6">
          Signal<span className="text-signal">is</span>
        </h1>

        <p className="text-textSecondary text-lg mt-8 leading-8">
          Understand emotions from text, audio, and video using powerful
          AI models designed for fast and accurate multimodal sentiment analysis.
        </p>

        <div className="flex justify-center gap-5 mt-12">

          <Link
            to="/login"
            className="px-8 py-3 rounded-xl bg-signal text-ink font-semibold hover:brightness-110 transition-all"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl border border-panelBorder hover:border-signal text-textPrimary transition-all"
          >
            Sign Up
          </Link>

        </div>
        <footer className="mt-24 border-t border-panelBorder">

  <div className="py-10 flex flex-col items-center">

    <h3 className="font-display text-2xl font-bold">
      Signal<span className="text-signal">is</span>
    </h3>

    <p className="text-textSecondary text-sm mt-2">
      AI-Powered Multimodal Sentiment Analysis
    </p>

    <div className="flex items-center gap-8 mt-8 text-sm">

      <Link
        to="/aboutus"
        className="text-textSecondary hover:text-signal transition-colors"
      >
        About Us
      </Link>

      <Link
        to="/faqs"
        className="text-textSecondary hover:text-signal transition-colors"
      >
        FAQs
      </Link>

      <Link
        to="/contactus"
        className="text-textSecondary hover:text-signal transition-colors"
      >
        Contact Us
      </Link>

    </div>

    <p className="text-xs text-textSecondary mt-8 opacity-70">
      © 2026 Signalis. All rights reserved.
    </p>

  </div>

</footer>

      </div>

    </div>
  );
}