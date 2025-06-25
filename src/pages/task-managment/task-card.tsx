import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useModal } from "@/hooks/useModal"
import { cn } from "@/lib/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import {
    Calendar,
    ChevronsDown,
    ChevronsUp,
    Flame,
    SquareCheckBig,
} from "lucide-react"

const getPriorityIcon = (priority: number) => {
    switch (priority) {
        case 3:
            return <Flame />
        case 2:
            return <ChevronsUp />
        case 1:
            return <ChevronsDown />
        default:
            return <Flame />
    }
}

export const getPriorityColor = (priority: number) => {
    switch (priority) {
        case 3:
            return "bg-red-500/10 text-red-500 border-red-500/10"
        case 2:
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/10"
        case 1:
            return "bg-green-500/10 text-green-500 border-green-500/10"
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/10"
    }
}

export default function TaskCard({ item }: { item: QuoteCard }) {
    const { openModal } = useModal("task-modal")
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" })

    const handleItem = (id: number) => {
        if (id) {
            navigate({
                search: {
                    ...search,
                    task: id.toString(),
                },
            })
            openModal()
        }
    }
    

    
    return (
        <Card
            onClick={() => handleItem(item.id)}
            className="hover:shadow-md transition-shadow"
        >
            <CardHeader className="p-3 pb-0 flex space-y-0 flex-row justify-between items-start gap-3">
                <AvatarGroup max={4} total={3} countClass="h-7 w-7">
                    {item?.users_data?.map((user, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={user.face || undefined}
                                            alt={user.first_name}
                                        />
                                        <AvatarFallback
                                            className={cn(
                                                "uppercase",
                                                getPriorityColor(item.priority),
                                            )}
                                        >
                                            {user?.first_name?.slice(0, 1)}
                                            {user?.last_name?.slice(0, 1)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {user.first_name} {user.last_name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </AvatarGroup>
                <div
                    className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        getPriorityColor(item.priority),
                    )}
                >
                    {getPriorityIcon(item.priority)}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
                <div>
                    <h3 className="font-semibold text-[15px] mb-1">
                        {item.title}
                    </h3>
                    <p className="text-[14px] text-muted-foreground">
                        {item.desc} 
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur porro corrupti reprehenderit possimus id mollitia, magni provident voluptas facilis amet?
                    </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.deadline && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(item.deadline,"yyyy-MM-dd")}</span>
                        </div>
                    )}
                    {item?.todo && item.todo !== 0 ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <SquareCheckBig className="h-4 w-4" />
                            <span>{`${item.finished}/${item.todo}`}</span>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    )
}
