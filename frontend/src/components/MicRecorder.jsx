import { useRef, useState, useEffect } from 'react'

export default function MicRecorder({ onRecordingReady }) {
  const [status, setStatus] = useState('idle') // idle | recording | recorded
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        onRecordingReady(file)
        setStatus('recorded')
        stream.getTracks().forEach((t) => t.stop())
      }

      recorder.start()
      setStatus('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (e) {
      setError('Microphone access was denied or unavailable.')
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
  }

  const reset = () => {
    setStatus('idle')
    setSeconds(0)
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="rounded-2xl border border-panelBorder bg-panel/80 backdrop-blur p-6 flex flex-col items-center gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-textSecondary">
        Live microphone test
      </p>

      <div className="relative flex items-center justify-center h-20 w-20">
        {status === 'recording' && (
          <span className="absolute inset-0 rounded-full bg-negative/30 animate-ping" />
        )}
        <button
          onClick={status === 'recording' ? stopRecording : startRecording}
          className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
            status === 'recording' ? 'bg-negative' : 'bg-signal hover:brightness-110'
          }`}
          aria-label={status === 'recording' ? 'Stop recording' : 'Start recording'}
        >
          {status === 'recording' ? (
            <span className="h-4 w-4 rounded-sm bg-ink" />
          ) : (
            <span className="h-4 w-4 rounded-full bg-ink" />
          )}
        </button>
      </div>

      <p className="font-mono text-sm text-textPrimary">
        {status === 'idle' && 'Tap to record'}
        {status === 'recording' && `Recording ${mm}:${ss}`}
        {status === 'recorded' && `Captured ${mm}:${ss} — ready to analyze`}
      </p>

      {status === 'recorded' && (
        <button onClick={reset} className="text-xs font-mono text-textSecondary hover:text-signal underline">
          Record again
        </button>
      )}

      {error && <p className="text-negative text-xs font-mono">{error}</p>}
    </div>
  )
}