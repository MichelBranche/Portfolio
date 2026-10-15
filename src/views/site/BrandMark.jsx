'use client'

// Brand mark: at rest each letter of the name is reduced to a small glyph (bars and dots,
// a kind of morse code of the letter shapes). On hover the letters come back one by one,
// left to right, and fold back right to left on leave. Our own take on the idea of the
// hellobarrio.it logo; no code or artwork reused.
const GLYPHS = {
  m: 'bb', i: 'b', c: 'd', h: 'sb', e: 'd', l: 'b', b: 'bd', r: 'd', a: 'd', n: 'b',
}

export function BrandMark({ text }) {
  const chars = [...text]
  const n = chars.length
  return (
    <span className="mb-mark" aria-label={text} role="img">
      {chars.map((ch, i) => (
        <span
          key={i}
          className={`mb-mark-slot${ch === ' ' ? ' is-space' : ''}`}
          style={{ '--i': i, '--r': n - 1 - i }}
          aria-hidden
        >
          <span className="mb-mark-char">{ch === ' ' ? '\u00a0' : ch}</span>
          <span className="mb-mark-glyph">
            {(GLYPHS[ch.toLowerCase()] || '').split('').map((g, k) => (
              <i key={k} className={`mb-g-${g}`} />
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
