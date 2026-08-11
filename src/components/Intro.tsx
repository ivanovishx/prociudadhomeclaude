import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const WORDS: Array<{ text: string; hl?: boolean }> = [
  { text: 'Un' },
  { text: 'gobierno' },
  { text: 'digital' },
  { text: 'no' },
  { text: 'es' },
  { text: 'el' },
  { text: 'futuro:' },
  { text: 'es' },
  { text: 'lo' },
  { text: 'que' },
  { text: 'tus' },
  { text: 'ciudadanos' },
  { text: 'esperan' },
  { text: 'hoy.', hl: true },
  { text: 'ProCiudad' },
  { text: 'conecta' },
  { text: 'dependencias,' },
  { text: 'trámites,' },
  { text: 'pagos' },
  { text: 'y' },
  { text: 'ciudadanos' },
  { text: 'en' },
  { text: 'una' },
  { text: 'sola' },
  { text: 'plataforma', hl: true },
  { text: 'impulsada' },
  { text: 'por' },
  { text: 'inteligencia' },
  { text: 'artificial.', hl: true },
]

export default function Intro() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.intro-text .w',
        { opacity: 0.1, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: 0.6,
          },
        },
      )
      gsap.from('.intro-foot', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.intro-foot',
          start: 'top 88%',
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      className="intro"
      ref={ref}
      data-narrate="Un gobierno digital no es el futuro: es lo que tus ciudadanos esperan hoy. ProCiudad conecta dependencias, trámites, pagos y ciudadanos en una sola plataforma."
    >
      <div className="container">
        <p className="intro-text">
          {WORDS.map((w, i) => (
            <span className={`w${w.hl ? ' hl' : ''}`} key={i}>
              {w.text}
            </span>
          ))}
        </p>
        <div className="intro-foot">
          <span className="num">5</span>
          <span>
            módulos dentro de un sistema operativo digital que tu ciudad,
            <br />
            los ciudadanos y tus vecinos necesitan.
          </span>
        </div>
      </div>
    </section>
  )
}
