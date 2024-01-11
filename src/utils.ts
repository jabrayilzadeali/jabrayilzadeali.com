export function slugify(url: string) {
    return url.toLowerCase().split(" ").join("-")
}

export function capitilize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
