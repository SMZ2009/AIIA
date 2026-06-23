'use client'

import { useEffect, useState } from 'react'

interface GlowOrbProps {
  color: string
  size: number
  top?: string; left?: string; right?: string; bottom?: string
  delay?: number
  duration?: number
}

export function GlowOrb({ color, size, top, left, right, bottom, delay = 0, duration = 8 }: GlowOrbProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animId: number
    let t = delay * 60
    function animate() {
      t++
      setPos({
        x: Math.sin(t * 0.02 + delay) * 30,
        y: Math.cos(t * 0.025 + delay) * 30,
      })
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [delay])

  return (
    <div
      className="absolute rounded-full blur-[80px] pointer-events-none animate-pulse-glow"
      style={{
        width: size,
        height: size,
        background: color,
        top, left, right, bottom,
        opacity: 0.3,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.5s ease-out',
      }}
    />
  )
}
