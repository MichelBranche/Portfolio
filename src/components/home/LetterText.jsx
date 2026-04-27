export function HeroTitleLetters({ text }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={`${ch}-${i}`} className="hero-title-letter">
          <span className="hero-title-letter-inner">{ch}</span>
        </span>
      ))}
    </>
  )
}

export function ServicesHeaderLetters({ text }) {
  return (
    <>
      {String(text)
        .split('')
        .map((ch, i) => (
          <span key={`${ch}-${i}`} className="services-header-letter">
            <span className="services-header-letter-inner">{ch === ' ' ? '\u00A0' : ch}</span>
          </span>
        ))}
    </>
  )
}

export function PackagesHeaderLetters({ text }) {
  return (
    <>
      {String(text)
        .split('')
        .map((ch, i) => (
          <span key={`${ch}-${i}`} className="packages-header-letter">
            <span className="packages-header-letter-inner">{ch === ' ' ? '\u00A0' : ch}</span>
          </span>
        ))}
    </>
  )
}

export function ProjectTitleWords({ text }) {
  const words = text.split(' ')
  return (
    <div className="project-title-anim" aria-label={text}>
      {words.map((word, i) => (
        <span className="project-title-word" key={`${i}-${word}`}>
          <span className="project-title-word-inner">{word}</span>
        </span>
      ))}
    </div>
  )
}
