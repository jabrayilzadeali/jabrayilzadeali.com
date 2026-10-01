import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"

import icon from "astro-icon"
import { remarkReadingTime } from "./remark-reading-time.mjs"

// https://astro.build/config
export default defineConfig({
    site: "https://www.jabrayilzadeali.com/",
    markdown: {
        remarkPlugins: [remarkReadingTime],
        shikiConfig: {
            theme: "github-dark-dimmed",
        },
    },
    integrations: [
        mdx(),
        sitemap(),
        tailwind({
            applyBaseStyles: false,
        }),
        icon(),
        react(),
    ],
})
