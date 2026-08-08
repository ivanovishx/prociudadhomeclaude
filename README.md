# ProCiudad — Landing Page

Nueva landing page para [www.prociudad.com](https://www.prociudad.com): una experiencia de scroll animada (estilo [activetheory.net](https://activetheory.net)) que presenta los 5 módulos de la plataforma, en español.

## Stack

- **React 19 + TypeScript + Vite**
- **GSAP + ScrollTrigger** — animaciones al hacer scroll (secciones fijadas, parallax, contadores, revelado de texto)
- **Lenis** — scroll suave
- **Three.js + React Three Fiber + drei** — campo de partículas 3D en el hero (cargado en un chunk aparte)
- **Fuentes**: Space Grotesk (display) e Inter (texto), auto-alojadas vía Fontsource

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # build de producción en dist/
npm run preview    # sirve el build de producción
```

## Estructura

```
src/
  data/modules.ts          # contenido de los 5 módulos, beneficios (editar textos aquí)
  components/
    Hero.tsx               # portada con canvas 3D y título animado
    HeroCanvas.tsx         # campo de partículas Three.js
    Nav.tsx                # navegación fija + barra de progreso de scroll
    Marquee.tsx            # cinta de conceptos
    Intro.tsx              # manifiesto con revelado palabra por palabra
    ModuleSection.tsx      # sección fijada por módulo (capturas con parallax)
    Benefits.tsx           # carrusel horizontal de beneficios
    Stats.tsx              # contadores animados
    Audience.tsx           # tarjetas gobierno / ciudadanía
    CTA.tsx                # llamado a la acción (solicitar demo)
    Footer.tsx
  global.css               # sistema de diseño completo (colores, tipografía, secciones)
public/
  screenshots/             # capturas reales de la plataforma (extraídas del PDF)
  logo-prociudad-white.png
```

## Personalización rápida

- **Textos de los módulos**: `src/data/modules.ts`
- **Correo de contacto del botón "Solicita una demo"**: `src/components/CTA.tsx` y `Footer.tsx` (actualmente `prociudad1@gmail.com`)
- **Colores de marca**: variables CSS al inicio de `src/global.css`
- **Capturas**: reemplaza los PNG en `public/screenshots/` (idealmente manteniendo proporciones similares; el campo `aspect` en `modules.ts` reserva el espacio)
- **Fotos de ciudadanos/gobierno**: las tarjetas de la sección "Una plataforma, dos experiencias" (`Audience.tsx`) aceptan cualquier fotografía — sustituye las imágenes por fotos reales de ciudadanos y funcionarios cuando las tengan

## Accesibilidad y rendimiento

- Respeta `prefers-reduced-motion`: sin scroll suave ni secciones fijadas para usuarios que reducen el movimiento
- En pantallas < 900 px las secciones no se fijan (layout apilado simple)
- Three.js se carga de forma diferida (code-splitting) para no bloquear el primer render
- Imágenes con `loading="lazy"` y `aspect-ratio` reservado (sin saltos de layout)
