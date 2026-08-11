import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import type { ModuleData } from '../data/modules'
import { asset } from '../lib/asset'

interface Props {
  module: ModuleData
}

const SHOT_CLASSES = ['shot--main', 'shot--a', 'shot--b']

export default function ModuleSection({ module }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const side = module.index % 2 === 1 ? 'left' : 'right'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          // copy reveals while the section approaches the viewport
          gsap.from('.module-copy > *', {
            y: 64,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          })

          // screenshots + giant number are driven by the pinned scrub
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=130%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          })

          tl.fromTo(
            '.module-bignum',
            { yPercent: -20, autoAlpha: 0 },
            { yPercent: -50, autoAlpha: 1, duration: 0.4 },
            0,
          )
            .fromTo(
              '.shot',
              {
                y: (i: number) => 340 + i * 140,
                rotate: (i: number) => (side === 'left' ? 7 - i * 5 : -7 + i * 5),
                autoAlpha: 0,
              },
              {
                y: 0,
                rotate: (i: number) => (i === 0 ? 0 : i === 1 ? 2.5 : -2),
                autoAlpha: 1,
                stagger: 0.09,
                duration: 0.42,
              },
              0.04,
            )
            // gentle drift while the section stays pinned
            .to('.shot--main', { y: -46 }, 0.55)
            .to('.shot--a', { y: -90 }, 0.55)
            .to('.module-bignum', { yPercent: -78 }, 0.55)
          if (module.screenshots.length > 2) {
            tl.to('.shot--b', { y: -66 }, 0.55)
          }
        },
      )

      mm.add(
        '(max-width: 899px), (prefers-reduced-motion: reduce)',
        () => {
          gsap.from('.module-copy > *', {
            y: 40,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          })
          gsap.utils.toArray<HTMLElement>('.shot').forEach((shot) => {
            gsap.from(shot, {
              y: 60,
              autoAlpha: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: shot, start: 'top 85%' },
            })
          })
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [side])

  return (
    <section
      className={`module module--${side}`}
      id={module.id}
      ref={sectionRef}
      style={{ '--accent': module.accent } as CSSProperties}
    >
      <div className="module-glow" />
      <div className="module-inner container">
        <div className="module-bignum" aria-hidden="true">
          {module.index}
        </div>
        <div className="module-grid">
          <div className="module-copy">
            <span className="kicker">{module.kicker}</span>
            <h3 className="module-title">{module.title}</h3>
            <p className="module-tagline">{module.tagline}</p>
            {module.description.map((paragraph, i) => (
              <p className="module-desc" key={i}>{paragraph}</p>
            ))}
            <ul className="module-features">
              {module.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="module-visual">
            {module.screenshots.map((shot, i) => (
              <figure className={`shot ${SHOT_CLASSES[i] ?? ''}`} key={shot.src}>
                <div className="shot-bar" aria-hidden="true">
                  <i /><i /><i />
                </div>
                <img
                  src={asset(shot.src)}
                  alt={shot.alt}
                  loading="lazy"
                  style={{ aspectRatio: shot.aspect }}
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
