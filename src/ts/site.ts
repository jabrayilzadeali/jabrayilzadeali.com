// Client-side interactions shared by every page.
// Global listeners are attached once; per-page work re-runs on every view transition.

declare global {
    interface Window {
        __siteInit?: boolean
    }
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function setTheme(theme: "dark" | "light") {
    const html = document.documentElement
    html.classList.toggle("dark", theme === "dark")
    html.classList.toggle("light", theme === "light")
    try {
        localStorage.setItem("theme", theme)
    } catch {}
}

function closeMenu() {
    document.querySelector("[data-mobile-menu]")?.classList.remove("is-open")
    document.querySelector("[data-menu-toggle]")?.setAttribute("aria-expanded", "false")
}

function initOnce() {
    if (window.__siteInit) return
    window.__siteInit = true

    // Theme toggle + mobile menu via delegation so they survive page swaps.
    document.addEventListener("click", e => {
        const target = e.target as HTMLElement
        if (target.closest("[data-theme-toggle]")) {
            const next = document.documentElement.classList.contains("dark") ? "light" : "dark"
            const swap = () => setTheme(next)
            // Circular reveal where supported.
            const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
            if (doc.startViewTransition && !reducedMotion()) doc.startViewTransition(swap)
            else swap()
            return
        }
        if (target.closest("[data-menu-toggle]")) {
            const menu = document.querySelector("[data-mobile-menu]")
            const open = menu?.classList.toggle("is-open") ?? false
            document.querySelector("[data-menu-toggle]")?.setAttribute("aria-expanded", String(open))
            return
        }
        if (!target.closest("[data-mobile-menu]")) closeMenu()
    })

    // Cursor glow + card spotlights.
    const glow = document.createElement("div")
    glow.className = "cursor-glow"
    glow.style.opacity = "0"
    document.body.append(glow)
    let gx = 0, gy = 0, tx = 0, ty = 0, raf = 0
    const animateGlow = () => {
        gx += (tx - gx) * 0.12
        gy += (ty - gy) * 0.12
        glow.style.transform = `translate3d(${gx - 300}px, ${gy - 300}px, 0)`
        raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(animateGlow) : 0
    }
    window.addEventListener(
        "pointermove",
        e => {
            if (e.pointerType === "touch") return
            tx = e.clientX
            ty = e.clientY
            glow.style.opacity = "1"
            if (!raf) raf = requestAnimationFrame(animateGlow)

            const card = (e.target as HTMLElement).closest<HTMLElement>(".spotlight")
            if (card) {
                const rect = card.getBoundingClientRect()
                card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
                card.style.setProperty("--my", `${e.clientY - rect.top}px`)
            }
        },
        { passive: true },
    )
    document.addEventListener("pointerleave", () => (glow.style.opacity = "0"))

    // Scroll progress bar + compact header.
    let ticking = false
    const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - window.innerHeight
            const progress = max > 0 ? window.scrollY / max : 0
            document.querySelector<HTMLElement>("[data-progress]")?.style.setProperty("transform", `scaleX(${progress})`)
            document.querySelector("[data-header]")?.classList.toggle("is-scrolled", window.scrollY > 20)
            ticking = false
        })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("astro:page-load", onScroll)

    // Keep the theme class after Astro swaps the <html> attributes, and re-attach
    // the glow because the <body> contents are replaced.
    document.addEventListener("astro:after-swap", () => {
        document.body.append(glow)
        let theme = "dark"
        try {
            theme = localStorage.getItem("theme") ?? "dark"
        } catch {}
        setTheme(theme === "light" ? "light" : "dark")
    })
}

function initReveal() {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
    if (reducedMotion() || !("IntersectionObserver" in window)) {
        items.forEach(el => el.classList.add("is-visible"))
        return
    }
    const observer = new IntersectionObserver(
        entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.classList.add("is-visible")
                observer.unobserve(entry.target)
            }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    items.forEach(el => observer.observe(el))
}

function initMagnetic() {
    if (reducedMotion() || window.matchMedia("(hover: none)").matches) return
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(el => {
        const strength = Number(el.dataset.magnetic) || 0.3
        el.addEventListener("pointermove", e => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
        })
        el.addEventListener("pointerleave", () => {
            el.style.transform = ""
        })
    })
}

initOnce()
document.addEventListener("astro:page-load", () => {
    closeMenu()
    initReveal()
    initMagnetic()
})

export {}
