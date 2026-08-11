import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

const STATS: Stat[] = [
  { value: 5, label: 'Módulos integrados' },
  { value: 1, label: 'Sola plataforma' },
  { value: 100, suffix: '%', label: 'Digital y sin papel' },
  { value: 24, suffix: '/7', label: 'Atención con IA' },
]

export default function Stats() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
        const target = Number(el.dataset.value ?? 0)
        const suffix = el.dataset.suffix ?? ''
        const counter = { value: 0 }
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`
          },
        })
      })

      gsap.from('.stat', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      className="stats"
      ref={ref}
      data-narrate="Cinco módulos integrados en una sola plataforma: cien por ciento digital, con atención las veinticuatro horas."
    >
      <div className="stats-grid container">
        {STATS.map((stat) => (
          <div className="stat" key={stat.label}>
            <div
              className="stat-num"
              data-value={stat.value}
              data-suffix={stat.suffix ?? ''}
            >
              0{stat.suffix ?? ''}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
