import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export default function VideoSection() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.video-head > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
      gsap.from('.video-frame', {
        y: 80,
        scale: 0.94,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.video-frame', start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="video-section" id="video" ref={ref}>
      <div className="container">
        <div className="video-head">
          <span className="kicker">ProCiudad en acción</span>
          <h2 className="section-h2">
            Mira cómo <span className="hl">Oaxaca</span> ya lo está viviendo
          </h2>
          <p className="video-sub">
            Descubre cómo los ciudadanos de Oaxaca están transformando su
            comunidad a través de reportes ciudadanos y participación activa.
          </p>
        </div>
        <div className="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/9OEl8xCFAQ0"
            title="Conoce ProCiudad Oaxaca"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
