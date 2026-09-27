'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { reduceMotion } from './motion-fx'
import { useSiteUI } from './site-ui.js'

gsap.registerPlugin(ScrollTrigger)

const FRAMES = [
  ['/images/studio/espresso.png', '/images/studio/cup.png'],
  ['/images/studio/headphones.png', '/images/studio/megaphone.png'],
  ['/images/studio/pencil.png', '/images/studio/stamp.png'],
  ['/images/studio/notebook.png', '/images/studio/papers.png'],
  ['/images/studio/camera.png', '/images/studio/scanner.png'],
  ['/images/studio/plant.png', '/images/studio/shoe.png'],
]

const PIXELS = 18 * 11

function asList(value) {
  return Array.isArray(value) ? value.map(String) : []
}

export function StudioPage() {
  const { t } = useLanguage()
  const { scrollTop } = useSiteUI()
  const rootRef = useRef(null)
  const pixelsRef = useRef(null)
  const wiping = useRef(false)
  const [index, setIndex] = useState(0)
  const [side, setSide] = useState('a')

  const yes = asList(t('reel.wordsYes'))
  const no = asList(t('reel.wordsNo'))
  const altYes = asList(t('reel.altYes'))
  const altNo = asList(t('reel.altNo'))
  const lines = `${String(t('about.lead'))}\n${String(t('about.body'))}`
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const word = (side === 'a' ? yes[index] : no[index]) || ''

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const measure = () => {
      const header = document.querySelector('.hb-header')
      const sub = document.querySelector('.hb-subline')
      const pull = (header?.offsetHeight ?? 0) + (sub?.offsetHeight ?? 0)
      root.style.setProperty('--id-pull', `${pull}px`)
    }

    measure()
    const steps = [...root.querySelectorAll('.hb-id-step')]
    const triggers = steps.map((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) setIndex(i)
        },
      }),
    )
    ScrollTrigger.refresh()

    const copy = root.parentElement?.querySelector('.hb-studio-copy')
    const syncHud = () => {
      if (!copy) return
      const away = copy.getBoundingClientRect().top < window.innerHeight * 0.8
      root.classList.toggle('is-away', away)
    }

    const onResize = () => {
      measure()
      syncHud()
      ScrollTrigger.refresh()
    }
    const onScroll = () => {
      ScrollTrigger.update()
      syncHud()
    }
    syncHud()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [])

  const atBottom = () => {
    const root = rootRef.current
    if (!root) return false
    return root.getBoundingClientRect().bottom < window.innerHeight * 1.65
  }

  const flip = (next) => {
    if (atBottom()) scrollTop()
    if (next === side || wiping.current) return
    const cells = pixelsRef.current ? [...pixelsRef.current.children] : []
    if (!cells.length || reduceMotion()) {
      setSide(next)
      return
    }
    wiping.current = true
    const cover = 380
    gsap.killTweensOf(cells)
    gsap.set(cells, { opacity: 0 })
    gsap.to(cells, {
      opacity: 1,
      duration: 0.01,
      stagger: { each: 0.0015, from: 'random' },
    })
    window.setTimeout(() => {
      flushSync(() => setSide(next))
      gsap.killTweensOf(cells)
      gsap.to(cells, {
        opacity: 0,
        duration: 0.01,
        stagger: { each: 0.0015, from: 'random' },
      })
      window.setTimeout(() => {
        wiping.current = false
      }, cover)
    }, cover)
  }

  return (
    <article className="hb-page hb-studio">
      <section
        ref={rootRef}
        className="hb-id"
        data-side={side}
        aria-label={String(t('reel.switchAria'))}
      >
        <div className="hb-id-hud">
          <div className="hb-id-word" aria-hidden>
            <div className="hb-id-col is-a" style={{ '--i': index }}>
              {yes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="hb-id-col is-b" style={{ '--i': index }}>
              {no.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div ref={pixelsRef} className="hb-id-pixels" aria-hidden>
            {Array.from({ length: PIXELS }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="hb-id-toggle" role="group" aria-label={String(t('reel.switchAria'))}>
            <i className="hb-id-knob" aria-hidden />
            <button type="button" aria-pressed={side === 'a'} onClick={() => flip('a')}>
              {String(t('reel.yes'))}
            </button>
            <button type="button" aria-pressed={side === 'b'} onClick={() => flip('b')}>
              {String(t('reel.no'))}
            </button>
          </div>
          <p className="hb-sr" aria-live="polite">
            {word}
          </p>
        </div>
        <div className="hb-id-track">
          {FRAMES.map(([srcA, srcB], i) => (
            <div className="hb-id-step" key={srcA}>
              <img
                className="hb-id-img is-a"
                src={srcA}
                alt={i === index && side === 'a' ? altYes[i] || '' : ''}
                aria-hidden={!(i === index && side === 'a')}
                draggable="false"
                decoding="async"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <img
                className="hb-id-img is-b"
                src={srcB}
                alt={i === index && side === 'b' ? altNo[i] || '' : ''}
                aria-hidden={!(i === index && side === 'b')}
                draggable="false"
                decoding="async"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="hb-studio-copy">
        <p className="hb-studio-sub" data-reveal>
          \ {String(t('about.subTitle'))} \
        </p>
        <div className="hb-manifesto">
          {lines.map((line) => (
            <p key={line} data-reveal>
              <span className="hb-rule" data-line />
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}
