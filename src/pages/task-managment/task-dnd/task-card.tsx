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
    Flame,
    SquareCheckBig,
    Trash,
} from "lucide-react"



export const getPriorityColor = (priority: number) => {
    switch (priority) {
        case 3:
            return "bg-red-500/10 text-red-500 border-red-500/10"
        case 2:
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/10"
        case 1:
            return "bg-primary/15 text-primary border-primary/15"
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/10"
    }
}

type Props = {
    onDelete: (id: number) => void
    item: QuoteCard
}

export default function TaskCard({ item, onDelete }: Props) {
    const { openModal: openModalView } = useModal("task-modal")
    const { openModal: openModalDelete } = useModal("task-delete")
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
            openModalView()
        }
    }

    return (
        <Card
            onClick={() => handleItem(item.id)}
            className={cn(
                "hover:shadow-md transition-shadow border-[1.5px] dark:bg-[#22272B]",
                item.priority == 3
                    ? "hover:border-red-500"
                    : item.priority == 1
                    ? "hover:border-primary"
                    : item.priority == 2
                    ? "hover:border-yellow-500"
                    : "",
            )}
        >
            <CardHeader className="p-3 pb-0 flex space-y-0 flex-row justify-between items-start gap-3">
                <AvatarGroup max={4} total={item?.users_data?.length} countClass={cn("h-7 w-7")}>
                    {item?.users_data?.map((user, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-7 w-7">
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
                        "h-7 w-7 rounded-full flex items-center justify-center",
                        getPriorityColor(item.priority),
                    )}
                >
                    <Flame className="w-5 h-5" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3 px-2 py-1">
                <div>
                    <h3 className="font-semibold 2xl:text-[15px] text-[13px] mb-1 break-all line-clamp-1">
                        {item.title}
                    </h3>
                    <p className="text-xs 2xl:text-[14px] break-all line-clamp-3 text-zinc-300">
                        {item.desc}
                    </p>
                </div>

                <div className="flex items-center gap-4 justify-between text-sm text-zinc-300">
                    <div className="flex items-center gap-4 text-xs">
                        {item.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                    {format(item.deadline, "yyyy-MM-dd")}
                                </span>
                            </div>
                        )}
                        {item?.todo && item.todo !== 0 ? (
                            <div className="flex items-center gap-1  ">
                                <SquareCheckBig className="h-3.w-3.5 w-3.5" />
                                <span>{`${item.finished}/${item.todo}`}</span>
                            </div>
                        ) : null}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item.id)
                            openModalDelete()
                        }}
                        className="p-2 rounded-md  hover:bg-red-500/20 hover:text-red-500"
                    >
                        <Trash size={14} />
                        
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
