import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react'
import { getYoutubeIdFromUrl } from '../lib/youtube.js'
import { cx } from '../utils/cx.js'

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = Math.floor(safeSeconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function CustomSlider({ value, onChange, className }) {
  return (
    <motion.div
      className={cx('visual-video-slider', className)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const percentage = (x / rect.width) * 100
        onChange(Math.min(Math.max(percentage, 0), 100))
      }}
    >
      <motion.div
        className="visual-video-slider-fill"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.div>
  )
}

function ensureYoutubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    if (!document.getElementById('yt-iframe-api')) {
      const script = document.createElement('script')
      script.id = 'yt-iframe-api'
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)
    }
  })
}

export function VideoPlayer({ src }) {
  const videoRef = useRef(null)
  const ytMountRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const ytTickRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const speedValues = useMemo(() => [0.5, 1, 1.5, 2], [])
  const youtubeVideoId = useMemo(() => getYoutubeIdFromUrl(src), [src])
  const isYoutube = Boolean(youtubeVideoId)

  useEffect(() => {
    if (!isYoutube) {
      if (ytTickRef.current) {
        clearInterval(ytTickRef.current)
        ytTickRef.current = null
      }
      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy()
      }
      ytPlayerRef.current = null
      return
    }

    let cancelled = false
    ensureYoutubeApi().then((YT) => {
      if (cancelled || !ytMountRef.current || !YT?.Player) return

      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy()
      }

      ytPlayerRef.current = new YT.Player(ytMountRef.current, {
        width: '100%',
        height: '100%',
        videoId: youtubeVideoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          controls: 0,
        },
        events: {
          onReady: (event) => {
            const d = event.target.getDuration?.() || 0
            setDuration(d)
            const vol = (event.target.getVolume?.() ?? 100) / 100
            setVolume(vol)
            setIsMuted(Boolean(event.target.isMuted?.()))
          },
          onStateChange: (event) => {
            const state = event.data
            const playing = state === YT.PlayerState.PLAYING
            setIsPlaying(playing)
            if (playing && !ytTickRef.current) {
              ytTickRef.current = setInterval(() => {
                const player = ytPlayerRef.current
                if (!player?.getCurrentTime) return
                const ct = player.getCurrentTime() || 0
                const d = player.getDuration?.() || 0
                setCurrentTime(ct)
                setDuration(d)
                setProgress(d > 0 ? (ct / d) * 100 : 0)
              }, 200)
            }
            if (!playing && ytTickRef.current) {
              clearInterval(ytTickRef.current)
              ytTickRef.current = null
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      if (ytTickRef.current) {
        clearInterval(ytTickRef.current)
        ytTickRef.current = null
      }
      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy()
      }
      ytPlayerRef.current = null
    }
  }, [isYoutube, youtubeVideoId])

  const togglePlay = () => {
    if (isYoutube) {
      const yt = ytPlayerRef.current
      if (!yt) return
      if (isPlaying) {
        yt.pauseVideo?.()
      } else {
        yt.playVideo?.()
      }
      return
    }

    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
      return
    }
    video.pause()
    setIsPlaying(false)
  }

  const handleVolumeChange = (value) => {
    const newVolume = value / 100
    if (isYoutube) {
      const yt = ytPlayerRef.current
      if (!yt) return
      yt.setVolume?.(Math.round(value))
      if (newVolume === 0) yt.mute?.()
      else yt.unMute?.()
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
      return
    }

    const video = videoRef.current
    if (!video) return
    video.volume = newVolume
    video.muted = newVolume === 0
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleTimeUpdate = () => {
    if (isYoutube) return
    const video = videoRef.current
    if (!video) return
    const nextProgress = (video.currentTime / video.duration) * 100
    setProgress(Number.isFinite(nextProgress) ? nextProgress : 0)
    setCurrentTime(video.currentTime)
    setDuration(video.duration)
  }

  const handleSeek = (value) => {
    if (isYoutube) {
      const yt = ytPlayerRef.current
      const d = yt?.getDuration?.() || 0
      if (!d) return
      yt.seekTo?.((value / 100) * d, true)
      setProgress(value)
      return
    }

    const video = videoRef.current
    if (!video || !video.duration) return
    const time = (value / 100) * video.duration
    if (!Number.isFinite(time)) return
    video.currentTime = time
    setProgress(value)
  }

  const toggleMute = () => {
    if (isYoutube) {
      const yt = ytPlayerRef.current
      if (!yt) return
      const nextMuted = !isMuted
      if (nextMuted) {
        yt.mute?.()
        setVolume(0)
      } else {
        yt.unMute?.()
        const restore = volume > 0 ? volume : 1
        yt.setVolume?.(Math.round(restore * 100))
        setVolume(restore)
      }
      setIsMuted(nextMuted)
      return
    }

    const video = videoRef.current
    if (!video) return
    const nextMuted = !isMuted
    video.muted = nextMuted
    setIsMuted(nextMuted)
    if (nextMuted) {
      setVolume(0)
    } else {
      const restore = volume > 0 ? volume : 1
      video.volume = restore
      setVolume(restore)
    }
  }

  const setSpeed = (speed) => {
    if (isYoutube) {
      ytPlayerRef.current?.setPlaybackRate?.(speed)
      setPlaybackSpeed(speed)
      return
    }
    const video = videoRef.current
    if (!video) return
    video.playbackRate = speed
    setPlaybackSpeed(speed)
  }

  return (
    <motion.div
      className="visual-video-player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isYoutube ? (
        <div ref={ytMountRef} className="visual-video-element" />
      ) : (
        <video
          ref={videoRef}
          className="visual-video-element"
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="visual-video-controls"
            initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'circInOut' }}
          >
            <div className="visual-video-time-row">
              <span>{formatTime(currentTime)}</span>
              <CustomSlider value={progress} onChange={handleSeek} className="visual-video-time-slider" />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="visual-video-actions">
              <div className="visual-video-actions-left">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <button type="button" onClick={togglePlay} className="visual-video-btn visual-video-btn--icon">
                    {isPlaying ? <Pause className="visual-video-icon" /> : <Play className="visual-video-icon" />}
                  </button>
                </motion.div>
                <div className="visual-video-volume-cluster">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button type="button" onClick={toggleMute} className="visual-video-btn visual-video-btn--icon">
                      {isMuted ? (
                        <VolumeX className="visual-video-icon" />
                      ) : volume > 0.5 ? (
                        <Volume2 className="visual-video-icon" />
                      ) : (
                        <Volume1 className="visual-video-icon" />
                      )}
                    </button>
                  </motion.div>
                  <div className="visual-video-volume-slider">
                    <CustomSlider value={volume * 100} onChange={handleVolumeChange} />
                  </div>
                </div>
              </div>

              <div className="visual-video-actions-right">
                {speedValues.map((speed) => (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={speed}>
                    <button
                      type="button"
                      onClick={() => setSpeed(speed)}
                      className={cx('visual-video-btn visual-video-btn--speed', playbackSpeed === speed && 'is-active')}
                    >
                      {speed}x
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

