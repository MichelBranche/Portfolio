import { useEffect, useRef } from 'react'

export function PreloaderCreepyButton({ label, ariaLabel, onClick }) {
  const eyesRef = useRef(null)
  const pupil0Ref = useRef(null)
  const pupil1Ref = useRef(null)
  const rafRef = useRef(null)
  const pendingEventRef = useRef(null)

  const flushEyes = () => {
    rafRef.current = null
    const e = pendingEventRef.current
    if (!e) return
    const userEvent = e.touches?.[0] ?? e
    const eyesRect = eyesRef.current?.getBoundingClientRect()
    if (!eyesRect) return
    const eyesCenter = {
      x: eyesRect.left + eyesRect.width / 2,
      y: eyesRect.top + eyesRect.height / 2,
    }
    const cursor = {
      x: userEvent.clientX,
      y: userEvent.clientY,
    }
    const dx = cursor.x - eyesCenter.x
    const dy = cursor.y - eyesCenter.y
    const angle = Math.atan2(-dy, dx) + Math.PI / 2
    const distance = Math.hypot(dx, dy)
    const visionRangeX = 180
    const visionRangeY = 75
    const x = Math.sin(angle) * (distance / visionRangeX)
    const y = Math.cos(angle) * (distance / visionRangeY)
    const t = `translate(${-50 + x * 50}%, ${-50 + y * 50}%)`
    if (pupil0Ref.current) pupil0Ref.current.style.transform = t
    if (pupil1Ref.current) pupil1Ref.current.style.transform = t
  }

  const updateEyes = (e) => {
    pendingEventRef.current = e
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(flushEyes)
  }

  useEffect(
    () => () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    },
    [],
  )

  return (
    <button
      type="button"
      className="preloader-creepy-btn"
      onClick={onClick}
      onMouseMove={updateEyes}
      onTouchMove={updateEyes}
      aria-label={ariaLabel || label}
    >
      <span className="preloader-creepy-btn__eyes" ref={eyesRef} aria-hidden>
        <span className="preloader-creepy-btn__eye">
          <span className="preloader-creepy-btn__pupil" ref={pupil0Ref} />
        </span>
        <span className="preloader-creepy-btn__eye">
          <span className="preloader-creepy-btn__pupil" ref={pupil1Ref} />
        </span>
      </span>
      <span className="preloader-creepy-btn__cover">{label}</span>
    </button>
  )
}
