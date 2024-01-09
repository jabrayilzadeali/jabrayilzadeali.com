document.addEventListener('astro:page-load', () => {

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const html = document.querySelector("html")!

    const darkLightModeToggle = document.querySelector("[data-dark-light-mode-toggle]")!
    const iconDark = document.querySelector("[data-icon=dark]")!
    const iconLight = document.querySelector("[data-icon=light]")!

    darkLightModeToggle.addEventListener("click", () => {
        html.classList.toggle("dark")
        html.classList.toggle("light")
        if (localStorage.theme === "dark") {
            localStorage.theme = "light"
            iconDark.classList.toggle("hidden")
            iconLight.classList.toggle("hidden")
        } else {
            localStorage.theme = "dark"
            iconDark.classList.toggle("hidden")
            iconLight.classList.toggle("hidden")

        }
    })

    if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        localStorage.setItem("theme", "dark")
        iconLight.classList.toggle("hidden")
    } else {
        localStorage.setItem("theme", "light")
        iconDark.classList.toggle("hidden")
    }
    
    html.classList.toggle(localStorage.theme === "dark"? "dark" : "light")
})