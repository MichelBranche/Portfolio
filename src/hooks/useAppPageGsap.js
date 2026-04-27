import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * Lenis, ScrollTrigger, cursor, sezioni, preloader, marquee, footer.
 */
export function useAppPageGsap({
  isCoarsePointer,
  prefersReducedMotion,
  playFooterSound,
  setPreloaderPhase,
  continueAfterPreloaderRef,
  startPreloaderLoadingRef,
  preloaderPart2DoneRef,
  lenisRef,
  footerSoundRef,
}) {
  useEffect(() => {    gsap.registerPlugin(ScrollTrigger)

    const cursor = document.querySelector('.cursor')
    const easterImg = document.querySelector('.easter-egg-img')
    const magWrap = document.querySelector('.magnetic-wrap')
    const magText = document.querySelector('.magnetic-text')
    const projectItems = document.querySelectorAll('.project-item')
    const serviceItems = document.querySelectorAll('.service-item')
    const packageCardsEls = document.querySelectorAll('.package-card')
    const projectFloats = document.querySelectorAll('.project-img-float')
    const interactables = document.querySelectorAll('.interactable')
    const easterTriggers = document.querySelectorAll('.easter-trigger')

    const cleanupFns = []

    const hideAllProjectFloats = () => {
      if (!projectFloats.length) return
      gsap.killTweensOf([...projectFloats])
      gsap.set([...projectFloats], { opacity: 0, scale: 0, x: 0, y: 0 })
      if (cursor) {
        gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' })
      }
    }

    const isStickyTouch = isCoarsePointer
    const heroTopEl = document.querySelector('.hero-top')
    const heroSubEl = document.querySelector('section.hero .hero-subtitle')
    const heroSocialEl = document.querySelector('section.hero .hero-social')
    const heroParallaxOn = !isStickyTouch && !prefersReducedMotion && heroTopEl && heroSubEl && heroSocialEl

    let hitTestSeq = 0

    const resetHeroTopParallax = () => {
      if (!heroSubEl || !heroSocialEl) return
      gsap.to([heroSubEl, heroSocialEl], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (heroParallaxOn) {
      const heroSection = document.querySelector('section.hero')
      const onLeaveHero = () => resetHeroTopParallax()
      if (heroSection) {
        heroSection.addEventListener('mouseleave', onLeaveHero)
        cleanupFns.push(() => {
          heroSection.removeEventListener('mouseleave', onLeaveHero)
        })
      }
    }

    let activeTouchProjectItem = null
    let activeProjectLeave = null
    const clearActiveProjectTouch = () => {
      if (activeProjectLeave) {
        activeProjectLeave()
        activeProjectLeave = null
        activeTouchProjectItem = null
      }
    }

    const onMouseMove = (e) => {
      if (cursor) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
        })
      }
      if (isStickyTouch && activeTouchProjectItem) {
        return
      }
      if (heroParallaxOn && heroSubEl && heroSocialEl) {
        const r = heroTopEl.getBoundingClientRect()
        if (r.width > 1 && r.height > 1) {
          const cx = r.left + r.width * 0.5
          const cy = r.top + r.height * 0.5
          const tx = Math.max(
            -1,
            Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.28)),
          )
          const ty = Math.max(
            -1,
            Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.28)),
          )
          gsap.to(heroSubEl, {
            x: tx * 26,
            y: ty * 16,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          gsap.to(heroSocialEl, {
            x: tx * 11,
            y: ty * 7,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      // elementFromPoint is expensive — run every 3rd move for hit-testing only.
      hitTestSeq += 1
      if (hitTestSeq % 3 !== 0) {
        return
      }
      // Fallback when mouseleave is missed (e.g. fast scroll) or old tweens leave opacity>0.
      const top = document.elementFromPoint(e.clientX, e.clientY)
      if (!top?.closest?.('.project-item')) {
        for (const img of projectFloats) {
          if (Number(gsap.getProperty(img, 'opacity')) > 0.01) {
            hideAllProjectFloats()
            break
          }
        }
      }
      if (!isStickyTouch && cursor && !top?.closest?.('.interactable')) {
        // Safety reset: if a leave event is missed, bring cursor back to normal size.
        gsap.to(cursor, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
          force3D: true,
          transformOrigin: '50% 50%',
          overwrite: 'auto',
        })
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
    const onWindowBlur = () => {
      clearActiveProjectTouch()
      hideAllProjectFloats()
      resetHeroTopParallax()
    }
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') {
        clearActiveProjectTouch()
        hideAllProjectFloats()
        resetHeroTopParallax()
      }
    }
    window.addEventListener('blur', onWindowBlur)
    document.addEventListener('visibilitychange', onVisChange)
    cleanupFns.push(() => {
      window.removeEventListener('blur', onWindowBlur)
      document.removeEventListener('visibilitychange', onVisChange)
    })

    if (!isStickyTouch) {
      interactables.forEach((el) => {
        const onEnter = () =>
          gsap.to(cursor, {
            scale: 4,
            duration: 0.3,
            ease: 'back.out(2)',
            force3D: true,
            transformOrigin: '50% 50%',
          })
        const onLeave = () =>
          gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            force3D: true,
            transformOrigin: '50% 50%',
          })
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    if (isStickyTouch) {
      const onDocProjectTouch = (e) => {
        if (e.pointerType === 'mouse') return
        if (!activeTouchProjectItem) return
        if (activeTouchProjectItem.contains(e.target)) return
        clearActiveProjectTouch()
      }
      document.addEventListener('pointerdown', onDocProjectTouch, true)
      cleanupFns.push(() => {
        document.removeEventListener('pointerdown', onDocProjectTouch, true)
      })
    }

    easterTriggers.forEach((trigger) => {
      const showImg = () => gsap.to(easterImg, { opacity: 1, scale: 1, duration: 0.3 })
      const hideImg = () => gsap.to(easterImg, { opacity: 0, scale: 1.1, duration: 0.4 })
      trigger.addEventListener('mousedown', showImg)
      trigger.addEventListener('touchstart', showImg)
      trigger.addEventListener('mouseup', hideImg)
      trigger.addEventListener('mouseleave', hideImg)
      trigger.addEventListener('touchend', hideImg)
      cleanupFns.push(() => {
        trigger.removeEventListener('mousedown', showImg)
        trigger.removeEventListener('touchstart', showImg)
        trigger.removeEventListener('mouseup', hideImg)
        trigger.removeEventListener('mouseleave', hideImg)
        trigger.removeEventListener('touchend', hideImg)
      })
    })

    const heroTitles = document.querySelectorAll('.hero-title')
    heroTitles.forEach((title) => {
      const outers = title.querySelectorAll('.hero-title-letter')
      const inners = title.querySelectorAll('.hero-title-letter-inner')
      let hoverTl = null
      const colorTl = { current: null }

      const onEnter = () => {
        if (hoverTl) hoverTl.kill()
        if (colorTl.current) colorTl.current.kill()
        gsap.set(outers, { transformOrigin: '50% 100%' })
        hoverTl = gsap.timeline({ repeat: -1, repeatDelay: 0, repeatRefresh: true })
        hoverTl
          .to(outers, {
            y: () => gsap.utils.random(-36, -14),
            rotate: () => gsap.utils.random(-14, 14),
            skewX: () => gsap.utils.random(-9, 9),
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
            stagger: { each: 0.034, from: 'start' },
          })
          .to(outers, {
            y: 0,
            rotate: 0,
            skewX: 0,
            duration: 0.48,
            ease: 'power1.inOut',
            overwrite: 'auto',
            stagger: { each: 0.03, from: 'end' },
          })
        colorTl.current = gsap.to(inners, {
          color: 'var(--accent)',
          duration: 0.2,
          stagger: { each: 0.03, from: 'start' },
        })
      }

      const onLeave = () => {
        if (hoverTl) {
          hoverTl.kill()
          hoverTl = null
        }
        if (colorTl.current) {
          colorTl.current.kill()
          colorTl.current = null
        }
        gsap.to(outers, {
          y: 0,
          rotate: 0,
          skewX: 0,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
          stagger: { each: 0.018, from: 'center' },
        })
        gsap.to(inners, { color: '', duration: 0.3 })
      }

      title.addEventListener('mouseenter', onEnter)
      title.addEventListener('mouseleave', onLeave)
      cleanupFns.push(() => {
        title.removeEventListener('mouseenter', onEnter)
        title.removeEventListener('mouseleave', onLeave)
        if (hoverTl) hoverTl.kill()
        if (colorTl.current) colorTl.current.kill()
      })
    })

    const socialLinks = document.querySelectorAll('.hero-social-link')
    socialLinks.forEach((link, idx) => {
      const icon = link.querySelector('.social-icon')
      let enterTl = null

      const onEnter = () => {
        if (enterTl) enterTl.kill()
        enterTl = gsap.timeline()
        enterTl
          .to(link, {
            y: -8,
            scale: 1.25,
            color: 'var(--accent)',
            duration: 0.35,
            ease: 'power3.out',
          })
          .to(
            icon,
            {
              rotate: idx === 1 ? 360 : gsap.utils.random(-18, 18),
              duration: idx === 1 ? 0.9 : 0.45,
              ease: idx === 1 ? 'power2.inOut' : 'back.out(2)',
            },
            0,
          )
          .to(
            link,
            {
              y: -4,
              scale: 1.15,
              duration: 0.6,
              ease: 'elastic.out(1, 0.4)',
            },
            '>-0.1',
          )
      }

      const onLeave = () => {
        if (enterTl) enterTl.kill()
        gsap.to(link, {
          y: 0,
          scale: 1,
          color: '',
          duration: 0.55,
          ease: 'elastic.out(1, 0.5)',
        })
        gsap.to(icon, { rotate: 0, duration: 0.5, ease: 'power3.out' })
      }

      const onDown = () => {
        gsap.to(link, { scale: 0.9, duration: 0.1, ease: 'power2.out' })
      }
      const onUp = () => {
        gsap.to(link, { scale: 1.25, duration: 0.25, ease: 'back.out(2)' })
      }

      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      link.addEventListener('mousedown', onDown)
      link.addEventListener('mouseup', onUp)
      cleanupFns.push(() => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
        link.removeEventListener('mousedown', onDown)
        link.removeEventListener('mouseup', onUp)
        if (enterTl) enterTl.kill()
      })
    })

    const heroMiniPlayer = document.querySelector('.hero-mini-player')
    if (heroMiniPlayer) {
      const discWrap = heroMiniPlayer.querySelector('.hero-mini-player-disc-wrap')
      const nextBtn = heroMiniPlayer.querySelector('.hero-mini-player-next')
      const meta = heroMiniPlayer.querySelector('.hero-mini-player-meta')
      let playerEnterTl = null

      const onPlayerEnter = () => {
        if (playerEnterTl) playerEnterTl.kill()
        playerEnterTl = gsap.timeline()
        playerEnterTl
          .to(heroMiniPlayer, {
            y: -6,
            scale: 1.03,
            duration: 0.3,
            ease: 'power3.out',
          })
          .to(
            discWrap,
            {
              borderColor: 'var(--accent)',
              duration: 0.25,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            discWrap,
            {
              rotate: '+=22',
              duration: 0.45,
              ease: 'back.out(2)',
            },
            0,
          )
          .to(
            meta,
            {
              x: 3,
              duration: 0.35,
              ease: 'power2.out',
            },
            0,
          )
      }

      const onPlayerLeave = () => {
        if (playerEnterTl) playerEnterTl.kill()
        gsap.to(heroMiniPlayer, {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'elastic.out(1, 0.5)',
        })
        gsap.to(discWrap, { borderColor: '', duration: 0.28, ease: 'power2.out' })
        gsap.to(discWrap, { rotate: 0, duration: 0.45, ease: 'power3.out' })
        gsap.to(meta, { x: 0, duration: 0.35, ease: 'power2.out' })
      }

      const onPlayerDown = () => {
        gsap.to(heroMiniPlayer, { scale: 0.97, duration: 0.12, ease: 'power2.out' })
      }
      const onPlayerUp = () => {
        gsap.to(heroMiniPlayer, { scale: 1.03, duration: 0.25, ease: 'back.out(2)' })
      }

      const onNextEnter = () => {
        gsap.to(nextBtn, {
          y: -2,
          backgroundColor: 'var(--accent)',
          color: 'var(--bg)',
          borderColor: 'var(--accent)',
          duration: 0.25,
          ease: 'power2.out',
        })
      }
      const onNextLeave = () => {
        gsap.to(nextBtn, {
          y: 0,
          backgroundColor: 'transparent',
          color: '',
          borderColor: '',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
      const onNextDown = () => {
        gsap.to(nextBtn, { scale: 0.93, duration: 0.1, ease: 'power2.out' })
      }
      const onNextUp = () => {
        gsap.to(nextBtn, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
      }

      heroMiniPlayer.addEventListener('mouseenter', onPlayerEnter)
      heroMiniPlayer.addEventListener('mouseleave', onPlayerLeave)
      heroMiniPlayer.addEventListener('mousedown', onPlayerDown)
      heroMiniPlayer.addEventListener('mouseup', onPlayerUp)
      nextBtn?.addEventListener('mouseenter', onNextEnter)
      nextBtn?.addEventListener('mouseleave', onNextLeave)
      nextBtn?.addEventListener('mousedown', onNextDown)
      nextBtn?.addEventListener('mouseup', onNextUp)
      cleanupFns.push(() => {
        heroMiniPlayer.removeEventListener('mouseenter', onPlayerEnter)
        heroMiniPlayer.removeEventListener('mouseleave', onPlayerLeave)
        heroMiniPlayer.removeEventListener('mousedown', onPlayerDown)
        heroMiniPlayer.removeEventListener('mouseup', onPlayerUp)
        nextBtn?.removeEventListener('mouseenter', onNextEnter)
        nextBtn?.removeEventListener('mouseleave', onNextLeave)
        nextBtn?.removeEventListener('mousedown', onNextDown)
        nextBtn?.removeEventListener('mouseup', onNextUp)
        if (playerEnterTl) playerEnterTl.kill()
      })
    }

    if (magWrap && magText) {
      const onMagneticMove = (e) => {
        const rect = magWrap.getBoundingClientRect()
        gsap.to(magText, {
          x: (e.clientX - (rect.left + rect.width / 2)) * 0.4,
          y: (e.clientY - (rect.top + rect.height / 2)) * 0.4,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      const onMagneticLeave = () =>
        gsap.to(magText, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
      magWrap.addEventListener('mousemove', onMagneticMove)
      magWrap.addEventListener('mouseleave', onMagneticLeave)
      cleanupFns.push(() => {
        magWrap.removeEventListener('mousemove', onMagneticMove)
        magWrap.removeEventListener('mouseleave', onMagneticLeave)
      })
    }

    const lenis = new Lenis({
      duration: isStickyTouch ? 0.95 : 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      syncTouch: !isStickyTouch,
      touchMultiplier: isStickyTouch ? 1 : 1.15,
    })
    lenis.stop()
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tickerCallback = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    let heroTagFallTl = null
    let heroTagFallLocked = false
    let heroTagHasFallen = false

    const playAnvilLand = () => {
      const players = footerSoundRef.current
      const audio = players?.anvilDrop
      if (!audio) return
      audio.loop = false
      audio.currentTime = 0
      audio.volume = 0.55
      void audio.play().catch(() => {})
    }

    const resetHeroTagFall = () => {
      const tag = document.querySelector('.hero-tag')
      if (heroTagFallTl) {
        heroTagFallTl.kill()
        heroTagFallTl = null
      }
      heroTagFallLocked = false
      heroTagHasFallen = false
      if (tag) {
        gsap.set(tag, { y: 0, x: 0, rotation: -6, zIndex: 2 })
      }
    }

    const runHeroTagFall = () => {
      const tag = document.querySelector('.hero-tag')
      const hero = document.querySelector('.hero')
      if (!tag || !hero) return
      if (heroTagFallLocked || heroTagHasFallen) {
        return
      }

      if (heroTagFallTl) {
        heroTagFallTl.kill()
        heroTagFallTl = null
      }

      const measureDist = () => {
        const hr = hero.getBoundingClientRect()
        const tr = tag.getBoundingClientRect()
        const floorPad = 22
        return Math.max(0, hr.bottom - floorPad - tr.bottom)
      }

      const run = () => {
        const dist = measureDist()
        gsap.set(tag, { transformOrigin: '50% 50%' })

        if (dist < 4) {
          return
        }

        heroTagFallLocked = true

        if (prefersReducedMotion) {
          gsap.set(tag, { y: dist, rotation: -6, zIndex: 3 })
          playAnvilLand()
          heroTagHasFallen = true
          heroTagFallLocked = false
          return
        }

        const dur = Math.min(1.2, Math.max(0.45, 0.36 + dist / 1200))

        heroTagFallTl = gsap
          .timeline({
            onComplete: () => {
              heroTagHasFallen = true
              heroTagFallLocked = false
            },
          })
          .set(tag, { zIndex: 5 })
          .to(tag, {
            y: dist,
            rotation: 5,
            ease: 'power2.in',
            duration: dur,
            onComplete: () => {
              playAnvilLand()
            },
          })
          .to(tag, {
            y: dist - 15,
            rotation: -2,
            duration: 0.12,
            ease: 'power2.out',
          })
          .to(tag, {
            y: dist,
            rotation: -6,
            duration: 0.5,
            ease: 'bounce.out',
          })
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(run)
      })
    }

    const tagEl = document.querySelector('.hero-tag')
    const heroSection = document.querySelector('.hero')
    if (tagEl && heroSection) {
      const onTagPointerEnter = () => {
        runHeroTagFall()
      }
      const onHeroMouseLeave = () => {
        resetHeroTagFall()
      }
      tagEl.addEventListener('pointerenter', onTagPointerEnter)
      heroSection.addEventListener('mouseleave', onHeroMouseLeave)
      cleanupFns.push(() => {
        tagEl.removeEventListener('pointerenter', onTagPointerEnter)
        heroSection.removeEventListener('mouseleave', onHeroMouseLeave)
        resetHeroTagFall()
      })
    } else {
      cleanupFns.push(() => {
        if (heroTagFallTl) {
          heroTagFallTl.kill()
          heroTagFallTl = null
        }
      })
    }

    continueAfterPreloaderRef.current = () => {
      if (preloaderPart2DoneRef.current) {
        return
      }
      preloaderPart2DoneRef.current = true
      gsap
        .timeline({
          onComplete: () => {
            setPreloaderPhase('done')
          },
        })
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        .add(() => {
          lenis.start()
        })
        .fromTo(
          '.hero-title-letter-inner',
          {
            yPercent: 180,
            opacity: 0,
            scale: () => gsap.utils.random(0.5, 0.8),
            rotateX: () => gsap.utils.random(-45, 45),
            rotateY: () => gsap.utils.random(-30, 30),
            rotateZ: () => gsap.utils.random(-25, 25),
            skewX: () => gsap.utils.random(-15, 15),
            transformPerspective: 1000,
          },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            skewX: 0,
            duration: 1.5,
            stagger: { each: 0.05, from: 'random' },
            ease: 'elastic.out(1, 0.5)',
          },
          '-=0.75',
        )
        .fromTo(
          '.hero-tag',
          { opacity: 0, scale: 2.2, rotate: 18, y: -30 },
          {
            opacity: 1,
            scale: 1,
            rotate: -6,
            y: 0,
            duration: 0.55,
            ease: 'power4.out',
            transformOrigin: '0% 50%',
            clearProps: 'scale,y',
          },
          '-=0.3',
        )
        .fromTo(
          '.hero-subtitle-word-inner',
          {
            yPercent: 160,
            opacity: 0,
            scale: 0.8,
            rotateZ: () => gsap.utils.random(-15, 15),
            skewX: () => gsap.utils.random(-10, 10),
          },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            skewX: 0,
            duration: 1.2,
            stagger: { each: 0.04, from: 'start' },
            ease: 'back.out(1.7)',
          },
          '-=1.2',
        )
        .fromTo(
          '.hero-social-link',
          { opacity: 0, y: 30, scale: 0.6, rotate: -45 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'back.out(2.2)',
          },
          '-=0.7',
        )
        .fromTo(
          '.hero-mini-player',
          { opacity: 0, y: 22, scale: 0.72, rotate: -8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.72,
            ease: 'back.out(1.9)',
          },
          '-=0.65',
        )
    }

    const startPreloaderCounting = () => {
      const el = document.querySelector('.preloader-counter')
      const counter = { val: 0 }
      if (el) {
        el.innerText = '0%'
      }
      gsap
        .timeline({
          onComplete: () => {
            if (preloaderPart2DoneRef.current) return
            setPreloaderPhase('exiting')
            playFooterSound('rizz')
            continueAfterPreloaderRef.current()
          },
        })
        .to(counter, {
          val: 100,
          roundProps: 'val',
          duration: 2.2,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (el) {
              el.innerText = `${counter.val}%`
            }
          },
        })
    }
    startPreloaderLoadingRef.current = startPreloaderCounting

    projectItems.forEach((item) => {
      const titleInners = item.querySelectorAll('.project-title-word-inner')
      const tech = item.querySelector('.project-tech')
      const img = item.querySelector('.project-img-float')

      gsap.set(item, { opacity: 0, y: 150, scale: 0.9 })
      if (titleInners.length) {
        gsap.set(titleInners, { y: '160%', rotateZ: 12, opacity: 0 })
      }
      if (tech) {
        gsap.set(tech, { opacity: 0, y: 30, x: 40, rotateX: 45 })
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        })
        .to(item, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0)
        .to(
          titleInners,
          { y: '0%', rotateZ: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: 'back.out(1.5)' },
          0.1,
        )
        .to(tech, { y: 0, x: 0, rotateX: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.2)

      const onEnter = () => {
        if (!isStickyTouch) {
          gsap.killTweensOf(img)
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            overwrite: 'auto',
          })
          gsap.to(cursor, { opacity: 0, duration: 0.2, overwrite: 'auto' })
        }
        if (titleInners.length) {
          gsap.to(titleInners, {
            y: -5,
            duration: 0.45,
            stagger: { each: 0.026, from: 'start' },
            ease: 'back.out(1.5)',
            overwrite: 'auto',
          })
        }
        if (tech) {
          gsap.to(tech, {
            x: 8,
            y: -3,
            letterSpacing: '0.07em',
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      const onLeave = () => {
        if (!isStickyTouch) {
          gsap.killTweensOf(img)
          gsap.to(img, { opacity: 0, scale: 0, duration: 0.3, overwrite: 'auto' })
          gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: 'auto' })
        }
        if (titleInners.length) {
          gsap.to(titleInners, {
            y: 0,
            duration: 0.38,
            stagger: { each: 0.016, from: 'end' },
            ease: 'power3.inOut',
            overwrite: 'auto',
          })
        }
        if (tech) {
          gsap.to(tech, {
            x: 0,
            y: 0,
            letterSpacing: '0em',
            duration: 0.38,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        }
      }
      const onMove = (e) => {
        gsap.to(img, {
          x: e.clientX - window.innerWidth / 2,
          y: e.clientY - window.innerHeight / 2,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      if (isStickyTouch) {
        const onItemPointerDown = (e) => {
          if (e.pointerType === 'mouse') return
          if (activeTouchProjectItem && activeTouchProjectItem !== item) {
            if (activeProjectLeave) {
              activeProjectLeave()
            }
            activeProjectLeave = null
            activeTouchProjectItem = null
          }
          if (activeTouchProjectItem === item) {
            return
          }
          activeTouchProjectItem = item
          activeProjectLeave = onLeave
          onEnter()
        }
        item.addEventListener('pointerdown', onItemPointerDown, true)
        cleanupFns.push(() => {
          item.removeEventListener('pointerdown', onItemPointerDown, true)
        })
      } else {
        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        item.addEventListener('mousemove', onMove)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
          item.removeEventListener('mousemove', onMove)
        })
      }
    })

    const servicesHeader = document.querySelector('.services-header')
    const servicesLead = document.querySelector('.services-lead')
    const runServicesHeaderIntro = () => {
      if (!servicesHeader || prefersReducedMotion) return
      const headerLetters = servicesHeader.querySelectorAll('.services-header-letter-inner')
      gsap.set(headerLetters, { yPercent: 160, rotateZ: 25, scale: 0.6, opacity: 0 })
      gsap
        .timeline()
        .to(servicesHeader, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' })
        .to(
          headerLetters,
          {
            yPercent: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: 'elastic.out(1, 0.4)',
          },
          0,
        )
        .to(
          servicesHeader,
          {
            color: 'var(--accent)',
            duration: 0.18,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
          },
          0.18,
        )
    }

    if (servicesHeader || servicesLead) {
      gsap.set([servicesHeader, servicesLead].filter(Boolean), { opacity: 0, y: 80, rotateX: -20, scale: 0.9 })
      const servicesRevealTl = gsap
        .timeline({
          scrollTrigger: {
            trigger: '.services',
            start: 'top 85%',
            once: true,
          },
        })
        .to([servicesHeader, servicesLead].filter(Boolean), {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.18,
          ease: 'expo.out',
        })
      servicesRevealTl.eventCallback('onComplete', () => {
        runServicesHeaderIntro()
      })
    }
    if (servicesHeader) {
      cleanupFns.push(() => {
        gsap.killTweensOf(servicesHeader)
      })
    }

    serviceItems.forEach((item) => {
      const title = item.querySelector('.service-title')
      const desc = item.querySelector('.service-desc')
      const parts = [title, desc].filter(Boolean)

      gsap.set(item, { opacity: 0, y: 100, rotateX: 30, rotateY: -10, scale: 0.85, transformOrigin: '50% 100%' })
      if (parts.length) {
        gsap.set(parts, { opacity: 0, y: 40, rotateX: 15 })
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        })
        .to(item, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.1,
          ease: 'expo.out',
        })
        .to(
          parts,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'expo.out',
          },
          0.15,
        )

      const onEnter = () => {
        gsap.to(item, {
          y: -7,
          scale: 1.015,
          borderColor: 'var(--accent)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 4,
            color: 'var(--accent)',
            duration: 0.32,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (desc) {
          gsap.to(desc, {
            x: 2,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }

      const onLeave = () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          borderColor: '',
          duration: 0.42,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 0,
            color: '',
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (desc) {
          gsap.to(desc, {
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }

      if (isStickyTouch) {
        const onTap = (e) => {
          if (e.pointerType === 'mouse') return
          onEnter()
          window.setTimeout(() => onLeave(), 260)
        }
        item.addEventListener('pointerdown', onTap, true)
        cleanupFns.push(() => {
          item.removeEventListener('pointerdown', onTap, true)
        })
      } else {
        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
        })
      }
    })

    const packagesHeader = document.querySelector('.packages-header')
    const packagesLead = document.querySelector('.packages-lead')
    const packagesExtras = document.querySelector('.packages-extras')
    const packagesPositioning = document.querySelector('.packages-positioning')
    const packagesFlow = document.querySelector('.packages-flow')
    const packagesShowcase = document.querySelector('.packages-showcase')
    const packagesMetaItems = [packagesExtras, packagesPositioning, packagesFlow].filter(Boolean)

    const runPackagesHeaderIntro = () => {
      if (!packagesHeader || prefersReducedMotion) return
      const letters = packagesHeader.querySelectorAll('.packages-header-letter-inner')
      gsap.set(letters, { y: 80, rotateZ: 30, scale: 0.4, opacity: 0 })
      gsap
        .timeline()
        .to(packagesHeader, { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' })
        .to(
          letters,
          {
            y: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            duration: 1.3,
            stagger: 0.045,
            ease: 'elastic.out(1, 0.3)',
          },
          0,
        )
        .to(
          packagesHeader,
          {
            color: 'var(--accent)',
            duration: 0.18,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
          },
          0.18,
        )
    }

    if (
      packagesHeader ||
      packagesLead ||
      packageCardsEls.length ||
      packagesExtras ||
      packagesPositioning ||
      packagesFlow ||
      packagesShowcase
    ) {
      const introParts = [packagesHeader, packagesLead].filter(Boolean)
      const showcaseTitle = packagesShowcase?.querySelector('.packages-showcase-title')
      const showcasePrice = packagesShowcase?.querySelector('.packages-showcase-price')
      const showcaseLabels = packagesShowcase?.querySelectorAll('.package-label') || []
      const showcaseRows = packagesShowcase?.querySelectorAll('.package-list li') || []
      const metaTitles = document.querySelectorAll(
        '.packages-extras .packages-subtitle, .packages-positioning .packages-subtitle, .packages-flow .packages-subtitle',
      )
      const metaRows = document.querySelectorAll(
        '.packages-extras .package-list li, .packages-positioning .package-list li, .packages-flow .package-list li',
      )
      if (introParts.length) {
        gsap.set(introParts, { opacity: 0, y: 80, scale: 0.9, rotateX: 15 })
      }
      if (packageCardsEls.length) {
        gsap.set(packageCardsEls, { opacity: 0, y: 100, rotateX: -30, rotateY: 15, scale: 0.85, transformOrigin: '50% 100%' })
      }
      const packShowBlock = [packagesShowcase, packagesExtras, packagesPositioning, packagesFlow].filter(Boolean)
      if (packShowBlock.length) {
        gsap.set(packShowBlock, {
          opacity: 0,
          y: 80,
          rotateX: 15,
          scale: 0.95,
        })
      }
      const showcaseTP = [showcaseTitle, showcasePrice].filter(Boolean)
      if (showcaseTP.length) {
        gsap.set(showcaseTP, { opacity: 0, y: 40, rotateX: 20 })
      }
      if (showcaseLabels.length) {
        gsap.set(showcaseLabels, { opacity: 0, y: 20 })
      }
      if (showcaseRows.length) {
        gsap.set(showcaseRows, { opacity: 0, y: 20, x: -10 })
      }
      if (metaTitles.length) {
        gsap.set(metaTitles, { opacity: 0, y: 30, rotateX: 15 })
      }
      if (metaRows.length) {
        gsap.set(metaRows, { opacity: 0, y: 20, x: -10 })
      }

      const packagesTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.packages',
          start: 'top 85%',
          once: true,
        },
      })
      if (introParts.length) {
        packagesTl.to(introParts, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: 'expo.out',
        })
      }
      if (packageCardsEls.length) {
        packagesTl.to(
          packageCardsEls,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
          },
          introParts.length ? '-=0.6' : 0,
        )
      }
      const packShowAnim = [packagesShowcase, ...packagesMetaItems].filter(Boolean)
      if (packShowAnim.length) {
        packagesTl.to(
          packShowAnim,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out',
          },
          '-=0.8',
        )
      }
      if (showcaseTP.length) {
        packagesTl.to(
          showcaseTP,
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.24',
        )
      }
      if (showcaseLabels.length) {
        packagesTl.to(
          showcaseLabels,
          {
            opacity: 1,
            y: 0,
            duration: 0.34,
            stagger: 0.04,
            ease: 'power2.out',
          },
          '-=0.22',
        )
      }
      if (showcaseRows.length) {
        packagesTl.to(
          showcaseRows,
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.01,
            ease: 'power2.out',
          },
          '-=0.18',
        )
      }
      if (metaTitles.length) {
        packagesTl.to(
          metaTitles,
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '-=0.18',
        )
      }
      if (metaRows.length) {
        packagesTl.to(
          metaRows,
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.01,
            ease: 'power2.out',
          },
          '-=0.22',
        )
      }
      packagesTl.eventCallback('onComplete', () => {
        runPackagesHeaderIntro()
      })
    }

    packagesMetaItems.forEach((item) => {
      const title = item.querySelector('.packages-subtitle')
      const rows = item.querySelectorAll('.package-list li')
      const onEnter = () => {
        gsap.to(item, {
          y: -7,
          scale: 1.012,
          borderColor: 'var(--accent)',
          duration: 0.34,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 4,
            color: 'var(--accent)',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (rows.length) {
          gsap.to(rows, {
            x: 2,
            duration: 0.28,
            stagger: 0.02,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      const onLeave = () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          borderColor: '',
          duration: 0.36,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 0,
            color: '',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (rows.length) {
          gsap.to(rows, {
            x: 0,
            duration: 0.3,
            stagger: 0.015,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      if (isStickyTouch) {
        const onTap = (e) => {
          if (e.pointerType === 'mouse') return
          onEnter()
          window.setTimeout(() => onLeave(), 230)
        }
        item.addEventListener('pointerdown', onTap, true)
        cleanupFns.push(() => item.removeEventListener('pointerdown', onTap, true))
      } else {
        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
        })
      }
    })

    packageCardsEls.forEach((card) => {
      const packageColor = getComputedStyle(card).getPropertyValue('--package-color').trim() || 'var(--accent)'
      const onEnter = () => {
        gsap.to(card, {
          y: -7,
          scale: 1.012,
          borderColor: packageColor,
          duration: 0.32,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          borderColor: '',
          duration: 0.38,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      if (isStickyTouch) {
        const onTap = (e) => {
          if (e.pointerType === 'mouse') return
          onEnter()
          window.setTimeout(() => onLeave(), 220)
        }
        card.addEventListener('pointerdown', onTap, true)
        cleanupFns.push(() => {
          card.removeEventListener('pointerdown', onTap, true)
        })
      } else {
        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        
        // --- 3D TILT EFFECT ---
        const onMoveTilt = (e) => {
          const rect = card.getBoundingClientRect()
          const ax = (e.clientX - (rect.left + rect.width / 2)) / 15
          const ay = (e.clientY - (rect.top + rect.height / 2)) / 15
          gsap.to(card, {
            transformPerspective: 1200,
            rotateY: ax,
            rotateX: -ay,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        const onLeaveTilt = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
          })
        }
        
        card.addEventListener('mousemove', onMoveTilt)
        card.addEventListener('mouseleave', onLeaveTilt)
        cleanupFns.push(() => {
          card.removeEventListener('mouseenter', onEnter)
          card.removeEventListener('mouseleave', onLeave)
          card.removeEventListener('mousemove', onMoveTilt)
          card.removeEventListener('mouseleave', onLeaveTilt)
        })
      }
    })

    // --- EXTRA DYNAMIC GSAP EXPERIENCES FOR SECTIONS BELOW "SERVICES" ---

    // 1. SERVICES PARALLAX - Removed to prevent overlap with the lead text

    // 2. SHOWCASE ORB - Removed custom float/spin per user request

    // 3. MARQUEE PARALLAX & VELOCITY
    const marqueeInner = document.querySelector('.marquee-inner');
    if (marqueeInner && !prefersReducedMotion) {
       gsap.to(marqueeInner, {
          xPercent: isStickyTouch ? -10 : -25,
          ease: 'none',
          scrollTrigger: {
            trigger: '.marquee',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
       });
       
       const marqueeEl = document.querySelector('.marquee');
       if (marqueeEl) {
         gsap.from(marqueeEl, {
            scale: 0.95,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
               trigger: '.marquee',
               start: 'top 95%'
            }
         });
       }
    }

    // 4. FOOTER DYNAMIC REVEAL & PARALLAX
    const footerEl = document.querySelector('.footer');
    if (footerEl && !prefersReducedMotion && !isStickyTouch) {
      const footerLines = footerEl.querySelectorAll('.footer-stack-lead p, .magnetic-wrap, .scrivimi-hint-text, .self-destruct-btn, .footer-meta');
      if (footerLines.length) {
        gsap.from(footerLines, {
           opacity: 0,
           y: 80,
           rotateX: -15,
           scale: 0.95,
           duration: 1.5,
           stagger: 0.1,
           ease: 'expo.out',
           scrollTrigger: {
              trigger: '.footer',
              start: 'top 85%',
           }
        })
      }
      
      const footerStack = footerEl.querySelector('.footer-stack');
      if (footerStack) {
         gsap.fromTo(footerStack, 
          { y: 80 },
          {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: '.footer',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
         );
      }
    }
    // --- END EXTRA ---

    return () => {
      clearActiveProjectTouch()
      if (heroSubEl && heroSocialEl) {
        gsap.killTweensOf([heroSubEl, heroSocialEl])
        gsap.set([heroSubEl, heroSocialEl], { x: 0, y: 0 })
      }
      cleanupFns.forEach((cleanup) => cleanup())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- come in App: solo pointer + prefers-reduced-motion
  }, [isCoarsePointer, prefersReducedMotion])
}

