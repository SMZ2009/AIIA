'use client'

import { cn } from '@/lib/utils'
import { type ReactNode, useState } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
  as?: 'div' | 'a' | 'button'
  href?: string
}

export function GlowCard({ children, className, glowColor = 'rgba(99,102,241,0.3)', onClick, as: Tag = 'div', href }: GlowCardProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const content = (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all duration-500',
        'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]',
        hovered && 'border-white/[0.15] scale-[1.01]',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 50, y: 50 }) }}
      onClick={onClick}
    >
      {/* 跟随鼠标的渐变光 */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: hovered ? 0.6 : 0,
          background: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 70%)`,
        }}
      />
      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  )

  if (Tag === 'a' && href) return <a href={href} className="block">{content}</a>
  if (Tag === 'button') return <button type="button" onClick={onClick} className="block w-full text-left">{content}</button>
  return content
}
