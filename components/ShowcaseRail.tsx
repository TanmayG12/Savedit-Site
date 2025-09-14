'use client'
import { useEffect, useRef } from 'react'
import { SavedCardMock } from './SavedCardMock'
import { ShareSheetMock } from './ShareSheetMock'
import { MapMock } from './MapMock'

export function ShowcaseRail() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number
    let x = 0
    let paused = false
    const step = () => {
      if (!paused) {
        x -= 0.3
        el.style.transform = `translateX(${x}px)`
        if (Math.abs(x) > el.scrollWidth / 3) x = 0
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return (
    <div className="overflow-hidden">
      <div className="flex gap-6 will-change-transform" ref={ref}>
        <SavedCardMock />
        <ShareSheetMock />
        <MapMock />
        <SavedCardMock />
        <ShareSheetMock />
      </div>
    </div>
  )
}
