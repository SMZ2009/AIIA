'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  texts: string[]
  className?: string
  speed?: number
  pause?: number
}

export function TypewriterText({ texts, className, speed = 80, pause = 2500 }: TypewriterTextProps) {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const current = texts[textIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, speed)
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, speed / 2)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setTextIndex((textIndex + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, speed, pause])

  return (
    <span className={className}>
      {display}
      <span className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle animate-pulse" />
    </span>
  )
}
