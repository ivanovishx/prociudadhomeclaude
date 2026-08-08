import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { asset } from '../lib/asset'

export default function Audience() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.audience .kicker, .audience h2', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
      gsap.from('.aud-card', {
        y: 80,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.audience-grid', start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="audience" id="plataforma" ref={ref}>
      <div className="container">
        <span className="kicker">Una plataforma, dos experiencias</span>
        <h2 className="section-h2">
          Hecha para el gobierno,{' '}
          <span className="hl">amada por los ciudadanos</span>
        </h2>
        <div className="audience-grid">
          <article className="aud-card">
            <img
              src={asset('/screenshots/comunidad-panel.png')}
              alt="Portal administrativo de ProCiudad"
              loading="lazy"
            />
            <div className="aud-body">
              <span className="aud-tag">Para el gobierno</span>
              <h3>Control total de la operación</h3>
              <p>
                Paneles de solicitudes, indicadores estratégicos, campañas de
                cobranza y gestión entre dependencias — todo desde un portal
                administrativo unificado.
              </p>
            </div>
          </article>
          <article className="aud-card">
            <img
              src={asset('/screenshots/comunidad-evento.png')}
              alt="Eventos y participación ciudadana"
              loading="lazy"
            />
            <div className="aud-body">
              <span className="aud-tag">Para la ciudadanía</span>
              <h3>Su ciudad, en su bolsillo</h3>
              <p>
                Reportar una incidencia, pagar el predial, consultar un trámite o
                descubrir eventos: todo en segundos, desde el teléfono y sin
                filas.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
