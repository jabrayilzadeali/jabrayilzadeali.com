import { useRef, type PointerEvent } from "react"
import type { Project } from "../../data/site"

const MAX_TILT = 10

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
    const card = useRef<HTMLElement>(null)
    const [from, to] = project.colors

    const onMove = (e: PointerEvent<HTMLElement>) => {
        const el = card.current
        if (!el || e.pointerType === "touch") return
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        el.style.setProperty("--rx", `${(0.5 - py) * MAX_TILT}deg`)
        el.style.setProperty("--ry", `${(px - 0.5) * MAX_TILT}deg`)
        el.style.setProperty("--gx", `${px * 100}%`)
        el.style.setProperty("--gy", `${py * 100}%`)
    }

    const onLeave = () => {
        const el = card.current
        if (!el) return
        el.style.setProperty("--rx", "0deg")
        el.style.setProperty("--ry", "0deg")
    }

    const primaryHref = project.href ?? project.repo

    return (
        <div className="[perspective:1200px]">
            <article
                ref={card}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                className="group relative h-full rounded-3xl border border-line bg-card/70 p-px transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
            >
                {/* animated gradient border on hover */}
                <div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-card p-6 sm:p-8">
                    {/* glare */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                            background:
                                "radial-gradient(500px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.08), transparent 40%)",
                        }}
                    />
                    {/* visual header */}
                    <div className="relative mb-8 h-40 overflow-hidden rounded-2xl border border-line [transform:translateZ(40px)]">
                        <div
                            className="absolute inset-0 opacity-80 transition-transform duration-700 group-hover:scale-110"
                            style={{
                                background: `radial-gradient(circle at 20% 20%, ${from}, transparent 55%), radial-gradient(circle at 80% 80%, ${to}, transparent 55%)`,
                            }}
                        />
                        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:none]" />
                        <span className="absolute bottom-3 left-4 font-display text-6xl font-bold text-white/90 mix-blend-overlay">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </div>

                    <div className="[transform:translateZ(30px)]">
                        <h3 className="font-display text-2xl font-semibold tracking-tight">
                            {primaryHref ? (
                                <a href={primaryHref} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
                                    {project.title}
                                </a>
                            ) : (
                                project.title
                            )}
                            <span className="ml-2 inline-block text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg">
                                ↗
                            </span>
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                        {project.tags.map(tag => (
                            <span key={tag} className="chip">
                                {tag}
                            </span>
                        ))}
                        {project.repo && project.href && (
                            <a
                                href={project.repo}
                                target="_blank"
                                rel="noreferrer"
                                className="relative z-10 ml-auto font-mono text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                            >
                                source
                            </a>
                        )}
                    </div>
                </div>
            </article>
        </div>
    )
}
