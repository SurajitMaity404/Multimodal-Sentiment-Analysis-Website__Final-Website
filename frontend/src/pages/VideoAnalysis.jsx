import { useEffect, useState } from 'react'
import { analyzeVideo } from '../api'
import SentimentResult from '../components/SentimentResult'
import CompactBreakdownPanel from '../components/CompactBreakdownPanel'
import UploadDropzone from '../components/UploadDropzone'

export default function VideoAnalysis() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
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
      const res = await analyzeVideo(file)
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Model 03</p>
      <h1 className="font-display text-3xl font-semibold">Video sentiment analysis</h1>
      <p className="text-textSecondary mt-3 max-w-xl">
        Frames are sampled, cropped to the detected face, and read through a ResNet-18 backbone for
        a Negative / Neutral / Positive call. The audio track is separately analyzed for acoustic
        emotion.
      </p>

      <div className="mt-10">
        <UploadDropzone
          accept="video/*"
          file={file}
          onFileSelected={(f) => {
            setFile(f)
            setResult(null)
          }}
          hint="MP4 · MOV · AVI · MKV · WEBM"
        />

        {previewUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-panelBorder bg-panel/80">
            <video src={previewUrl} controls className="w-full max-h-96 bg-ink" />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="px-6 py-2.5 rounded-xl bg-signal text-ink font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 hover:shadow-[0_0_30px_-8px_rgb(var(--color-signal)/0.5)] transition-all"
          >
            {loading ? 'Sampling frames & analyzing…' : 'Analyze video'}
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-negative text-sm font-mono">{error}</p>}

      {result && (
        <div className="mt-12">
          <SentimentResult result={result} />
          {result.audio_track && (
            <CompactBreakdownPanel
              title="Audio track — acoustic emotion read"
              scores={result.audio_track.scores}
            />
          )}
        </div>
      )}
    </div>
  )
}