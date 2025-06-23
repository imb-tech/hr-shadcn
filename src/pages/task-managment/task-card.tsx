import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useModal } from "@/hooks/useModal"
import { cn } from "@/lib/utils"
import { useTaskStore } from "@/store/task-management"
import { Calendar, Clock, SquareCheckBig } from "lucide-react"

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "Yuqori":
            return "bg-red-500/10 text-red-500 border-red-500/10"
        case "O'rta":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/10"
        case "Past":
            return "bg-green-500/10 text-green-500 border-green-500/10"
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/10"
    }
}

export default function TaskCard({ item }: { item: QuoteCard }) {
    const { openModal } = useModal("task-modal")
    const { clearTask, setTask } = useTaskStore()

    const handleItem = (item: QuoteCard) => {
        clearTask()
        if (item?.id) {
            setTask(item)
            openModal()
        }
    }

    return (
        <Card
            onClick={() => handleItem(item)}
            className="hover:shadow-md transition-shadow"
        >
            <CardHeader className="p-3 pb-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={undefined} alt={item.responsible} />
                        <AvatarFallback
                            className={cn(
                                "uppercase",
                                getPriorityColor(item.priority),
                            )}
                        >
                            {item.responsible?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">
                            {item.responsible}
                        </p>
                        <p className="text-xs text-muted-foreground">Mas'ul</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
                <div>
                    <h3 className="font-semibold text-[15px] mb-1">
                        {item.title}
                    </h3>
                    <p className="text-[14px] text-muted-foreground">
                        {item.description}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Badge
                        variant="outline"
                        className={getPriorityColor(item.priority)}
                    >
                        {item.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <SquareCheckBig className="h-4 w-4" />
                        <span>2 / 7</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{item.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{"2 kun qoldi"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
