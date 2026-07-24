import { useEffect, useRef } from 'react'

// Full-page animated backdrop:
//  1. Soft ambient glow orbs (kept from the original design, slow drift).
//  2. A canvas layer with data-particles continuously falling top -> bottom.
//  3. A "blackhole" vortex in one corner -- particles spiral inward around a
//     glowing core, get consumed near the center, and respawn on the outer rim.
// Colors are read live from the CSS theme variables (--color-signal etc.) so
// the effect automatically matches light/dark mode without extra config.
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const readColor = (varName, fallback) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      if (!raw) return fallback
      return raw.split(/\s+/).map(Number)
    }

    let colors = {
      signal: readColor('--color-signal', [34, 211, 238]),
      positive: readColor('--color-positive', [45, 212, 191]),
      text: readColor('--color-text-primary', [236, 253, 250]),
    }

    // Re-read the palette whenever the theme class on <html> changes (dark/light toggle).
    const observer = new MutationObserver(() => {
      colors = {
        signal: readColor('--color-signal', [34, 211, 238]),
        positive: readColor('--color-positive', [45, 212, 191]),
        text: readColor('--color-text-primary', [236, 253, 250]),
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      vortex.cx = width * 0.86
      vortex.cy = height * 0.22
    }

    // ---- Blackhole / vortex ----
    const vortex = { cx: 0, cy: 0, coreRadius: 20 }

    resize()
    window.addEventListener('resize', resize)

    // ---- Falling particles ("data rain") ----
    const FALL_COUNT = prefersReducedMotion ? 0 : Math.min(70, Math.round((width * height) / 18000))
    function spawnFaller(randomY = false) {
      const useSignal = Math.random() > 0.5
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -20,
        len: 12 + Math.random() * 28,
        speed: 40 + Math.random() * 90, // px/sec
        thickness: 0.6 + Math.random() * 1.4,
        opacity: 0.15 + Math.random() * 0.35,
        color: useSignal ? colors.signal : colors.positive,
        drift: (Math.random() - 0.5) * 8,
      }
    }
    const fallers = Array.from({ length: FALL_COUNT }, () => spawnFaller(true))

    const VORTEX_COUNT = prefersReducedMotion ? 0 : 90
    function spawnVortexParticle(randomProgress = false) {
      const maxR = 260 + Math.random() * 60
      return {
        angle: Math.random() * Math.PI * 2,
        radius: randomProgress ? vortex.coreRadius + Math.random() * maxR : maxR,
        maxRadius: maxR,
        speed: 0.15 + Math.random() * 0.35,
        size: 0.8 + Math.random() * 1.8,
        color: Math.random() > 0.4 ? colors.signal : colors.text,
      }
    }
    const vortexParticles = Array.from({ length: VORTEX_COUNT }, () => spawnVortexParticle(true))

    let rafId
    let last = performance.now()

    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)

      // Falling data streaks
      for (const p of fallers) {
        p.y += p.speed * dt
        p.x += p.drift * dt
        const grad = ctx.createLinearGradient(p.x, p.y - p.len, p.x, p.y)
        grad.addColorStop(0, rgba(p.color, 0))
        grad.addColorStop(1, rgba(p.color, p.opacity))
        ctx.strokeStyle = grad
        ctx.lineWidth = p.thickness
        ctx.beginPath()
        ctx.moveTo(p.x, p.y - p.len)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        if (p.y - p.len > height + 20) {
          Object.assign(p, spawnFaller(false))
        }
      }

      // Blackhole vortex core glow
      if (VORTEX_COUNT > 0) {
        const coreGrad = ctx.createRadialGradient(
          vortex.cx, vortex.cy, 0,
          vortex.cx, vortex.cy, vortex.coreRadius * 7
        )
        coreGrad.addColorStop(0, rgba(colors.text, 0.65))
        coreGrad.addColorStop(0.15, rgba(colors.signal, 0.35))
        coreGrad.addColorStop(0.5, rgba(colors.signal, 0.08))
        coreGrad.addColorStop(1, rgba(colors.signal, 0))
        ctx.fillStyle = coreGrad
        ctx.beginPath()
        ctx.arc(vortex.cx, vortex.cy, vortex.coreRadius * 7, 0, Math.PI * 2)
        ctx.fill()

        // event-horizon ring
        ctx.strokeStyle = rgba(colors.signal, 0.25)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(vortex.cx, vortex.cy, vortex.coreRadius * 1.8, 0, Math.PI * 2)
        ctx.stroke()

        // orbiting particles spiraling inward
        for (const s of vortexParticles) {
          const angularSpeed = s.speed * (60 / Math.max(s.radius, 20))
          s.angle += angularSpeed * dt
          s.radius -= (18 / Math.max(s.radius, 30)) * dt * 14
          const x = vortex.cx + Math.cos(s.angle) * s.radius
          const y = vortex.cy + Math.sin(s.angle) * s.radius * 0.72 // slight ellipse
          const fade = Math.min(1, (s.maxRadius - s.radius) / s.maxRadius + 0.15)
          ctx.fillStyle = rgba(s.color, 0.5 * (1 - fade * 0.3))
          ctx.beginPath()
          ctx.arc(x, y, s.size, 0, Math.PI * 2)
          ctx.fill()

          if (s.radius <= vortex.coreRadius * 1.2) {
            Object.assign(s, spawnVortexParticle(false))
          }
        }
      }

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[-10%] left-[10%] h-[480px] w-[480px] rounded-full opacity-20 blur-3xl animate-drift1"
        style={{ background: 'radial-gradient(circle, rgb(var(--color-signal)) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-[30%] right-[5%] h-[420px] w-[420px] rounded-full opacity-[0.15] blur-3xl animate-drift2"
        style={{ background: 'radial-gradient(circle, rgb(var(--color-positive)) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-15%] left-[30%] h-[520px] w-[520px] rounded-full opacity-[0.12] blur-3xl animate-drift3"
        style={{ background: 'radial-gradient(circle, rgb(var(--color-signal)) 0%, transparent 70%)' }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
