import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CTA() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta > .container > *', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      className="cta"
      id="contacto"
      ref={ref}
      data-narrate="Lleva tu ciudad al futuro digital. Agenda una demostración."
    >
      <div className="container">
        <span className="kicker" style={{ justifyContent: 'center' }}>
          Da el siguiente paso
        </span>
        <h2>
          Lleva tu ciudad
          <br />
          <span className="accent">al futuro digital</span>
        </h2>
        <p>
          Agenda una demostración y descubre cómo los 5 módulos de ProCiudad
          transforman la operación de tu gobierno y la experiencia de tus
          ciudadanos.
        </p>
        <div className="cta-actions">
          <a className="btn" href="mailto:prociudad1@gmail.com?subject=Solicitud%20de%20demo%20ProCiudad">
            Solicita una demo
          </a>
          <a className="btn btn--ghost" href="https://www.prociudad.com" target="_blank" rel="noreferrer">
            Visita la plataforma
          </a>
        </div>
      </div>
    </section>
  )
}
