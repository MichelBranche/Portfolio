import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './MiniMusicPlayer.css'

// ─── Playlist ────────────────────────────────────────────────────────────────
// Aggiungi qui le tue canzoni: "url" accetta percorsi locali (/assets/music/...)
// oppure URL dirette a file MP3 pubblici (es. da Supabase Storage, R2, ecc.)
// "cover" è opzionale: null = usa placeholder.
const PLAYLIST = [
  {
    title: 'Tom Tom',
    artist: 'Holy Fuck',
    cover: '/assets/covers/Tom Tom __ by Holy F_ck.jpg',
    url: '/assets/music/Tom Tom __ by Holy F_ck.mp3',
  },
  {
    title: 'In Too Deep',
    artist: 'Sum 41',
    cover: '/assets/covers/Sum41 - In Too Deep.jpg',
    url: '/assets/music/Sum41 - In Too Deep.mp3',
  },
  {
    title: 'American Idiot',
    artist: 'Green Day',
    cover: '/assets/covers/Green Day - American Idiot.jpg',
    url: '/assets/music/Green Day - American Idiot.mp3',
  },
  {
    title: 'Teenage Dirtbag',
    artist: 'Wheatus',
    cover: '/assets/covers/Wheatus - Teenage Dirtbag.jpg',
    url: '/assets/music/Wheatus - Teenage Dirtbag.mp3',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (s) => {
  if (!s || !isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function MiniMusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.1)
  const [muted, setMuted] = useState(false)
  const [showVol, setShowVol] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [visible, setVisible] = useState(false)  // scroll-driven visibility
  const [isMinimized, setIsMinimized] = useState(false)

  const audioRef = useRef(null)
  const volRef = useRef(null)
  const dragControlsRef = useRef(null)

  const track = PLAYLIST[trackIdx]
  const cover = track.cover || '/assets/logo-dark.png'

  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''

  // ── Scroll-driven visibility ──────────────────────────────────
  // On Home: show after hero (85% vh). On all other pages: show immediately.
  useEffect(() => {
    const FOOTER_ZONE = 280
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const distFromBottom = docHeight - (scrollY + viewportHeight)
      const notInFooter = distFromBottom > FOOTER_ZONE

      if (isHome) {
        const heroThreshold = viewportHeight * 0.85
        setVisible(scrollY > heroThreshold && notInFooter)
      } else {
        setVisible(notInFooter)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  // ── Sync play/pause with audio element ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }, [playing])

  // ── Sync volume/mute ────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  // ── When track changes: reset and autoplay ──────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // FIX: Only .load() if src is actually different from the intended track.
    // This prevents interrupting the onUnlock() play call that happens 
    // just before this effect triggers for the first time.
    const targetUrl = PLAYLIST[trackIdx].url
    // Browsers often expand the src to a full URL, so we check if it ends with the target
    if (audio.src && !audio.src.endsWith(encodeURI(targetUrl))) {
      audio.load()
    }

    setPlayed(0)
    setDuration(0)
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
  }, [trackIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Audio event listeners ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      if (!seeking && audio.duration) {
        setPlayed(audio.currentTime / audio.duration)
      }
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      setTrackIdx((i) => (i + 1) % PLAYLIST.length)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [seeking])

  // ── Autoplay unlock from Preloader (random track, vol 10) ─────────────────
  // IMPORTANT: audio.play() must be called directly here (not via useEffect)
  // while still inside the user-interaction call stack — otherwise browsers
  // block it as an unprompted autoplay.
  useEffect(() => {
    const onUnlock = () => {
      const randomIdx = Math.floor(Math.random() * PLAYLIST.length)
      const audio = audioRef.current
      if (audio) {
        audio.src = PLAYLIST[randomIdx].url
        audio.volume = 0.1
        audio.load()
        audio.play().catch((err) => {
          console.warn('Autoplay blocked:', err)
          setPlaying(false)
        })
      }
      setTrackIdx(randomIdx)
      setPlaying(true)
    }
    window.addEventListener('PLAY_PORTFOLIO_MUSIC', onUnlock)
    return () => window.removeEventListener('PLAY_PORTFOLIO_MUSIC', onUnlock)
  }, [])

  // ── Click-outside closes volume panel ────────────────────────────────────
  useEffect(() => {
    if (!showVol) return
    const handler = (e) => {
      if (volRef.current && !volRef.current.contains(e.target)) setShowVol(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showVol])

  // ── Navigation ──────────────────────────────────────────────────────────
  const prev = useCallback(() => {
    setTrackIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)
  }, [])

  const next = useCallback(() => {
    setTrackIdx((i) => (i + 1) % PLAYLIST.length)
  }, [])

  // ── Progress scrubber ────────────────────────────────────────────────────
  const onSeekMouseDown = () => setSeeking(true)
  const onSeekChange = (e) => setPlayed(parseFloat(e.target.value))
  const onSeekMouseUp = (e) => {
    setSeeking(false)
    const audio = audioRef.current
    if (audio && duration) {
      audio.currentTime = parseFloat(e.target.value) * duration
    }
  }

  // ── Drag Logic ──────────────────────────────────────────────────────────
  const handleDragEnd = (_, info) => {
    // Threshold for swipe: either enough distance or high enough velocity
    if (info.offset.x < -40 || info.velocity.x < -300) {
      setIsMinimized(true)
    } else if (info.offset.x > 40 || info.velocity.x > 300) {
      setIsMinimized(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        layout
        drag="x"
        dragConstraints={{ left: -400, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{
          x: isMinimized ? 'calc(-100% - 20px)' : 0,
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 20,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`mmp-fixed ${isMinimized ? 'is-minimized' : ''}`}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        {/* Restore handle visible ONLY when minimized */}
        {isMinimized && (
          <button
            className="mmp__restore-handle"
            onClick={() => setIsMinimized(false)}
            aria-label="Restore Player"
          >
            <div className="mmp__restore-bar" />
          </button>
        )}
        {/* Native audio element */}
        <audio ref={audioRef} preload="metadata" src={track.url} />

        {/* Player card */}
        <div className="mmp">
          {/* Cover */}
          <div
            className="mmp__cover"
            style={{ backgroundImage: `url('${cover}')` }}
            aria-hidden
          />

          {/* Body */}
          <div className="mmp__body">
            {/* Track info */}
            <div className="mmp__info">
              <div className="mmp__artist">{track.artist}</div>
              <div className="mmp__title">{track.title}</div>
            </div>

            {/* Controls */}
            <div className="mmp__controls">
              {/* Prev */}
              <button className="mmp__btn mmp__btn--sm" onClick={prev} aria-label="Previous">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                className={`mmp__btn mmp__btn--play${playing ? ' is-playing' : ''}`}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button className="mmp__btn mmp__btn--sm" onClick={next} aria-label="Next">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>

              {/* Volume */}
              <div className="mmp__vol-wrap" ref={volRef}>
                {showVol && (
                  <div className="mmp__vol-panel">
                    <div className="mmp__vol-label">{Math.round((muted ? 0 : volume) * 100)}</div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        setVolume(v)
                        if (v > 0) setMuted(false)
                      }}
                      className="mmp__vol-slider"
                      style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                    />
                  </div>
                )}
                <button
                  className={`mmp__btn mmp__btn--sm${muted || volume === 0 ? ' is-muted' : ''}`}
                  onClick={() => muted ? setMuted(false) : setShowVol((s) => !s)}
                  aria-label="Volume"
                >
                  {(muted || volume === 0) ? (
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path fill="currentColor" d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mmp__progress">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={played}
                onMouseDown={onSeekMouseDown}
                onChange={onSeekChange}
                onMouseUp={onSeekMouseUp}
                onTouchStart={onSeekMouseDown}
                onTouchEnd={onSeekMouseUp}
                className="mmp__seek"
              />
              <div className="mmp__times">
                <span>{fmt(played * duration)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
