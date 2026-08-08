import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const COLS = 150
const ROWS = 85
const SEP = 0.34
const COUNT = COLS * ROWS

function WaveField() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const inner = new THREE.Color('#ff5fa8')
    const mid = new THREE.Color('#c2187f')
    const outer = new THREE.Color('#3d1156')
    const c = new THREE.Color()
    let i = 0
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - COLS / 2) * SEP
        const pz = (z - ROWS / 2) * SEP
        positions[i * 3] = px
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = pz
        const d = Math.hypot(px, pz) / 20
        if (d < 0.45) c.lerpColors(inner, mid, d / 0.45)
        else c.lerpColors(mid, outer, Math.min(1, (d - 0.45) / 0.55))
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
        i++
      }
    }
    return { positions, colors }
  }, [])

  useFrame(({ clock, camera, pointer }) => {
    const points = pointsRef.current
    if (!points) return
    const t = clock.elapsedTime
    const pos = points.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      const x = arr[i * 3]
      const z = arr[i * 3 + 2]
      arr[i * 3 + 1] =
        Math.sin(x * 0.32 + t * 0.7) * 0.5 +
        Math.cos(z * 0.28 + t * 0.55) * 0.45 +
        Math.sin((x + z) * 0.16 + t * 0.35) * 0.35
    }
    pos.needsUpdate = true

    camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.035
    camera.position.y += (3.4 + pointer.y * 1.1 - camera.position.y) * 0.035
    camera.lookAt(0, 0, -2)
  })

  return (
    <points ref={pointsRef} rotation={[0, 0.12, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroCanvas() {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3.4, 12], fov: 58 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0b0410', 10, 30]} />
        <WaveField />
        <Sparkles
          count={90}
          scale={[28, 9, 20]}
          position={[0, 2.5, -2]}
          size={2.4}
          speed={0.25}
          opacity={0.55}
          color="#ff7ab8"
        />
      </Canvas>
    </div>
  )
}
