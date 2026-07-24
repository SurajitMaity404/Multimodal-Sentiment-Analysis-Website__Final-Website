import { useEffect, useState } from 'react'
import { analyzeAudio } from '../api'
import SentimentResult from '../components/SentimentResult'
import CompactBreakdownPanel from '../components/CompactBreakdownPanel'
import UploadDropzone from '../components/UploadDropzone'
import MicRecorder from '../components/MicRecorder'

export default function AudioAnalysis() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [source, setSource] = useState('upload') // 'upload' | 'record'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeAudio(file)
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const tabClass = (tab) =>
    `px-4 py-2 rounded-md text-sm font-mono transition-colors ${
      source === tab ? 'bg-panel text-signal' : 'text-textSecondary hover:text-textPrimary'
    }`

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Model 02</p>
      <h1 className="font-display text-3xl font-semibold">Audio emotion analysis</h1>
      <p className="text-textSecondary mt-3 max-w-xl">
        A CNN trained on mel-spectrograms reads tone of voice and speaking style directly from the
        audio signal — works in any language since it never looks at the words. A separate
        transcript (auto-translated) powers the sarcasm check alongside it.
      </p>

      <div className="mt-10 flex gap-1 border-b border-panelBorder">
        <button
          className={tabClass('upload')}
          onClick={() => {
            setSource('upload')
            setFile(null)
            setResult(null)
          }}
        >
          Upload file
        </button>
        <button
          className={tabClass('record')}
          onClick={() => {
            setSource('record')
            setFile(null)
            setResult(null)
          }}
        >
          Record live
        </button>
      </div>

      <div className="mt-6">
        {source === 'upload' ? (
          <UploadDropzone
            accept="audio/*"
            file={file}
            onFileSelected={(f) => {
              setFile(f)
              setResult(null)
            }}
            hint="WAV · MP3 · M4A · FLAC · OGG · WEBM"
          />
        ) : (
          <MicRecorder
            onRecordingReady={(f) => {
              setFile(f)
              setResult(null)
            }}
          />
        )}

        {previewUrl && (
          <div className="mt-4 rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-4 flex items-center gap-3">
            <span className="font-mono text-xs text-textSecondary shrink-0">Preview</span>
            <audio src={previewUrl} controls className="w-full h-10" />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="px-6 py-2.5 rounded-xl bg-signal text-ink font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 hover:shadow-[0_0_30px_-8px_rgb(var(--color-signal)/0.5)] transition-all"
          >
            {loading ? 'Analyzing…' : 'Analyze audio'}
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-negative text-sm font-mono">{error}</p>}

      {result && (
        <div className="mt-12">
          <SentimentResult result={result} />
          {result.emotion_detail && (
            <CompactBreakdownPanel title="Detailed emotion breakdown" scores={result.emotion_detail} />
          )}
        </div>
      )}
    </div>
  )
}
