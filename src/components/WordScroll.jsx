import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function WordScroll() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const { lang } = useLanguage();

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
    "tool per div.",
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

    // Mettiamo il primo span fully lit all'avvio
    gsap.set(spans, { opacity: 0.15 });
    gsap.set(spans[0], { opacity: 1 });

    // Calcoliamo esattamente quanto la lista deve salire per portare l'ultimo item nel 'mirino'
    const totalScrollDistance = items[items.length - 1].offsetTop - items[0].offsetTop;

    // Timeline Master
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 25%', 
        end: 'bottom 75%', 
        scrub: 1, 
        snap: {
          snapTo: 1 / (items.length - 1),
          duration: { min: 0.1, max: 0.4 },
          ease: 'circ.out'
        }
      }
    });

    // 1. Muove la lista verso l'alto 
    tl.to(listRef.current, {
      y: -totalScrollDistance,
      ease: 'none',
      duration: 1
    }, 0);

    const step = 1 / (items.length - 1);
    
    spans.forEach((span, i) => {
      const isFirst = i === 0;
      const isLast = i === items.length - 1;
      
      const peakTime = i * step; 
      const window = step * 0.9; 

      if (!isFirst) {
        tl.to(span, {
          opacity: 1,
          duration: window,
          ease: 'power1.inOut'
        }, peakTime - window);
      }

      if (!isLast) {
        tl.to(span, {
          opacity: 0.15,
          duration: window,
          ease: 'power1.inOut'
        }, peakTime);
      }
    });

  }, { scope: containerRef, dependencies: [lang] });

  // Stile condiviso
  const sharedTextStyle = {
    fontFamily: "'Zodiak', serif", 
    fontSize: 'clamp(1.2rem, 4vw, 3.5rem)', 
    fontWeight: 400,
    letterSpacing: '-0.02em',
    lineHeight: 1.2
  };

  return (
    <section ref={containerRef} style={{ 
      width: '100%', 
      height: '350svh', 
      position: 'relative', 
      margin: '0', // Rimossi i margini esterni per avvicinare il contenuto sottostante
      background: 'transparent'
    }}>
      {/* 
        Box sticky posizionato geometricamente senza transform.
        Iniziando al 25svh con 25vh di padding centrano perfettamente il mirino testuale al 50vh,
        garantendo lo sblocco esatto e annullando gli spazi vuoti a fine corsa.
      */}
      <div style={{ 
        position: 'sticky',
        top: '25svh',

        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskSize: '100% 100%',
        padding: '25vh 0',
        overflow: 'hidden'
      }}>
        
        {/* L'header fisso a sinistra */}
        <div style={{ flex: '0 0 auto', paddingRight: '0.5rem', textAlign: 'right' }}>
          <h2 style={{ 
              ...sharedTextStyle,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700, // Un peso bold rende bene l'effetto massiccio su font come Satoshi
              color: 'var(--text-primary)', 
              margin: 0,
              paddingTop: '0.1em'
          }}>
            {buildText}
          </h2>
        </div>

        {/* 
          Container 'mirino' altezza fissa a 1 linea: 
          permette al Flexbox di trattare tutto il listone infinito 
          come se fosse solo alto 1 riga (quella in cima),
          così il primo elemento si allinea sempre con "Costruisco".
        */}
        <div style={{ position: 'relative', flex: '0 0 auto', height: '1.2em' }}>
          <ul ref={listRef} style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              listStyle: 'none', 
              margin: 0, 
              padding: 0
          }}>
            {words.map((word, idx) => (
              <li key={idx} className="word-scroll-item" style={{ 
                  margin: '0 0 1.2rem 0', 
                  whiteSpace: 'nowrap'
              }}>
                <span 
                  className="word-scroll-span" 
                  style={{ 
                    ...sharedTextStyle,
                    display: 'inline-block',
                    fontFamily: "'Zodiak', serif", // Applicazione esplicita per evitare eredità sballate
                    color: 'var(--text-primary)' // Addio all'outline problematico sui serif
                  }}
                >
                  {word}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
