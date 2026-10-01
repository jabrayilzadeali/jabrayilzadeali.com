import { Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
    Environment,
    Float,
    Lightformer,
    MeshDistortMaterial,
    PerformanceMonitor,
    Sparkles,
} from "@react-three/drei"
import * as THREE from "three"
import { useInView, useIsDark, useReducedMotion, useWindowPointer } from "./hooks"

type Palette = {
    blob: string
    network: string
    ringA: string
    ringB: string
    sparkles: string
}

const DARK: Palette = {
    blob: "#ffffff",
    network: "#a78bfa",
    ringA: "#22d3ee",
    ringB: "#f472b6",
    sparkles: "#c4b5fd",
}

const LIGHT: Palette = {
    blob: "#f5f3ff",
    network: "#7c3aed",
    ringA: "#0891b2",
    ringB: "#db2777",
    sparkles: "#7c3aed",
}

/** Liquid-chrome blob that reflects a hand-made neon studio environment. */
function Blob({ color, detail }: { color: string; detail: number }) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHovered] = useState(false)
    const material = useRef<any>(null!)

    useFrame((state, delta) => {
        mesh.current.rotation.y += delta * 0.15
        mesh.current.rotation.z += delta * 0.05
        // ease distortion & scale towards hover target
        const targetDistort = hovered ? 0.55 : 0.35
        material.current.distort = THREE.MathUtils.lerp(material.current.distort, targetDistort, 0.05)
        const s = THREE.MathUtils.lerp(mesh.current.scale.x, hovered ? 1.12 : 1, 0.06)
        mesh.current.scale.setScalar(s)
        // subtle "breathing"
        mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    })

    return (
        <mesh
            ref={mesh}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <icosahedronGeometry args={[1.15, detail]} />
            <MeshDistortMaterial
                ref={material}
                color={color}
                metalness={1}
                roughness={0.14}
                envMapIntensity={1.4}
                distort={0.35}
                speed={2.2}
            />
        </mesh>
    )
}

function Ring({
    radius,
    color,
    speed,
    tilt,
}: {
    radius: number
    color: string
    speed: number
    tilt: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh>(null!)
    useFrame((_, delta) => {
        ref.current.rotation.z += delta * speed
    })
    return (
        <group rotation={tilt}>
            <mesh ref={ref}>
                <torusGeometry args={[radius, 0.012, 16, 200]} />
                <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
            </mesh>
        </group>
    )
}

/** A small glowing node that orbits the blob. */
function Satellite({
    radius,
    speed,
    offset,
    color,
    tilt,
}: {
    radius: number
    speed: number
    offset: number
    color: string
    tilt: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh>(null!)
    useFrame(state => {
        const t = state.clock.elapsedTime * speed + offset
        ref.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0)
    })
    return (
        <group rotation={tilt}>
            <mesh ref={ref}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
        </group>
    )
}

/** Constellation of nodes and edges — a nod to distributed systems. */
function Network({ count, color }: { count: number; color: string }) {
    const group = useRef<THREE.Group>(null!)

    const { points, lines } = useMemo(() => {
        const pts: THREE.Vector3[] = []
        for (let i = 0; i < count; i++) {
            const dir = new THREE.Vector3().randomDirection()
            pts.push(dir.multiplyScalar(4 + Math.random() * 4.5))
        }
        const linePositions: number[] = []
        for (let i = 0; i < pts.length; i++) {
            let links = 0
            for (let j = i + 1; j < pts.length && links < 3; j++) {
                if (pts[i].distanceTo(pts[j]) < 2.6) {
                    linePositions.push(...pts[i].toArray(), ...pts[j].toArray())
                    links++
                }
            }
        }
        return {
            points: new Float32Array(pts.flatMap(p => p.toArray())),
            lines: new Float32Array(linePositions),
        }
    }, [count])

    // Soft round sprite so points render as glowing dots, not squares.
    const sprite = useMemo(() => {
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 64
        const ctx = canvas.getContext("2d")!
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        g.addColorStop(0, "rgba(255,255,255,1)")
        g.addColorStop(0.35, "rgba(255,255,255,0.8)")
        g.addColorStop(1, "rgba(255,255,255,0)")
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 64, 64)
        return new THREE.CanvasTexture(canvas)
    }, [])

    useFrame((_, delta) => {
        group.current.rotation.y += delta * 0.025
        group.current.rotation.x += delta * 0.008
    })

    return (
        <group ref={group} position={[0, 0, -3]}>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[points, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.12}
                    map={sprite}
                    color={color}
                    sizeAttenuation
                    transparent
                    opacity={0.9}
                    depthWrite={false}
                    toneMapped={false}
                />
            </points>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[lines, 3]} />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
            </lineSegments>
        </group>
    )
}

