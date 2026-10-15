'use client'

import { useSyncExternalStore } from 'react'

// Michel's playlist (Spotify 0lrG8aimGguBZU9KuRZ110), played through official, embeddable
// YouTube uploads. Starts from "A Forest", then continues in playlist order and wraps.
// No audio is hosted on this site.
export const PLAYLIST = [
  'xik-y0xlpZ0', // The Cure - A Forest
  'aGSKrC7dGcY', // Depeche Mode - Enjoy the Silence
  'NUnXxh5U25Y', // Radiohead - Everything In Its Right Place
  'FuvWc3ToDHg', // Beach House - Myth
  '5GRNCNZ_TL4', // Interpol - NYC
  'lAwYodrBr2Q', // M83 - Wait
  'sElE_BfQ67s', // Cigarettes After Sex - Apocalypse
  '4texipD7faM', // James Blake - Retrograde
  'YkLjqFpBh84', // FKA twigs - cellophane
  'JTeKpWp8Psw', // Sufjan Stevens - Fourth of July
  'BbWBRnDK_AE', // Radiohead - Nude
  '6hUkyKBsGtQ', // Massive Attack, Hope Sandoval - Paradise Circus
  'ImKY6TZEyrI', // Mazzy Star - Fade Into You
  'GAFwrXOsL68', // Beach House - Space Song
  't2DWy__LS6o', // Radiohead - All I Need (From the Basement)
  'rnr95fuXbAk', // Felt - Evergreen Dazed
  'LCaNDUcqHlQ', // Cocteau Twins - Pandora (for Cindy)
  'f963bYBS8L4', // Red House Painters - Katy Song
  'tNgSwtRqLmg', // The Blue Nile - The Downtown Lights
  '3h-JYx76QNM', // Massive Attack, Elizabeth Fraser - Teardrop
  '4qQyUi4zfDs', // Portishead - Glory Box
  'IGUboLZx3Tk', // Chromatics - Shadow
]

const TARGET_VOLUME = 60
let player = null
let ready = false
let wantPlay = false
let state = 'idle' // idle | playing | muted | stopped
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())
const setState = (next) => {
  state = next
  emit()
}

function fadeIn() {
  if (!player) return
  let v = 0
  player.setVolume(0)
  const id = window.setInterval(() => {
    v += 4
    player.setVolume(Math.min(TARGET_VOLUME, v))
    if (v >= TARGET_VOLUME) window.clearInterval(id)
  }, 120)
}

function startNow() {
  wantPlay = false
  player.unMute()
  player.setVolume(0)
  player.loadPlaylist({ playlist: PLAYLIST, index: 0 })
  player.setLoop(true)
  fadeIn()
  setState('playing')
}

// Loads the YouTube IFrame API and prepares a hidden player (no sound until a click).
export function primeMusic() {
  if (typeof window === 'undefined' || player) return
  const mount = () => {
    const host = document.createElement('div')
    host.id = 'mb-yt'
    document.getElementById('mb-yt-wrap')?.appendChild(host)
    player = new window.YT.Player('mb-yt', {
      width: 1,
      height: 1,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: () => {
          ready = true
          if (wantPlay) startNow()
        },
      },
    })
  }
  if (window.YT?.Player) {
    mount()
    return
  }
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => {
    prev?.()
    mount()
  }
  const s = document.createElement('script')
  s.src = 'https://www.youtube.com/iframe_api'
  s.async = true
  document.head.appendChild(s)
}

// Called from the click on an illustration (the click is the user gesture).
export function startMusic() {
  if (state === 'playing' || state === 'muted') return
  if (!player) primeMusic()
  if (ready) startNow()
  else wantPlay = true
}

function toggleMute() {
  if (!player) return
  if (state === 'muted') {
    player.unMute()
    fadeIn()
    setState('playing')
  } else {
    player.mute()
    setState('muted')
  }
}

function stop() {
  player?.stopVideo()
  setState('stopped')
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Persistent control, mounted once in the site layout so music survives page changes.
export function MusicDock({ labels }) {
  const current = useSyncExternalStore(subscribe, () => state, () => 'idle')
  return (
    <>
      <div id="mb-yt-wrap" className="mb-yt-wrap" aria-hidden />
      {(current === 'playing' || current === 'muted') ? (
        <div className="mb-music" role="group" aria-label={labels.group}>
          <span className={`mb-music-bars${current === 'playing' ? ' is-on' : ''}`} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <button type="button" onClick={toggleMute} aria-pressed={current === 'muted'}>
            {current === 'muted' ? labels.unmute : labels.mute}
          </button>
          <button type="button" onClick={stop}>
            {labels.stop}
          </button>
        </div>
      ) : null}
    </>
  )
}
