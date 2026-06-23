'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; hue: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let animId: number
    let w = 0, h = 0

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
    }

    function createParticles() {
      const count = Math.floor((w * h) / 12000) // 自适应密度
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        hue: Math.random() > 0.7 ? 220 + Math.random() * 40 : (Math.random() > 0.5 ? 260 + Math.random() * 30 : 180 + Math.random() * 20),
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `hsla(${particles[i].hue}, 70%, 70%, ${0.06 * (1 - dist / 100)})`
            ctx!.lineWidth = 0.4
            ctx!.stroke()
          }
        }
      }

      // 绘制粒子
      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`
        ctx!.fill()

        // 光晕
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.15})`
        ctx!.fill()

        // 移动
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()
    window.addEventListener('resize', () => { resize(); createParticles() })

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}
