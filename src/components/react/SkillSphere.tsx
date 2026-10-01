import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import { useInView, useIsDark, useReducedMotion } from "./hooks"

const RADIUS = 2.4

/** Evenly spread points on a sphere (Fibonacci lattice). */
function fibonacciSphere(n: number, radius: number) {
    const points: THREE.Vector3[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const theta = golden * i
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius))
    }
    return points
}

function Label({ text, position }: { text: string; position: THREE.Vector3 }) {
    const el = useRef<HTMLDivElement>(null)
    const world = useMemo(() => new THREE.Vector3(), [])
    const anchor = useRef<THREE.Group>(null!)

    // Fade/scale labels by depth so the back of the sphere recedes.
    useFrame(() => {
        if (!el.current) return
        anchor.current.getWorldPosition(world)
        const depth = (world.z + RADIUS) / (RADIUS * 2) // 0 = back, 1 = front
        el.current.style.opacity = String(0.15 + depth * 0.85)
        el.current.style.transform = `scale(${0.7 + depth * 0.45})`
        el.current.style.filter = `blur(${(1 - depth) * 1.5}px)`
    })

    return (
        <group ref={anchor} position={position}>
            <Html center zIndexRange={[10, 0]}>
                <div
                    ref={el}
                    className="select-none whitespace-nowrap rounded-full border border-line bg-card/80 px-3 py-1 font-mono text-xs text-fg shadow-lg backdrop-blur transition-colors hover:border-accent-violet hover:text-accent-violet"
                >
                    {text}
                </div>
            </Html>
        </group>
    )
}

function Cloud({ skills, color }: { skills: string[]; color: string }) {
    const group = useRef<THREE.Group>(null!)
    const velocity = useRef({ x: 0, y: 0.15 })
    const positions = useMemo(() => fibonacciSphere(skills.length, RADIUS), [skills.length])

    useFrame((state, delta) => {
        // Pointer steers the rotation while hovering, otherwise drift slowly.
        const tx = state.pointer.y * 0.6
        const ty = 0.15 + state.pointer.x * 0.8
        velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, tx, 0.04)
        velocity.current.y = THREE.MathUtils.lerp(velocity.current.y, ty, 0.04)
        group.current.rotation.x += velocity.current.x * delta
        group.current.rotation.y += velocity.current.y * delta
    })

    return (
        <group ref={group}>
            <mesh>
                <sphereGeometry args={[RADIUS * 0.98, 24, 24]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.07} />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.12} />
            </mesh>
            {skills.map((skill, i) => (
                <Label key={skill} text={skill} position={positions[i]} />
            ))}
        </group>
    )
}

export default function SkillSphere({ skills }: { skills: string[] }) {
    const wrapper = useRef<HTMLDivElement>(null)
    const inView = useInView(wrapper, "100px")
    const dark = useIsDark()
    const reduced = useReducedMotion()
    const [ready, setReady] = useState(false)

    return (
        <div
            ref={wrapper}
            className="relative aspect-square w-full transition-opacity duration-1000"
            style={{ opacity: ready ? 1 : 0 }}
        >
            <Canvas
                dpr={[1, 1.75]}
                frameloop={reduced ? "demand" : inView ? "always" : "never"}
                camera={{ position: [0, 0, 6.5], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                onCreated={() => setReady(true)}
            >
                <Cloud skills={skills} color={dark ? "#a78bfa" : "#7c3aed"} />
            </Canvas>
        </div>
    )
}
