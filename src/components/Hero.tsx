import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const TITLE_LINES: Array<Array<{ text: string; accent?: boolean }>> = [
  [{ text: 'El sistema operativo' }],
  [{ text: 'digital', accent: true }, { text: ' de tu ciudad' }],
]

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .from('.split-line .inner', {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.12,
          delay: 0.15,
        })
        .from('.hero-badge', { y: -18, autoAlpha: 0, duration: 0.8 }, '-=0.9')
        .from('.hero-sub', { y: 26, autoAlpha: 0, duration: 0.9 }, '-=0.8')
        .from('.hero-actions', { y: 26, autoAlpha: 0, duration: 0.9 }, '-=0.7')
        .from('.hero-scroll', { autoAlpha: 0, duration: 0.8 }, '-=0.5')

      gsap.to(contentRef.current, {
        yPercent: -28,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 35%',
          scrub: true,
        },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={heroRef} id="inicio">
      <Suspense fallback={<div className="hero-canvas" />}>
        <HeroCanvas />
      </Suspense>
      <div className="hero-vignette" />
      <div className="hero-content" ref={contentRef}>
        <div className="hero-badge">
          <span className="dot" />
          Impulsado por inteligencia artificial
        </div>
        <h1 className="hero-title">
          {TITLE_LINES.map((line, i) => (
            <span className="split-line" key={i}>
              <span className="inner">
                {line.map((part, j) =>
                  part.accent ? (
                    <span className="accent" key={j}>{part.text}</span>
                  ) : (
                    <span key={j}>{part.text}</span>
                  ),
                )}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-sub">
          ProCiudad resuelve todas las necesidades digitales que existen en una
          ciudad: reportes ciudadanos, colaboración entre dependencias, cobranza,
          pagos y multas — en una sola plataforma.
        </p>
        <div className="hero-actions">
          <a className="btn" href="#contacto">Solicita una demo</a>
          <a className="btn btn--ghost" href="#modulos">Explora los módulos</a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Desliza</span>
        <span className="line" />
      </div>
    </section>
  )
}
