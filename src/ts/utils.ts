// export function slugify(text: string) {
//     return text.toLowerCase().split(" ").join("-")
// }

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
}

export function capitilize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function beautify(text: string): string {
    return capitilize(text).replaceAll("-", " ")
}

