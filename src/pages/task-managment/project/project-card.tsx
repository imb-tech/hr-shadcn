import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getPriorityColor } from "../task-card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Edit, Trash } from "lucide-react"
import clsx from "clsx"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"

type Props = {
    handleItem: (item: FormValues) => void
    handleDelete: (item: FormValues) => void
    item: FormValues
}

function ProjectCard({ handleItem, handleDelete, item }: Props) {
    const navigate = useNavigate()
    return (
        <Card
            onClick={() =>
                navigate({
                    to: "/project/$id",
                    params: { id: item.id?.toString() },
                })
            }
            className={clsx(
                "bg-background/80 bg-blend-overlay cursor-pointer   bg-center bg-cover",
            )}
            style={{
                backgroundImage: `url(${item.background})`,
            }}
        >
            <CardContent className="h-full">
                <div className="flex justify-between  items-center gap-3">
                    <h1 className="font-semibold text-xl">{item.name}</h1>
                    <AvatarGroup max={4} total={4} countClass="h-9 w-9 ">
                        {item?.users.map((item, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={item?.face || undefined}
                                                alt={item.first_name}
                                            />
                                            <AvatarFallback
                                                className={cn(
                                                    "uppercase !bg-secondary !text-muted-foreground",
                                                    getPriorityColor(2),
                                                )}
                                            >
                                                {item?.first_name?.slice(0, 1)}
                                                {item?.last_name?.slice(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item?.first_name} {item?.last_name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </AvatarGroup>
                </div>
                <ul className="flex flex-col min-h-[120px] gap-2 mb-3 mt-5">
                    {item?.statuses?.map((item) => (
                        <li className="flex items-center justify-between">
                            <span>{item?.name}:</span>
                            <span>{item?.count} vazifalar</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center gap-3">
                    <h1>{format(item?.created_at, "yyyy-MM-dd")}</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleItem(item)
                            }}
                            size={"sm"}
                        >
                            <Edit size={18} />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item)
                            }}
                            size={"sm"}
                            variant={"destructive"}
                        >
                            <Trash size={18} />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            size={"sm"}
                        >
                            <Download size={18} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard
