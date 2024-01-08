/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			sans: [
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Oxygen',
				'Ubuntu',
				'Cantarell',
				'Open Sans',
				'Helvetica Neue',
				'sans-serif',
			]
		},
		extend: {
			colors: {
				// Using modern `hsl`
				body: 'hsl(var(--color-body) / <alpha-value>)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
