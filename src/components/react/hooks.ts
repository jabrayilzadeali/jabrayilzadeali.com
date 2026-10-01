import { useEffect, useRef, useState, type RefObject } from "react"

/** Tracks whether <html> has the `dark` class. */
export function useIsDark() {
    const [dark, setDark] = useState(true)
    useEffect(() => {
        const html = document.documentElement
        const update = () => setDark(html.classList.contains("dark"))
        update()
        const observer = new MutationObserver(update)
        observer.observe(html, { attributes: true, attributeFilter: ["class"] })
        return () => observer.disconnect()
    }, [])
    return dark
}

export function useReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReduced(mq.matches)
        update()
        mq.addEventListener("change", update)
        return () => mq.removeEventListener("change", update)
    }, [])
    return reduced
}

/** True while the element is on screen — used to pause offscreen WebGL loops. */
export function useInView<T extends Element>(ref: RefObject<T>, rootMargin = "0px") {
    const [inView, setInView] = useState(false)
    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [ref, rootMargin])
    return inView
}

/** Normalised (-1..1) window pointer position, stored in a ref so it never re-renders. */
export function useWindowPointer() {
    const pointer = useRef({ x: 0, y: 0 })
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
        }
        window.addEventListener("pointermove", onMove, { passive: true })
        return () => window.removeEventListener("pointermove", onMove)
    }, [])
    return pointer
}
