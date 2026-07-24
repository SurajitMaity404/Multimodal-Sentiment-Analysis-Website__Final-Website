import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// Ordered palette applied by label rank so charts stay visually consistent
// whether there are 3 classes (text/video) or 8 (audio). Recharts needs real
// color values in JS (not CSS variables), so dark/light variants are defined
// explicitly and picked based on the active theme.
const PALETTE_DARK = ['#F2617A', '#E8895A', '#22D3EE', '#E8C15A', '#94A3B8', '#6FD6C4', '#2DD4BF', '#5EEAD4']
const PALETTE_LIGHT = ['#E11D48', '#C2670E', '#0E7490', '#B45309', '#64748B', '#0D9488', '#0F766E', '#0891B2']

const CHART_THEME = {
  dark: { panel: '#0C1618', border: '#162A2E', text: '#ECFDFA', secondary: '#94A3B8', cursor: 'rgba(34,211,238,0.08)' },
  light: { panel: '#FFFFFF', border: '#E2E8F0', text: '#0F172A', secondary: '#475569', cursor: 'rgba(8,145,178,0.06)' },
}

function accentFor(label) {
  if (/positive|happy|calm|surprised/i.test(label)) return 'positive'
  if (/negative|sad|angry|fearful|disgust/i.test(label)) return 'negative'
  return 'neutral'
}

const ACCENT_ICON = { positive: TrendingUp, negative: TrendingDown, neutral: Minus }

export default function SentimentResult({ result }) {
  const { theme } = useTheme()
  if (!result) return null

  const palette = theme === 'dark' ? PALETTE_DARK : PALETTE_LIGHT
  const chartColors = CHART_THEME[theme]

  const data = Object.entries(result.scores)
    .map(([label, value]) => ({ name: label, value: Number((value * 100).toFixed(2)) }))
    .sort((a, b) => b.value - a.value)

  const accent = accentFor(result.best_sentiment)
  const accentClass = { positive: 'text-positive', negative: 'text-negative', neutral: 'text-neutral' }[accent]
  const barClass = { positive: 'bg-positive', negative: 'bg-negative', neutral: 'bg-neutral' }[accent]
  const glowClass = {
    positive: 'shadow-[0_0_40px_-12px_rgb(var(--color-positive)/0.35)] border-positive/30',
    negative: 'shadow-[0_0_40px_-12px_rgb(var(--color-negative)/0.35)] border-negative/30',
    neutral: 'shadow-[0_0_40px_-12px_rgb(var(--color-neutral)/0.25)] border-neutral/30',
  }[accent]
  const iconBgClass = {
    positive: 'bg-positive/10 border-positive/30',
    negative: 'bg-negative/10 border-negative/30',
    neutral: 'bg-neutral/10 border-neutral/30',
  }[accent]
  const AccentIcon = ACCENT_ICON[accent]

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className={`rounded-2xl border bg-panel/80 backdrop-blur p-6 md:p-8 mb-6 ${glowClass}`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 shrink-0 rounded-xl border flex items-center justify-center ${iconBgClass}`}>
              <AccentIcon size={22} className={accentClass} strokeWidth={2} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-1">
                Best sentiment
              </p>
              <p className={`font-display text-4xl font-semibold ${accentClass}`}>{result.best_sentiment}</p>
            </div>
          </div>
          <div className="md:w-64">
            <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-2">
              Confidence
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-ink overflow-hidden">
                <div
                  className={`h-full rounded-full ${barClass} transition-all duration-700`}
                  style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                />
              </div>
              <span className="font-mono text-sm text-textPrimary">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {result.transcript !== null && result.transcript !== undefined && (
          <div className="mt-6 pt-6 border-t border-panelBorder">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs uppercase tracking-widest text-textSecondary">
                Auto-transcript
                {result.detected_language && result.detected_language !== 'en' && (
                  <span className="text-signal"> · detected: {result.detected_language}</span>
                )}
              </p>
              {result.sarcasm && (
                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded-full border ${
                    result.sarcasm.label === 'Sarcastic'
                      ? 'border-signal/40 text-signal bg-signal/10'
                      : 'border-panelBorder text-textSecondary'
                  }`}
                >
                  {result.sarcasm.label} · {(result.sarcasm.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-sm text-textSecondary italic leading-relaxed">
              {result.transcript ? `"${result.transcript}"` : 'No speech detected.'}
            </p>
            {result.translated_text && (
              <p className="text-xs text-textSecondary/70 mt-2 italic leading-relaxed">
                Translated for analysis: "{result.translated_text}"
              </p>
            )}
          </div>
        )}

        {result.detected_language && result.detected_language !== 'en' && !result.transcript && (
          <div className="mt-6 pt-6 border-t border-panelBorder">
            <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-2">
              Detected language: <span className="text-signal">{result.detected_language}</span>
            </p>
            {result.translated_text && (
              <p className="text-sm text-textSecondary italic leading-relaxed">
                Translated for analysis: "{result.translated_text}"
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-4">
            Class distribution — pie
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} stroke={chartColors.panel} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: chartColors.panel, border: `1px solid ${chartColors.border}`, borderRadius: 8 }}
                labelStyle={{ color: chartColors.text }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: chartColors.secondary }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-textSecondary mb-4">
            Class distribution — bar
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={chartColors.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: chartColors.secondary }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 11, fill: chartColors.secondary, fontFamily: 'JetBrains Mono' }}
              />
              <Tooltip
                contentStyle={{ background: chartColors.panel, border: `1px solid ${chartColors.border}`, borderRadius: 8 }}
                labelStyle={{ color: chartColors.text }}
                formatter={(value) => [`${value}%`, '']}
                cursor={{ fill: chartColors.cursor }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}