/** Moves the camera with the pointer and lifts the scene away while scrolling. */
function Rig({ children }: { children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null!)
    const pointer = useWindowPointer()
    const { viewport, camera } = useThree()
    const wide = viewport.aspect > 1.1
    const target = useMemo(() => new THREE.Vector3(), [])

    useFrame(() => {
        const scroll = Math.min(window.scrollY / window.innerHeight, 1.2)
        camera.position.lerp(target.set(pointer.current.x * 0.6, pointer.current.y * 0.4, 7), 0.04)
        camera.lookAt(0, 0, 0)

        const baseX = wide ? Math.min(viewport.width * 0.26, 3.2) : 0.6
        const baseY = wide ? 0 : viewport.height * 0.27
        group.current.scale.setScalar(wide ? 1 : 0.62)
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX, 0.08)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + scroll * 2.2, 0.08)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, scroll * 0.6, 0.08)
    })

    return <group ref={group}>{children}</group>
}

function Studio({ dark }: { dark: boolean }) {
    return (
        <Environment resolution={256} frames={1}>
            <color attach="background" args={[dark ? "#241a3d" : "#b9a6f7"]} />
            <group rotation={[-Math.PI / 3, 0, 1]}>
                <Lightformer form="rect" intensity={5} color="#8b5cf6" position={[0, 5, -9]} scale={[12, 2, 1]} />
                <Lightformer form="rect" intensity={3} color="#22d3ee" rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.8, 1]} />
                <Lightformer form="rect" intensity={3} color="#f472b6" rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
                <Lightformer form="ring" intensity={3} color="#f472b6" rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={10} />
                <Lightformer form="rect" intensity={2} color="#ffffff" rotation-y={-Math.PI / 2} position={[6, 4, 2]} scale={[8, 1, 1]} />
            </group>
        </Environment>
    )
}

export default function HeroScene() {
    const wrapper = useRef<HTMLDivElement>(null)
    const inView = useInView(wrapper)
    const dark = useIsDark()
    const reduced = useReducedMotion()
    const [ready, setReady] = useState(false)
    const [dpr, setDpr] = useState(1.5)

    const palette = dark ? DARK : LIGHT
    const mobile = typeof window !== "undefined" && window.innerWidth < 768

    return (
        <div
            ref={wrapper}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-out"
            style={{ opacity: ready ? 1 : 0 }}
            aria-hidden="true"
        >
            <Canvas
                dpr={dpr}
                frameloop={reduced ? "demand" : inView ? "always" : "never"}
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={() => setReady(true)}
            >
                <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))} />
                <ambientLight intensity={0.4} />
                <Suspense fallback={null}>
                    <Rig>
                        <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
                            <Blob color={palette.blob} detail={mobile ? 24 : 48} />
                        </Float>
                        <Ring radius={2.05} color={palette.ringA} speed={0.35} tilt={[1.2, 0.3, 0]} />
                        <Ring radius={2.4} color={palette.ringB} speed={-0.25} tilt={[-1.1, -0.5, 0.4]} />
                        <Satellite radius={2.05} speed={0.6} offset={0} color={palette.ringA} tilt={[1.2, 0.3, 0]} />
                        <Satellite radius={2.4} speed={-0.45} offset={2} color={palette.ringB} tilt={[-1.1, -0.5, 0.4]} />
                        <Satellite radius={2.4} speed={-0.45} offset={5} color={palette.ringB} tilt={[-1.1, -0.5, 0.4]} />
                    </Rig>
                    <Network count={mobile ? 70 : 140} color={palette.network} />
                    <group position={[0, 0, -3]}>
                        <Sparkles count={mobile ? 40 : 90} scale={[16, 9, 3]} size={1.6} speed={0.35} opacity={0.6} color={palette.sparkles} />
                    </group>
                    <Studio dark={dark} />
                </Suspense>
            </Canvas>
        </div>
    )
}
