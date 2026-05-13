'use client'

import { useEffect, useRef } from 'react'

function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const BASE_COLOR = [26, 107, 58]

    type Particle = {
      x: number
      y: number
      radius: number
      phase: number
      speed: number
      drift: number
      distFromCenter: number
    }

    const buildParticles = (): Particle[] => {
      const particles: Particle[] = []
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const cx = width / 2
      const cy = height * 0.46
      const maxDist = Math.sqrt(cx * cx + height * height)
      const count = Math.max(28, Math.floor(width / 24))

      for (let i = 0; i < count; i++) {
        const side = i % 2 === 0 ? 'left' : 'right'
        const edgeX = side === 'left'
          ? Math.random() * width * 0.32
          : width - Math.random() * width * 0.32
        const y = Math.random() * height
        const dx = edgeX - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        particles.push({
          x: edgeX,
          y,
          radius: 12 + Math.random() * 28,
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.45,
          drift: 6 + Math.random() * 16,
          distFromCenter: dist / maxDist,
        })
      }

      return particles
    }

    resize()
    let particles = buildParticles()

    const handleResize = () => {
      resize()
      particles = buildParticles()
    }
    window.addEventListener('resize', handleResize)

    let frame = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = frame * 0.012
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.save()
      ctx.filter = 'blur(14px)'
      ctx.lineCap = 'round'

      for (let i = 0; i < 5; i++) {
        const y = height * (0.18 + i * 0.16) + Math.sin(t * 0.8 + i * 1.7) * 18
        const wave = Math.sin(t * 0.7 + i) * 80
        const opacity = 0.09 + Math.sin(t * 0.9 + i * 0.8) * 0.025

        ctx.beginPath()
        ctx.moveTo(-120, y)
        ctx.bezierCurveTo(
          width * 0.25,
          y - 90 + wave,
          width * 0.7,
          y + 95 - wave,
          width + 120,
          y + Math.cos(t + i) * 35
        )
        ctx.strokeStyle = `rgba(${BASE_COLOR[0]}, ${BASE_COLOR[1]}, ${BASE_COLOR[2]}, ${opacity})`
        ctx.lineWidth = 30 + i * 4
        ctx.stroke()
      }

      ctx.restore()

      for (const particle of particles) {
        const edgeFactor = Math.max(0, (particle.distFromCenter - 0.18) / 0.82)
        const pulse = Math.sin(t * particle.speed + particle.phase) * 0.5 + 0.5
        const opacity = edgeFactor * (0.08 + pulse * 0.14)

        if (opacity < 0.015) continue

        const x = particle.x + Math.cos(t * particle.speed + particle.phase) * particle.drift * edgeFactor
        const y = particle.y + Math.sin(t * particle.speed + particle.phase) * particle.drift * edgeFactor
        const radius = particle.radius * (0.9 + pulse * 0.25)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

        gradient.addColorStop(0, `rgba(${BASE_COLOR[0]}, ${BASE_COLOR[1]}, ${BASE_COLOR[2]}, ${opacity})`)
        gradient.addColorStop(0.55, `rgba(${BASE_COLOR[0]}, ${BASE_COLOR[1]}, ${BASE_COLOR[2]}, ${opacity * 0.35})`)
        gradient.addColorStop(1, `rgba(${BASE_COLOR[0]}, ${BASE_COLOR[1]}, ${BASE_COLOR[2]}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#F0F9F2',
        paddingTop: '88px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '520px',
      }}
    >
      {/* LAYER 0: Animated soft background — full section behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 1: Radial fade overlay — keeps the center clean where text lives */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            ellipse 58% 48% at 50% 45%,
            #F0F9F2 0%,
            rgba(240, 249, 242, 0.96) 24%,
            rgba(240, 249, 242, 0.62) 48%,
            rgba(240, 249, 242, 0.16) 70%,
            transparent 100%
          )`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 2: All hero content — fully above dots and overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #C4E0CA',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '28px',
            boxShadow: '0 1px 6px rgba(26,107,58,0.08)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#1A6B3A',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1A6B3A',
              letterSpacing: '0.1px',
            }}
          >
            47 Free Tools — No Signup Required
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: 'clamp(38px, 5.5vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            marginBottom: '20px',
          }}
        >
          <span style={{ color: '#0A2415', display: 'block' }}>
            Every tool a student
          </span>
          <span style={{ color: '#1A6B3A', display: 'block' }}>
            actually needs.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '17px',
            color: '#4A6B55',
            lineHeight: 1.65,
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto 32px',
            fontWeight: 400,
          }}
        >
          PDF, image, developer, and university utilities. All run in
          your browser. Your files never leave your device.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '44px',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              background: '#1A6B3A',
              color: '#fff',
              border: 'none',
              borderRadius: '9px',
              padding: '13px 26px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.2px',
              boxShadow: '0 2px 12px rgba(26,107,58,0.25)',
            }}
          >
            Browse Tools →
          </button>

          <button
            style={{
              background: '#FFFFFF',
              color: '#1A6B3A',
              border: '1.5px solid #B8D9BF',
              borderRadius: '9px',
              padding: '13px 26px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            How it works ↓
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { num: '47',    label: 'Tools'   },
            { num: '0',     label: 'Uploads' },
            { num: '100%',  label: 'Private' },
            { num: 'Free',  label: 'Forever' },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0A2415',
                    fontFamily: 'var(--font-bricolage)',
                  }}
                >
                  {stat.num}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#4A6B55',
                    fontWeight: 400,
                  }}
                >
                  {stat.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: '#B8D9BF', fontSize: '16px' }}>·</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Hero
export { Hero }
