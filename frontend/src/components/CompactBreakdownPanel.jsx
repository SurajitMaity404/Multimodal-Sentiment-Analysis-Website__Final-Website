function accentFor(label) {
  if (/positive|happy|calm|surprised/i.test(label)) return 'text-positive'
  if (/negative|sad|angry|fearful|disgust/i.test(label)) return 'text-negative'
  return 'text-neutral'
}

// Generic compact score breakdown -- used for the video page's audio-track
// reading and the audio page's detailed emotion breakdown (both are just a
// label -> probability dict, with the "best" label derived from the max).
export default function CompactBreakdownPanel({ title, scores }) {
  if (!scores) return null

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const [bestLabel, bestValue] = sorted[0]

  return (
    <div className="rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-6 mt-6">
      <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-4">{title}</p>
      <p className={`font-display text-xl font-semibold mb-4 ${accentFor(bestLabel)}`}>
        {bestLabel}{' '}
        <span className="font-mono text-sm text-textSecondary font-normal">
          ({(bestValue * 100).toFixed(0)}%)
        </span>
      </p>
      <div className="space-y-2">
        {sorted.map(([label, value]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 font-mono text-xs text-textSecondary">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-ink overflow-hidden">
              <div
                className="h-full rounded-full bg-signal/70"
                style={{ width: `${(value * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-xs text-textSecondary">
              {(value * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}