import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Intro from './components/Intro'
import ModuleSection from './components/ModuleSection'
import Benefits from './components/Benefits'
import Stats from './components/Stats'
import Audience from './components/Audience'
import VideoSection from './components/VideoSection'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { MODULES } from './data/modules'
import { audio } from './lib/audio'

gsap.registerPlugin(ScrollTrigger)

/** Reads [data-narrate] sections aloud as they scroll into view. */
function useNarrator() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-narrate]'))
    if (!elements.length) return
    const spoken = new WeakSet<HTMLElement>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (!entry.isIntersecting || spoken.has(el) || !audio.enabled) continue
          spoken.add(el)
          audio.speak(el.dataset.narrate ?? '')
        }
      },
      { threshold: 0.35 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useSmoothScroll() {
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    if (import.meta.env.DEV) {
      ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    }

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // smooth anchor navigation
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export default function App() {
  useSmoothScroll()
  useNarrator()

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh()
    } else {
      window.addEventListener('load', refresh)
    }
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <VideoSection />
        <div
          className="modules-heading container"
          id="modulos"
          data-narrate="Nuestros módulos: cinco módulos, una ciudad funcionando."
        >
          <span className="kicker">Nuestros módulos</span>
          <h2>
            Cinco módulos.
            <br />
            Una ciudad funcionando.
          </h2>
        </div>
        {MODULES.map((module) => (
          <ModuleSection key={module.id} module={module} />
        ))}
        <Benefits />
        <Stats />
        <Audience />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
