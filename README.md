# Jabrayilzade Ali's website

A 3D personal site and blog.

## Tech

- [Astro](https://astro.build) — pages, blog (Markdown/MDX), RSS, sitemap
- [React](https://react.dev) + [React Three Fiber](https://r3f.docs.pmnd.rs) / [drei](https://github.com/pmndrs/drei) + [Three.js](https://threejs.org) — 3D hero scene, skill sphere, tilt cards
- [Tailwind CSS](https://tailwindcss.com) — styling, light/dark themes

## Editing content

- Personal info, socials, skills, projects and process steps: `src/data/site.ts`
- Blog posts: `src/content/blog/`

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build to dist/
npm run preview
```
