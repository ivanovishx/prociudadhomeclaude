import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { BENEFITS } from '../data/modules'

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          const track = trackRef.current
          if (!track) return
          const getDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth + 80)

          gsap.to(track, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
        },
      )

      gsap.from('.benefits-head > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.benefits-head',
          start: 'top 75%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="benefits" id="beneficios" ref={sectionRef}>
      <div className="benefits-head container">
        <span className="kicker">Beneficios</span>
        <h2>Lo que tu gobierno gana con ProCiudad</h2>
      </div>
      <div className="benefits-track-wrap">
        <div className="benefits-track" ref={trackRef}>
          {BENEFITS.map((benefit) => (
            <article className="benefit-card" key={benefit.title}>
              <span className="emoji" aria-hidden="true">{benefit.emoji}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
