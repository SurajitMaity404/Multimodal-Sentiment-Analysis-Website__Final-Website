import { useState } from 'react'
import { analyzeText } from '../api'
import SentimentResult from '../components/SentimentResult'

export default function TextAnalysis() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeText(text.trim())
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Model 01</p>
      <h1 className="font-display text-3xl font-semibold">Text sentiment analysis</h1>
      <p className="text-textSecondary mt-3 max-w-xl">
        bert-base-uncased fine-tuned for sentiment classification. Non-English text is
        auto-translated before analysis.
      </p>

      <div className="mt-10">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Type or paste text to analyze..."
          className="w-full rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-4 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-signal focus:shadow-[0_0_40px_-12px_rgb(var(--color-signal)/0.35)] resize-none font-body transition-all"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-xs text-textSecondary">{text.length} / 5000</span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="px-6 py-2.5 rounded-xl bg-signal text-ink font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 hover:shadow-[0_0_30px_-8px_rgb(var(--color-signal)/0.5)] transition-all"
          >
            {loading ? 'Analyzing…' : 'Analyze text'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 text-negative text-sm font-mono">{error}</p>
      )}

      {result && (
        <div className="mt-12">
          <SentimentResult result={result} />
        </div>
      )}
    </div>
  )
}