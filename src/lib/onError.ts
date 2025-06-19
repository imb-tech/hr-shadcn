import { toast } from "sonner"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onError(err: any) {
    const arrayErrors = Object.entries(err?.response?.data || {})
    if (arrayErrors.length > 0) {
        toast.error(
            arrayErrors.map(([key, value]) => key + ": " + value + "; "),
            { duration: 5000 },
        )
    } else {
        toast.error(err?.message, { duration: 5000 })
    }
}
