import { Link } from 'react-router-dom'
import { Type, Mic, Video as VideoIcon, ArrowUpRight, Globe2 } from 'lucide-react'

const modalities = [
  {
    to: '/text',
    label: 'Text',
    icon: Type,
    model: 'bert-base-uncased · 3-class · multilingual',
    desc: 'Paste any sentence or paragraph, in any language, and get a Negative / Neutral / Positive read.',
  },
  {
    to: '/audio',
    label: 'Audio',
    icon: Mic,
    model: 'Mel-spectrogram CNN · 3-class · multilingual',
    desc: 'Upload a clip or record live — reads tone of voice and speaking style directly for a Negative / Neutral / Positive call, plus an 8-emotion breakdown and sarcasm detection.',
  },
  {
    to: '/video',
    label: 'Video',
    icon: VideoIcon,
    model: 'ResNet-18 (face-cropped) · 3-class',
    desc: 'Upload a short clip — visual imagery (cropped to the face) is read for a Negative / Neutral / Positive call, with a separate acoustic emotion read on the audio track.',
  },
]

export default function Home() {
  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--color-signal)) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto px-6 py-20 relative">
        <div className="flex items-center gap-2 mb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            Multimodal sentiment analysis
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-textSecondary border border-panelBorder rounded-full px-2 py-0.5">
            <Globe2 size={11} /> multilingual
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-tight">
          Three signals. One read on how people really feel.
        </h1>
        <p className="text-textSecondary mt-6 max-w-xl leading-relaxed">
          Signalis runs your text, audio, or video through a dedicated trained model and shows you
          the class distribution — as a pie and a bar chart — plus the strongest sentiment call.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {modalities.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.to}
                to={m.to}
                className="group rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-6 hover:border-signal/60 hover:shadow-[0_0_40px_-14px_rgb(var(--color-signal)/0.35)] hover:-translate-y-0.5 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-ink border border-panelBorder flex items-center justify-center group-hover:border-signal/50 transition-colors">
                    <Icon size={18} className="text-signal" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-textSecondary group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <span className="font-mono text-xs text-textSecondary mt-4">{m.model}</span>
                <span className="font-display text-2xl font-semibold mt-1 group-hover:text-signal transition-colors">
                  {m.label}
                </span>
                <p className="text-sm text-textSecondary mt-3 leading-relaxed flex-1">{m.desc}</p>
              </Link>
            )
          })}
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
  )
}