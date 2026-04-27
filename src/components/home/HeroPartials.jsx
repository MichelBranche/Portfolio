import {
  FLAIR_CDN,
  HERO_FLAIR_PRELOAD_3D,
  HERO_FLAIR_PRELOAD_XP,
  HERO_MP3_ART,
} from '../../config/site.js'

export function HeroFlair() {
  return (
    <div className="hero-flair" aria-hidden>
      <div className="image-preload">
        {HERO_FLAIR_PRELOAD_3D.map(([key, f]) => (
          <img
            key={key}
            data-key={key}
            src={`${FLAIR_CDN}${f}`}
            width={1}
            height={1}
            alt=""
            decoding="async"
            fetchPriority="low"
          />
        ))}
      </div>
      <div className="explosion-preload">
        {HERO_FLAIR_PRELOAD_XP.map(([key, f], i) => (
          <img
            key={`${i}-${key}`}
            data-key={key}
            src={`${FLAIR_CDN}${f}`}
            alt=""
            decoding="async"
            fetchPriority="low"
          />
        ))}
      </div>
      <svg className="pricing-hero__canvas" />
      <div className="pricing-hero__proxy" />
    </div>
  )
}

export function HeroSubtitle({ lines = [] }) {
  return (
    <div className="hero-subtitle gs-reveal">
      {lines.map((line, lineIdx) => (
        <div className="hero-subtitle-line" key={lineIdx}>
          {line.split(' ').map((word, i) => (
            <span className="hero-subtitle-word" key={`${lineIdx}-${i}-${word}`}>
              <span className="hero-subtitle-word-inner">{word}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function HeroMiniPlayer({
  isPlaying,
  onToggle,
  artwork,
  title,
  artist,
  onNextTrack,
  trackNumber,
  totalTracks,
}) {
  return (
    <div className="hero-mini-player interactable">
      <button
        type="button"
        className="hero-mini-player-disc-wrap"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause hero track' : 'Play hero track'}
        aria-pressed={isPlaying}
      >
        <span className={`hero-mini-player-disc${isPlaying ? ' hero-mini-player-disc--spinning' : ''}`}>
          <img
            src={artwork || HERO_MP3_ART}
            alt={title ? `Cover ${title}` : 'Cover track'}
            className="hero-mini-player-disc-art"
          />
        </span>
      </button>
      <div className="hero-mini-player-meta">
        <span className="hero-mini-player-label-wrap" title={title || 'Hero mix'}>
          <span className="hero-mini-player-label hero-mini-player-label--scroll">
            {title || 'Hero mix'}
          </span>
        </span>
        <span className="hero-mini-player-artist">{artist || 'SoundCloud'}</span>
        <div className="hero-mini-player-controls-row">
          <span className="hero-mini-player-state">{isPlaying ? 'Playing' : 'Paused'}</span>
          <button
            type="button"
            className="hero-mini-player-next"
            onClick={onNextTrack}
            aria-label="Prossima canzone"
          >
            Next {trackNumber}/{totalTracks}
          </button>
        </div>
      </div>
    </div>
  )
}
