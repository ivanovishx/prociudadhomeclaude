import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  Bot,
  ChartColumn,
  Eye,
  FileText,
  Landmark,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { BENEFITS, type BenefitIcon } from '../data/modules'

const ICONS: Record<BenefitIcon, LucideIcon> = {
  papel: FileText,
  recaudacion: TrendingUp,
  atencion: Bot,
  transparencia: Eye,
  datos: ChartColumn,
  escala: Landmark,
}

const AUTO_MS = 4000
const GAP = 24

interface CarouselApi {
  goTo: (index: number) => void
  restart: () => void
}

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<CarouselApi | null>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.benefits-head > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.benefits-head', start: 'top 75%' },
      })
      gsap.from('.benefit-card', {
        y: 36,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 82%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const indexRef = { current: 0 }
    let timer = 0

    const metrics = () => {
      const first = track.children[0] as HTMLElement | undefined
      const step = (first?.offsetWidth ?? 320) + GAP
      const max = Math.max(0, track.scrollWidth - wrap.clientWidth)
      return { step, max, maxIndex: Math.ceil(max / step) }
    }

    const goTo = (i: number, animate = true) => {
      const { step, max, maxIndex } = metrics()
      const total = maxIndex + 1
      const idx = ((i % total) + total) % total
      indexRef.current = idx
      setPage(idx)
      const x = -Math.min(idx * step, max)
      if (animate) gsap.to(track, { x, duration: 0.75, ease: 'power3.out' })
      else gsap.set(track, { x })
    }

    const stop = () => window.clearInterval(timer)
    const restart = () => {
      stop()
      if (!prefersReduced) {
        timer = window.setInterval(() => goTo(indexRef.current + 1), AUTO_MS)
      }
    }

    apiRef.current = { goTo: (i) => { goTo(i); restart() }, restart }
    setPages(metrics().maxIndex + 1)
    restart()

    // drag / swipe
    let dragging = false
    let startX = 0
    let startTrackX = 0

    const onDown = (e: PointerEvent) => {
      dragging = true
      startX = e.clientX
      startTrackX = Number(gsap.getProperty(track, 'x'))
      stop()
      gsap.killTweensOf(track)
      try {
        wrap.setPointerCapture(e.pointerId)
      } catch {
        // pointer may already be gone (synthetic or cancelled events)
      }
      wrap.classList.add('is-dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const { max } = metrics()
      let x = startTrackX + (e.clientX - startX)
      if (x > 0) x = x / 3
      else if (x < -max) x = -max + (x + max) / 3
      gsap.set(track, { x })
    }
    const settle = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      wrap.classList.remove('is-dragging')
      const { step, maxIndex } = metrics()
      const x = Number(gsap.getProperty(track, 'x'))
      const dx = e.clientX - startX
      let idx: number
      if (dx < -step * 0.12) idx = Math.ceil(-x / step)
      else if (dx > step * 0.12) idx = Math.floor(-x / step)
      else idx = Math.round(-x / step)
      goTo(Math.max(0, Math.min(idx, maxIndex)))
      restart()
    }

    const onResize = () => {
      setPages(metrics().maxIndex + 1)
      goTo(indexRef.current, false)
    }

    wrap.addEventListener('pointerdown', onDown)
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerup', settle)
    wrap.addEventListener('pointercancel', settle)
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      wrap.removeEventListener('pointerdown', onDown)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerup', settle)
      wrap.removeEventListener('pointercancel', settle)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      className="benefits"
      id="beneficios"
      ref={sectionRef}
      data-narrate="Beneficios: lo que tu gobierno gana con ProCiudad."
    >
      <div className="container">
        <div className="benefits-head">
          <span className="kicker">Beneficios</span>
          <h2>Lo que tu gobierno gana con ProCiudad</h2>
        </div>
        <div className="benefits-track-wrap" ref={wrapRef}>
          <div className="benefits-track" ref={trackRef}>
            {BENEFITS.map((benefit) => {
              const Icon = ICONS[benefit.icon]
              return (
                <article className="benefit-card" key={benefit.title}>
                  <span className="benefit-icon" aria-hidden="true">
                    <Icon size={26} strokeWidth={1.5} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              )
            })}
          </div>
        </div>
        <div className="benefits-dots" role="tablist" aria-label="Página del carrusel">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === page ? 'active' : ''}
              aria-label={`Ir a la página ${i + 1}`}
              aria-selected={i === page}
              onClick={() => apiRef.current?.goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
