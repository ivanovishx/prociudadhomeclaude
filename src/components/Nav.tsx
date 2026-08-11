import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from './Logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const st = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: self.progress })
        }
      },
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      st.kill()
    }
  }, [])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#inicio" className="nav-logo" aria-label="ProCiudad — inicio">
          <Logo />
        </a>
        <nav className="nav-links" aria-label="Navegación principal">
          <a href="#modulos">Módulos</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#plataforma">Plataforma</a>
        </nav>
        <a className="btn btn--sm" href="#contacto">Solicitar demo</a>
        <div className="nav-progress" ref={progressRef} />
      </div>
    </header>
  )
}
