'use client'

import { useEffect, useRef } from 'react'

/** Cover stays fully visible above the controls until playback starts. The file waits until the player is near the viewport. */
export function ProjectVideo({ src, poster, label, className }) {
  const videoRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const frame = frameRef.current
    if (!video || !frame) return undefined
    const arm = () => {
      if (video.getAttribute('src')) return
      video.preload = 'none'
      video.src = src
    }
    const start = () => frame.classList.add('is-started')
    video.addEventListener('play', start)
    let io
    if (typeof IntersectionObserver !== 'function') arm()
    else {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          arm()
          io.disconnect()
        },
        { rootMargin: '240px 0px' },
      )
      io.observe(frame)
    }
    return () => {
      video.removeEventListener('play', start)
      io?.disconnect()
    }
  }, [src])

  return (
    <div className="hb-player" ref={frameRef}>
      <video
        ref={videoRef}
        className={className}
        controls
        playsInline
        width={1280}
        height={720}
        preload="none"
        poster={poster}
        loading="lazy"
        aria-label={label}
      />
      <img className="hb-player-poster" src={poster} alt="" />
    </div>
  )
}
