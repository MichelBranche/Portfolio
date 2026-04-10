/**
 * Card music player UI — adapted from CodePen “Card Music Player” (mprquinn / LrxVob),
 * Dribbble-inspired layout. Parallax: rAF lerp (no RxJS). Decorative controls.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'

const COVER_URL =
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/36124/grouper-grid-of-points.jpg'

function lerp2(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export default function CollabMusicCard() {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const rootRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [parallaxOn, setParallaxOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const targetRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const visibleRef = useRef(true)

  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Sync playing state with actual audio
  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [playing])

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const onScrub = (e) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current && duration) {
      const newTime = (val / 100) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time) => {
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const updatePointer = useCallback((clientX, clientY) => {
    const limit = { x: 16, y: 16 }
    const w = window.innerWidth || 1
    const h = window.innerHeight || 1
    targetRef.current = {
      x: (clientX / w) * limit.x - limit.x / 2,
      y: (clientY / h) * limit.y - limit.y / 2,
    }
  }, [])

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = requestAnimationFrame(() => setLoaded(true))
    const tParallax = reduce
      ? null
      : window.setTimeout(() => setParallaxOn(true), 1200)

    const el = rootRef.current
    const io =
      el &&
      new IntersectionObserver(
        ([e]) => {
          visibleRef.current = e?.isIntersecting ?? true
        },
        { root: null, threshold: 0.08 }
      )
    if (el && io) io.observe(el)

    return () => {
      cancelAnimationFrame(id)
      if (tParallax) window.clearTimeout(tParallax)
      io?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!parallaxOn) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const onMove = (e) => updatePointer(e.clientX, e.clientY)
    const onTouch = (e) => {
      if (e.touches?.[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY)
    }

    const tick = () => {
      const root = rootRef.current
      if (root && visibleRef.current) {
        smoothRef.current = lerp2(smoothRef.current, targetRef.current, 0.12)
        root.style.setProperty('--cm-move-x', `${smoothRef.current.x}deg`)
        root.style.setProperty('--cm-move-y', `${smoothRef.current.y}deg`)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [parallaxOn, updatePointer])

  const cardClass = [
    'collab-music-card',
    loaded && 'collab-music-card--loaded',
    parallaxOn && 'collab-music-card--parallax',
  ]
    .filter(Boolean)
    .join(' ')

  const albumLine = t.layout_collab_music_album

  return (
    <div
      ref={rootRef}
      className="home-collab-music"
      aria-label={t.layout_collab_music_aria}
    >
      <audio 
        ref={audioRef}
        src="/assets/music/track1.mp3"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setPlaying(false)}
      />

      <div className={cardClass}>
        <svg
          className="collab-music-card__menu"
          height="12"
          viewBox="0 0 18 12"
          width="18"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,12 L18,12 L18,10 L0,10 L0,12 L0,12 Z M0,7 L18,7 L18,5 L0,5 L0,7 L0,7 Z M0,0 L0,2 L18,2 L18,0 L0,0 L0,0 Z"
          />
        </svg>

        <div className="collab-music-card__reflection" aria-hidden />

        <div className="collab-music-card__player">
          <div className="collab-music-card__song">
            <h3 className="collab-music-card__album">
              <span className="sr-only">{albumLine}</span>
              <span className="collab-music-card__marquee" aria-hidden>
                <span className="collab-music-card__marquee-inner">
                  <span>{albumLine}</span>
                  <span>{albumLine}</span>
                </span>
              </span>
            </h3>
            <p className="collab-music-card__title">{t.layout_collab_music_title}</p>
            <p className="collab-music-card__position">{t.layout_collab_music_position}</p>
          </div>

          <div className="collab-music-card__controls">
            <svg
              className="collab-music-card__prev"
              height="12"
              viewBox="0 0 18 12"
              width="18"
              aria-hidden
              style={{ cursor: 'pointer' }}
              onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0 }}
            >
              <path
                fill="currentColor"
                d="M0,12 L8.5,6 L0,0 L0,12 L0,12 Z M9,0 L9,12 L17.5,6 L9,0 L9,0 Z"
              />
            </svg>

            <button
              type="button"
              className={`collab-music-card__play-btn${playing ? ' is-playing' : ''}`}
              aria-pressed={playing}
              aria-label={t.layout_collab_music_play_label}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? (
                <svg height="20" viewBox="0 0 24 24" width="20" aria-hidden>
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="collab-music-card__play"
                  height="20"
                  viewBox="0 0 48 48"
                  width="20"
                  aria-hidden
                >
                  <path d="M16 10v28l22-14z" fill="currentColor" />
                </svg>
              )}
            </button>

            <svg
              className="collab-music-card__next"
              height="12"
              viewBox="0 0 18 12"
              width="18"
              aria-hidden
              style={{ opacity: 0.3 }}
            >
              <path
                fill="currentColor"
                d="M0,12 L8.5,6 L0,0 L0,12 L0,12 Z M9,0 L9,12 L17.5,6 L9,0 L9,0 Z"
              />
            </svg>
          </div>

          <div className="collab-music-card__scrubber" aria-hidden>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={onScrub}
              className="collab-music-card__range"
              style={{ pointerEvents: 'auto' }}
            />
            <div className="collab-music-card__times">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : t.layout_collab_music_time_end}</span>
            </div>
          </div>
        </div>

        <div
          className="collab-music-card__art"
          style={{ backgroundImage: `url(/assets/covers/cover1.jpg)`, backgroundSize: 'cover' }}
          role="presentation"
          aria-hidden
          onError={(e) => { e.target.style.backgroundImage = `url(${COVER_URL})` }}
        />

        <div className="collab-music-card__avatar" aria-hidden>
          MB
        </div>

        <div className="collab-music-card__interactions" aria-hidden>
          <span className="collab-music-card__icon-btn collab-music-card__like">
            <svg height="12" viewBox="0 0 128 128" width="12">
              <path
                fill="currentColor"
                d="M127,44.205c0-18.395-14.913-33.308-33.307-33.308c-12.979,0-24.199,7.441-29.692,18.276  c-5.497-10.835-16.714-18.274-29.694-18.274C15.912,10.898,1,25.81,1,44.205C1,79,56.879,117.104,64.001,117.104  C71.124,117.104,127,79.167,127,44.205z"
              />
            </svg>
          </span>
          <span className="collab-music-card__icon-btn collab-music-card__add">
            <svg height="12" viewBox="0 0 24 24" width="12">
              <path
                fill="currentColor"
                d="M22.5,14H14v8.5c0,0.276-0.224,0.5-0.5,0.5h-4C9.224,23,9,22.776,9,22.5V14H0.5  C0.224,14,0,13.776,0,13.5v-4C0,9.224,0.224,9,0.5,9H9V0.5C9,0.224,9.224,0,9.5,0h4C13.776,0,14,0.224,14,0.5V9h8.5  C22.776,9,23,9.224,23,9.5v4C23,13.776,22.776,14,22.5,14z"
              />
            </svg>
          </span>
        </div>

        <svg
          className="collab-music-card__volume"
          viewBox="0 0 512 512"
          width="20"
          height="20"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M114.8,368.1H32.1c-5.8,0-10.5-4.7-10.5-10.5V154.4c0-5.8,4.7-10.5,10.5-10.5h82.7   c5.8,0,10.5,4.7,10.5,10.5v203.2C125.4,363.4,120.7,368.1,114.8,368.1z M42.7,347.1h61.6V165H42.7V347.1z M303.7,512c-2.3,0-4.5-0.7-6.4-2.2L108.4,366c-2.6-2-4.2-5.1-4.2-8.4V154.4c0-3.3,1.5-6.4,4.2-8.4   L297.3,2.2c3.2-2.4,7.5-2.8,11.1-1.1c3.6,1.8,5.9,5.4,5.9,9.5v490.9c0,4-2.3,7.7-5.9,9.5C306.8,511.6,305.2,512,303.7,512z    M125.4,352.4l167.7,127.8V31.8L125.4,159.6V352.4z M393.6,334.9c-5.8,0-10.5-4.7-10.5-10.5V187.7c0-5.8,4.7-10.5,10.5-10.5c5.8,0,10.5,4.7,10.5,10.5v136.7   C404.1,330.2,399.4,334.9,393.6,334.9z M479.9,392.4c-5.8,0-10.5-4.7-10.5-10.5V130.1c0-5.8,4.7-10.5,10.5-10.5c5.8,0,10.5,4.7,10.5,10.5v251.7   C490.4,387.7,485.7,392.4,479.9,392.4z"
          />
        </svg>
      </div>
    </div>

  )
}
