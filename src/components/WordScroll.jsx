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

    const baseOpacity = isMobile ? 0.72 : 0.55;
    gsap.set(spans, { opacity: baseOpacity });
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
        tl.to(span, { opacity: baseOpacity, duration: window, ease: 'power1.inOut' }, peakTime);
      }
    });

  }, { scope: containerRef, dependencies: [lang, isMobile] });

  // ── Font sizes ──
  // Desktop: clamp(1rem, 6vw, 3.5rem) — original values
  // Mobile: clamp(1.5rem, 7vw, 4rem) — bigger but safe for stacked layout
  const fontSize = isMobile ? 'clamp(2rem, 9.2vw, 4.8rem)' : 'clamp(1rem, 4vw, 3.5rem)';

  const sharedTextStyle = {
    fontFamily: "'Zodiak', serif",
    fontSize,
    fontWeight: isMobile ? 600 : 400,
    letterSpacing: isMobile ? '-0.01em' : '-0.02em',
    lineHeight: isMobile ? 1.08 : 1.15,
    textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 10px 34px rgba(0, 0, 0, 0.45)',
  };

  const prefixStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize,
    fontWeight: isMobile ? 800 : 700,
    letterSpacing: '-0.02em',
    lineHeight: isMobile ? 1 : 1.15,
    color: isMobile ? 'var(--text-primary)' : '#f3efe7',
    textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 10px 34px rgba(0, 0, 0, 0.45)',
    margin: isMobile ? '0 0 0.05em 0' : '0',
  };

  return (
    <section ref={containerRef} style={{
      width: isMobile ? '100%' : '1972px',
      maxWidth: isMobile ? '100%' : '1983px',
      minHeight: isMobile ? '72dvh' : '115px',
      maxHeight: isMobile ? 'none' : '674px',
      position: 'relative',
      margin: '0',
      background: 'transparent',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      padding: isMobile ? '0 1rem' : '0 152px',
      boxSizing: 'border-box',
      zIndex: 3,
      isolation: 'isolate',
    }}>
      <div style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : 'min(1500px, 100%)',
        marginLeft: isMobile ? '0' : 'clamp(0rem, 3vw, 3rem)',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-start',
        alignItems: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskSize: '100% 100%',
        padding: isMobile ? '8vh 0' : '25vh 0',
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
              height: '1.05em',
              minWidth: 0,
            }}>
              <ul ref={listRef} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', listStyle: 'none', margin: 0, padding: 0, textAlign: 'center' }}>
                {words.map((word, idx) => (
                  <li key={idx} className="word-scroll-item" style={{ margin: '0 0 1.35rem 0', whiteSpace: 'nowrap' }}>
                    <span className="word-scroll-span" style={{ ...sharedTextStyle, display: 'inline-block', color: isMobile ? 'var(--text-primary)' : '#f3efe7' }}>
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* ── DESKTOP: side-by-side (prefix left, words right) ── */
          <div style={{
            width: '100%',
            maxWidth: 'min(1120px, 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: 'clamp(0.75rem, 1.6vw, 1.25rem) clamp(1rem, 2.2vw, 1.8rem)',
            background: 'linear-gradient(145deg, rgba(20,20,20,0.22), rgba(20,20,20,0.12))',
            border: '1px solid rgba(255,255,255,0.16)',
            backdropFilter: 'blur(10px) saturate(1.05)',
            WebkitBackdropFilter: 'blur(10px) saturate(1.05)',
            boxShadow: '0 14px 40px rgba(0,0,0,0.22)',
          }}>
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
                    <span className="word-scroll-span" style={{ ...sharedTextStyle, display: 'inline-block', color: isMobile ? 'var(--text-primary)' : '#f3efe7' }}>
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
