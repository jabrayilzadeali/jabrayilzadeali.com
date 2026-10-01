// All the personal content of the site lives here.
// Edit this file to change what shows up on the home and projects pages.

export const profile = {
    name: "Ali Jabrayilzade",
    role: "Backend Developer",
    headline: "I create magic with tech.",
    intro:
        "Backend developer who loves turning ideas into fast, reliable systems — APIs, data pipelines and the infrastructure that keeps them running. Occasionally I wander into the frontend to build things like this site.",
}

export const socials = [
    { name: "GitHub", icon: "github", href: "https://github.com/jabrayilzadeali" },
    { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/jabrayilzadeali/" },
    { name: "X", icon: "x", href: "https://twitter.com/jabrayilzadeali" },
] as const

export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
]

// Shown in the 3D skill sphere and the marquee.
export const skills = [
    "Python",
    "Django",
    "FastAPI",
    "Node.js",
    "TypeScript",
    "Go",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Linux",
    "Nginx",
    "REST",
    "GraphQL",
    "Celery",
    "RabbitMQ",
    "Git",
    "CI/CD",
    "Astro",
    "React",
    "Tailwind",
    "Three.js",
    "SQL",
]

export const skillGroups = [
    {
        title: "Backend",
        items: ["Python", "Django", "FastAPI", "Node.js", "Go"],
    },
    {
        title: "Data",
        items: ["PostgreSQL", "Redis", "SQL", "Celery", "RabbitMQ"],
    },
    {
        title: "Infra",
        items: ["Docker", "Linux", "Nginx", "CI/CD", "Git"],
    },
    {
        title: "Frontend",
        items: ["TypeScript", "Astro", "React", "Tailwind", "Three.js"],
    },
]

export type Project = {
    title: string
    description: string
    tags: string[]
    href?: string
    repo?: string
    // Two colours used for the animated card gradient.
    colors: [string, string]
}

// TODO: swap these for your real projects.
export const projects: Project[] = [
    {
        title: "jabrayilzadeali.com",
        description:
            "This website. Astro, React and Three.js with a real-time 3D hero scene, MDX blog, tag pages and RSS.",
        tags: ["Astro", "React", "Three.js", "Tailwind"],
        href: "https://www.jabrayilzadeali.com",
        repo: "https://github.com/jabrayilzadeali/jabrayilzadeali.com",
        colors: ["#8b5cf6", "#22d3ee"],
    },
    {
        title: "API Gateway",
        description:
            "A lightweight gateway handling auth, rate limiting and request routing in front of a fleet of microservices.",
        tags: ["Go", "Redis", "Docker"],
        repo: "https://github.com/jabrayilzadeali",
        colors: ["#f472b6", "#8b5cf6"],
    },
    {
        title: "Task Queue Dashboard",
        description:
            "Real-time monitoring for background jobs: retries, failures and throughput, streamed over WebSockets.",
        tags: ["FastAPI", "Celery", "PostgreSQL"],
        repo: "https://github.com/jabrayilzadeali",
        colors: ["#22d3ee", "#34d399"],
    },
    {
        title: "Content Platform",
        description:
            "Multi-tenant CMS backend with granular permissions, full-text search and a clean REST + GraphQL API.",
        tags: ["Django", "GraphQL", "PostgreSQL"],
        repo: "https://github.com/jabrayilzadeali",
        colors: ["#fb923c", "#f472b6"],
    },
]

export const process = [
    {
        step: "01",
        title: "Understand",
        text: "Start with the problem, not the stack. Ask questions until the shape of the system is obvious.",
    },
    {
        step: "02",
        title: "Design",
        text: "Data models, API contracts and failure modes on paper before a single line of code.",
    },
    {
        step: "03",
        title: "Build",
        text: "Small, tested, readable increments. Boring technology where it matters, sharp tools where it helps.",
    },
    {
        step: "04",
        title: "Ship & scale",
        text: "Automated deploys, observability from day one, and performance work driven by real numbers.",
    },
]
