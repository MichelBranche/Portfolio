import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from 'react-responsive';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function WordScroll() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const { lang } = useLanguage();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const wordsEn = [
    "products.",
    "platforms.",
    "web applications.",
    "interfaces.",
    "design systems.",
    "API platforms.",
    "backend services.",
    "distributed systems.",
    "data architectures.",
    "automation pipelines.",
    "infrastructure.",
    "developer tooling.",
    "performance systems.",
    "edge platforms.",
    "secure systems.",
    "resilient architectures.",
    "scalable software.",
    "technical foundations."
  ];

  const wordsIt = [
    "prodotti.",
    "piattaforme.",
    "applicazioni web.",
    "interfacce.",
    "design system.",
    "piattaforme API.",
    "servizi backend.",
    "sistemi distribuiti.",
    "architetture dati.",
    "pipeline automazione.",
    "infrastrutture.",
    "tool per dev.",
    "sistemi performanti.",
    "architetture edge.",
    "sistemi sicuri.",
    "architetture resilienti.",
    "software scalabile.",
    "fondamenta tecniche."
  ];

  const words = lang === 'it' ? wordsIt : wordsEn;
  const buildText = lang === 'it' ? "Costruisco " : "I build ";

  useGSAP(() => {
    if (!listRef.current) return;

    const container = containerRef.current;
    const items = gsap.utils.toArray('.word-scroll-item', container);
    const spans = gsap.utils.toArray('.word-scroll-span', container);

    gsap.set(spans, { opacity: 0.15 });
    gsap.set(spans[0], { opacity: 1 });

    const totalScrollDistance = items[items.length - 1].offsetTop - items[0].offsetTop;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        scrub: 1,
        pin: true,
        snap: {
          snapTo: 1 / (items.length - 1),
          duration: { min: 0.1, max: 0.4 },
          ease: 'circ.out'
        }
      }
    });

    tl.to(listRef.current, { y: -totalScrollDistance, ease: 'none', duration: 1 }, 0);

    const step = 1 / (items.length - 1);

    spans.forEach((span, i) => {
      const isFirst = i === 0;
      const isLast = i === items.length - 1;
      const peakTime = i * step;
      const window = step * 0.9;

      if (!isFirst) {
        tl.to(span, { opacity: 1, duration: window, ease: 'power1.inOut' }, peakTime - window);
      }
      if (!isLast) {
        tl.to(span, { opacity: 0.15, duration: window, ease: 'power1.inOut' }, peakTime);
      }
    });

  }, { scope: containerRef, dependencies: [lang, isMobile] });

  // ── Font sizes ──
  // Desktop: clamp(1rem, 6vw, 3.5rem) — original values
  // Mobile: clamp(1.5rem, 7vw, 4rem) — bigger but safe for stacked layout
  const fontSize = isMobile ? 'clamp(1.5rem, 7vw, 4rem)' : 'clamp(1rem, 4vw, 3.5rem)';

  const sharedTextStyle = {
    fontFamily: "'Zodiak', serif",
    fontSize,
    fontWeight: 400,
    letterSpacing: '-0.02em',
    lineHeight: 1.15
  };

  const prefixStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: isMobile ? 1 : 1.15,
    color: 'var(--text-primary)',
    margin: isMobile ? '0 0 0.05em 0' : '0',
  };

  return (
    <section ref={containerRef} style={{
      width: '100%',
      minHeight: '100dvh',
      position: 'relative',
      margin: '0',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      padding: isMobile ? '0 1rem' : '0 2rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskSize: '100% 100%',
        padding: isMobile ? '12vh 0' : '25vh 0',
      }}>

        {isMobile ? (
          /* ── MOBILE: stacked (prefix above, words below) ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <h2 style={{ ...prefixStyle, margin: '0 0 0.5rem 0' }}>
              {buildText.trim()}
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              fontSize,
              height: '1.15em',
              minWidth: 0,
            }}>
              <ul ref={listRef} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', listStyle: 'none', margin: 0, padding: 0, textAlign: 'center' }}>
                {words.map((word, idx) => (
                  <li key={idx} className="word-scroll-item" style={{ margin: '0 0 1.1rem 0', whiteSpace: 'nowrap' }}>
                    <span className="word-scroll-span" style={{ ...sharedTextStyle, display: 'inline-block', color: 'var(--text-primary)' }}>
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* ── DESKTOP: side-by-side (prefix left, words right) ── */
          <>
            <div style={{ flex: '1 1 50%', paddingRight: '0.2rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <h2 style={prefixStyle}>
                {buildText}
              </h2>
            </div>
            <div style={{
              position: 'relative',
              flex: '1 1 50%',
              fontSize,
              height: '1.15em',
              textAlign: 'left',
              minWidth: 0,
            }}>
              <ul ref={listRef} style={{ position: 'absolute', top: 0, left: 0, listStyle: 'none', margin: 0, padding: 0 }}>
                {words.map((word, idx) => (
                  <li key={idx} className="word-scroll-item" style={{ margin: '0 0 1.2rem 0', whiteSpace: 'nowrap' }}>
                    <span className="word-scroll-span" style={{ ...sharedTextStyle, display: 'inline-block', color: 'var(--text-primary)' }}>
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
