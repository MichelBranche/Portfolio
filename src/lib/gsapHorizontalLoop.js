import gsap from 'gsap'

/** Loop orizzontale infinito (pattern GSAP community / awwwards marquee). */
export function gsapHorizontalLoop(items, config = {}) {
  const list = gsap.utils.toArray(items)
  if (!list.length) return null

  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  })

  const length = list.length
  const startX = list[0].offsetLeft
  const times = []
  const widths = []
  const xPercents = []
  let curIndex = 0
  const pixelsPerSecond = (config.speed || 1) * 100
  const snap =
    config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1)

  gsap.set(list, {
    xPercent: (i, el) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')))
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          gsap.getProperty(el, 'xPercent'),
      )
      return xPercents[i]
    },
  })
  gsap.set(list, { x: 0 })

  const totalWidth =
    list[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    list[length - 1].offsetWidth * gsap.getProperty(list[length - 1], 'scaleX') +
    (parseFloat(config.paddingRight) || 0)

  for (let i = 0; i < length; i++) {
    const item = list[i]
    const curX = (xPercents[i] / 100) * widths[i]
    const distanceToStart = item.offsetLeft + curX - startX
    const distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    ).fromTo(
      item,
      {
        xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
      },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond,
    )

    times[i] = distanceToStart / pixelsPerSecond
  }

  function toIndex(index, vars = {}) {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length
    }
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars)
  tl.previous = (vars) => toIndex(curIndex - 1, vars)
  tl.current = () => curIndex
  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.times = times
  tl.progress(1, true).progress(0, true)

  if (config.reversed) {
    tl.vars.onReverseComplete?.()
    tl.reverse()
  }

  return tl
}
