const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function handle(res) {
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch (_) {
      /* ignore */
    }
    throw new Error(detail)
  }
  return res.json()
}

export async function analyzeText(text) {
  const res = await fetch(`${API_BASE}/predict/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  return handle(res)
}

export async function analyzeAudio(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/predict/audio`, {
    method: 'POST',
    body: form,
  })
  return handle(res)
}

export async function analyzeVideo(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/predict/video`, {
    method: 'POST',
    body: form,
  })
  return handle(res)
}