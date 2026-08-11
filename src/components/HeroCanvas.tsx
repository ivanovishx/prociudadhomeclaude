import { useLayoutEffect, useMemo, useRef } from 'react'
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

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function DotMap() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  // own the clock: THREE.Clock is deprecated in recent three versions
  const startTime = useRef<number | null>(null)

  // fit the map inside the canvas viewport (reactive to resizes)
  const viewport = useThree((state) => state.viewport)
  const scale = Math.min(viewport.width * 0.46, viewport.height * 0.6)

  const { starts, delays, phases, colorArray } = useMemo(() => {
    const starts = new Float32Array(COUNT * 3)
    const delays = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)
    const colorArray = new Float32Array(COUNT * 3)

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

    return { starts, delays, phases, colorArray }
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

  useFrame(({ pointer }) => {
    const mesh = meshRef.current
    const group = groupRef.current
    if (!mesh || !group) return

    if (startTime.current === null) startTime.current = performance.now()
    const t = (performance.now() - startTime.current) / 1000
    for (let i = 0; i < COUNT; i++) {
      const p = easeOutCubic(THREE.MathUtils.clamp((t - 0.2 - delays[i]) / ASSEMBLE_DURATION, 0, 1))
      const bob = p >= 1 ? Math.sin(t * 1.6 + phases[i]) * 0.012 : 0
      dummy.position.set(
        THREE.MathUtils.lerp(starts[i * 3], MEXICO_DOTS[i][0], p),
        THREE.MathUtils.lerp(starts[i * 3 + 1], MEXICO_DOTS[i][1], p),
        THREE.MathUtils.lerp(starts[i * 3 + 2], 0, p) + bob,
      )
      const s = 0.3 + 0.7 * p
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // gentle tilt toward the cursor
    group.rotation.y += (pointer.x * 0.2 - group.rotation.y) * 0.04
    group.rotation.x += (-pointer.y * 0.12 - group.rotation.x) * 0.04
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
  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={(state) => {
          if (import.meta.env.DEV) {
            ;(window as unknown as { __r3f?: unknown }).__r3f = state
          }
        }}
      >
        <DotMap />
      </Canvas>
    </div>
  )
}
