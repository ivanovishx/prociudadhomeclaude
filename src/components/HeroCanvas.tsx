import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MEXICO_DOTS } from '../data/mexicoDots'

const COUNT = MEXICO_DOTS.length
/** map half-height in normalized units (half-width is 1) */
const HALF_H = 0.6557
/** grid pitch of the generated dots in normalized units */
const PITCH = 2 / 58
const DOT_RADIUS = (PITCH * 0.9) / 2
const ASSEMBLE_DURATION = 2.4
const ASSEMBLE_DELAY_SPREAD = 1.1

/** pointer interaction (normalized map units, map width = 2) */
const REPEL_RADIUS = 0.45
const REPEL_STRENGTH = 3.2
const SPRING = 42
const DAMPING = 7.5

interface PointerState {
  /** position in canvas NDC (-1..1, y up) */
  x: number
  y: number
  active: boolean
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function DotMap({ pointerRef }: { pointerRef: React.RefObject<PointerState> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  // own the clock: THREE.Clock is deprecated in recent three versions
  const startTime = useRef<number | null>(null)
  const lastTime = useRef<number | null>(null)

  // fit the map inside the canvas viewport (reactive to resizes)
  const viewport = useThree((state) => state.viewport)
  const scale = Math.min(viewport.width * 0.46, viewport.height * 0.6)

  const { starts, delays, phases, colorArray, offsets, velocities } = useMemo(() => {
    const starts = new Float32Array(COUNT * 3)
    const delays = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)
    const colorArray = new Float32Array(COUNT * 3)
    const offsets = new Float32Array(COUNT * 2)
    const velocities = new Float32Array(COUNT * 2)

    // brand gradient: deep wine (NW) -> primary wine -> vivid pink (SE)
    const cNW = new THREE.Color('#2f0819')
    const cMid = new THREE.Color('#7d0f4c')
    const cSE = new THREE.Color('#ff2d78')
    const c = new THREE.Color()

    // deterministic pseudo-random (stable between renders)
    let seed = 42
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    for (let i = 0; i < COUNT; i++) {
      const [nx, ny] = MEXICO_DOTS[i]

      // scattered start: wide ring around the map with depth (normalized units)
      const angle = rand() * Math.PI * 2
      const radius = 1.6 + rand() * 2.2
      starts[i * 3] = Math.cos(angle) * radius
      starts[i * 3 + 1] = Math.sin(angle) * radius * 0.7
      starts[i * 3 + 2] = -1.2 - rand() * 2.4

      // sweep west -> east like a wave, with a touch of noise
      delays[i] = ((nx + 1) / 2) * ASSEMBLE_DELAY_SPREAD + rand() * 0.25
      phases[i] = rand() * Math.PI * 2

      // diagonal gradient NW (dark) -> SE (pink)
      const t = THREE.MathUtils.clamp(
        ((nx + 1) / 2) * 0.55 + (1 - (ny + HALF_H) / (HALF_H * 2)) * 0.45,
        0,
        1,
      )
      if (t < 0.5) c.lerpColors(cNW, cMid, t / 0.5)
      else c.lerpColors(cMid, cSE, (t - 0.5) / 0.5)
      colorArray[i * 3] = c.r
      colorArray[i * 3 + 1] = c.g
      colorArray[i * 3 + 2] = c.b
    }

    return { starts, delays, phases, colorArray, offsets, velocities }
  }, [])

  // park every instance at its scattered start before the first frame
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(starts[i * 3], starts[i * 3 + 1], starts[i * 3 + 2])
      dummy.scale.setScalar(0.3)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [starts, dummy])

