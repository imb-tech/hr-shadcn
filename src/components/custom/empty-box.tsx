import EmptyIcon from "./empty-icon"

export default function EmptyBox({ data }: { data?: any[] }) {
    if (data?.length) {
        return null
    }
    return (
        <div className="w-full flex items-center flex-col h-[65vh] justify-center gap-2">
            <EmptyIcon size={60} className="text-foreground/60"/>
            <p className="text-foreground/60">Ma'lumot topilmadi</p>
        </div>
    )
}
