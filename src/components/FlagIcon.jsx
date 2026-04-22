import { useId } from 'react'
import './FlagIcon.css'

export function FlagIcon({ code, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `fclip-${code}-${uid}`

  const wrap = (body) => (
    <span className={`flag-icon ${className}`.trim()} aria-hidden>
      <svg
        className="flag-icon-svg"
        viewBox="0 0 32 32"
        aria-hidden
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="16" cy="16" r="16" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>{body}</g>
      </svg>
    </span>
  )

  switch (code) {
    case 'it':
      return wrap(
        <>
          <rect x="0" y="0" width="10.67" height="32" fill="#009246" />
          <rect x="10.67" y="0" width="10.66" height="32" fill="#fff" />
          <rect x="21.33" y="0" width="10.67" height="32" fill="#CE2B37" />
        </>,
      )
    case 'en':
      /* Croce di S. Giorgio: leggibile a piccola taglia, lingua “English” */
      return wrap(
        <>
          <rect x="0" y="0" width="32" height="32" fill="#fff" />
          <rect x="0" y="14" width="32" height="4" fill="#CE1124" />
          <rect x="14" y="0" width="4" height="32" fill="#CE1124" />
        </>,
      )
    case 'fr':
      return wrap(
        <>
          <rect x="0" y="0" width="10.67" height="32" fill="#002395" />
          <rect x="10.67" y="0" width="10.66" height="32" fill="#fff" />
          <rect x="21.33" y="0" width="10.67" height="32" fill="#ED2939" />
        </>,
      )
    case 'de':
      return wrap(
        <>
          <rect x="0" y="0" width="32" height="10.67" fill="#000" />
          <rect x="0" y="10.67" width="32" height="10.66" fill="#DD0000" />
          <rect x="0" y="21.33" width="32" height="10.67" fill="#FFCE00" />
        </>,
      )
    case 'es':
      return wrap(
        <>
          <rect x="0" y="0" width="32" height="8" fill="#AA151B" />
          <rect x="0" y="8" width="32" height="16" fill="#F1BF00" />
          <rect x="0" y="24" width="32" height="8" fill="#AA151B" />
        </>,
      )
    default:
      return null
  }
}
