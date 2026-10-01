import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: ["Inter Variable", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
			display: ["Space Grotesk Variable", "Inter Variable", "system-ui", "sans-serif"],
			mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
		},
		extend: {
			colors: {
				body: "hsl(var(--color-body) / <alpha-value>)",
				fg: "hsl(var(--color-fg) / <alpha-value>)",
				muted: "hsl(var(--color-muted) / <alpha-value>)",
				line: "hsl(var(--color-line) / <alpha-value>)",
				card: "hsl(var(--color-card) / <alpha-value>)",
				accent: {
					violet: "#8b5cf6",
					cyan: "#22d3ee",
					pink: "#f472b6",
				},
			},
			keyframes: {
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(-50%)" },
				},
				"gradient-pan": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
				"scroll-dot": {
					"0%": { transform: "translateY(0)", opacity: "0" },
					"30%": { opacity: "1" },
					"100%": { transform: "translateY(14px)", opacity: "0" },
				},
				"spin-slow": {
					to: { transform: "rotate(360deg)" },
				},
			},
			animation: {
				marquee: "marquee 40s linear infinite",
				"gradient-pan": "gradient-pan 8s ease infinite",
				"scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
				"spin-slow": "spin-slow 12s linear infinite",
			},
		},
	},
	plugins: [typography],
}
