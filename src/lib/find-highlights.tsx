import { cn } from "./utils"

export default function findHighlights(
    text: string,
    query: string,
    className?: string,
) {
    if (!query || query.length === 0) {
        return text
    }
    return text.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className={cn("text-green-600", className)}>
                {part}
            </span>
        ) : (
            part
        ),
    )
}