  useFrame(() => {
    const mesh = meshRef.current
    const group = groupRef.current
    if (!mesh || !group) return

    const now = performance.now()
    if (startTime.current === null) startTime.current = now
    const t = (now - startTime.current) / 1000
    const dt = Math.min((now - (lastTime.current ?? now)) / 1000, 0.05)
    lastTime.current = now

    // pointer in local map units (map plane sits at z=0, group is centered)
    const pointer = pointerRef.current
    const px = (pointer.x * viewport.width) / 2 / scale
    const py = (pointer.y * viewport.height) / 2 / scale
    const damp = Math.exp(-DAMPING * dt)

    for (let i = 0; i < COUNT; i++) {
      const p = easeOutCubic(THREE.MathUtils.clamp((t - 0.2 - delays[i]) / ASSEMBLE_DURATION, 0, 1))
      const bob = p >= 1 ? Math.sin(t * 1.6 + phases[i]) * 0.012 : 0

      const baseX = THREE.MathUtils.lerp(starts[i * 3], MEXICO_DOTS[i][0], p)
      const baseY = THREE.MathUtils.lerp(starts[i * 3 + 1], MEXICO_DOTS[i][1], p)
      const baseZ = THREE.MathUtils.lerp(starts[i * 3 + 2], 0, p)

      // spring physics: cursor/finger repels nearby dots, spring pulls them home
      let vx = velocities[i * 2]
      let vy = velocities[i * 2 + 1]
      let ox = offsets[i * 2]
      let oy = offsets[i * 2 + 1]

      if (pointer.active && p >= 1) {
        const dx = baseX + ox - px
        const dy = baseY + oy - py
        const dist = Math.hypot(dx, dy)
        if (dist < REPEL_RADIUS && dist > 0.0001) {
          const falloff = 1 - dist / REPEL_RADIUS
          const force = (REPEL_STRENGTH * falloff * falloff * dt) / dist
          vx += dx * force
          vy += dy * force
        }
      }

      vx = (vx - SPRING * ox * dt) * damp
      vy = (vy - SPRING * oy * dt) * damp
      ox += vx * dt
      oy += vy * dt

      velocities[i * 2] = vx
      velocities[i * 2 + 1] = vy
      offsets[i * 2] = ox
      offsets[i * 2 + 1] = oy

      dummy.position.set(baseX + ox, baseY + oy, baseZ + bob)
      const s = 0.3 + 0.7 * p
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // gentle tilt toward the cursor
    const tiltX = pointer.active ? pointer.x : 0
    const tiltY = pointer.active ? pointer.y : 0
    group.rotation.y += (tiltX * 0.2 - group.rotation.y) * 0.04
    group.rotation.x += (-tiltY * 0.12 - group.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef} scale={scale}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, COUNT]}
        frustumCulled={false}
      >
        <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
        <circleGeometry args={[DOT_RADIUS, 24]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

export default function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false })

  // window-level tracking so the effect works over the whole hero
  // (including text overlays) with mouse AND touch, without blocking scroll
  useEffect(() => {
    const toNDC = (clientX: number, clientY: number) => {
      const wrap = wrapRef.current
      if (!wrap) return null
      const rect = wrap.getBoundingClientRect()
      if (
        clientX < rect.left - 40 ||
        clientX > rect.right + 40 ||
        clientY < rect.top - 40 ||
        clientY > rect.bottom + 40
      ) {
        return null
      }
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      }
    }

    const update = (clientX: number, clientY: number) => {
      const ndc = toNDC(clientX, clientY)
      const pointer = pointerRef.current
      if (ndc) {
        pointer.x = ndc.x
        pointer.y = ndc.y
        pointer.active = true
      } else {
        pointer.active = false
      }
    }
    const deactivate = () => {
      pointerRef.current.active = false
    }

    const onPointer = (e: PointerEvent) => {
      // touches are handled by the touch listeners below, which — unlike
      // pointer events — keep firing during native scrolling
      if (e.pointerType === 'mouse') update(e.clientX, e.clientY)
    }
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) update(touch.clientX, touch.clientY)
      else deactivate()
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', onTouch, { passive: true })
    window.addEventListener('touchcancel', onTouch, { passive: true })
    window.addEventListener('blur', deactivate)
    document.addEventListener('pointerleave', deactivate)

    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouch)
      window.removeEventListener('touchcancel', onTouch)
      window.removeEventListener('blur', deactivate)
      document.removeEventListener('pointerleave', deactivate)
    }
  }, [])

  return (
    <div className="hero-canvas" aria-hidden="true" ref={wrapRef}>
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        eventSource={undefined}
        onCreated={(state) => {
          // never steal touch gestures from page scrolling
          state.gl.domElement.style.touchAction = 'pan-y'
          if (import.meta.env.DEV) {
            ;(window as unknown as { __r3f?: unknown }).__r3f = state
          }
        }}
      >
        <DotMap pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}
