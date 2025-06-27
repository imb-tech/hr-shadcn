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
import { getPriorityColor } from "../task-dnd/task-card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Edit, Trash } from "lucide-react"
import clsx from "clsx"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { useGet } from "@/hooks/useGet"
import { TASKS_EXCEL } from "@/constants/api-endpoints"
import { downloadExcel } from "@/lib/download-excel"

type Props = {
    handleItem: (item: FormValues) => void
    handleDelete: (item: FormValues) => void
    item: FormValues
}

function ProjectCard({ handleItem, handleDelete, item }: Props) {
    const navigate = useNavigate()
    const { data, isSuccess, isLoading, refetch } = useGet(
        `${TASKS_EXCEL}/${item.id}`,
        {
            options: { enabled: false },
            config: {
                responseType: "blob",
            },
        },
    )

    const handleExcelItem = async () => {
        const response = await refetch()
        if (response.isSuccess) {
            downloadExcel({ data: response.data })
        }
    }

    return (
        <Card
            onClick={() =>
                navigate({
                    to: "/project/$id",
                    params: { id: item.id?.toString() },
                })
            }
            className={clsx(
                "bg-background/80 bg-blend-overlay cursor-pointer min-h-[244px]  bg-center bg-cover",
            )}
            style={{
                backgroundImage: `url(${item.background})`,
            }}
        >
            <CardContent className="h-full flex justify-between flex-col gap-4">
                <div className="space-y-4">
                    <div className="flex justify-between  items-center gap-3">
                        <h1 className="font-semibold text-xl">{item.name}</h1>
                        <AvatarGroup
                            max={4}
                            total={item?.users?.length}
                            countClass="h-10 w-10 "
                        >
                            {item?.users.map((item, index) => (
                                <TooltipProvider delayDuration={0} key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar className="h-10 w-10 ">
                                                <AvatarImage
                                                    src={
                                                        item?.face || undefined
                                                    }
                                                    alt={item.first_name}
                                                />
                                                <AvatarFallback
                                                    className={cn(
                                                        "uppercase !bg-secondary !text-muted-foreground",
                                                        getPriorityColor(2),
                                                    )}
                                                >
                                                    {item?.first_name?.slice(
                                                        0,
                                                        1,
                                                    )}
                                                    {item?.last_name?.slice(
                                                        0,
                                                        1,
                                                    )}
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
                    <ul className="flex flex-col  gap-2 mb-3">
                        {item?.statuses?.map((item) => (
                            <li className="flex items-center justify-between">
                                <span>{item?.name}:</span>
                                <span>{item?.count} vazifalar</span>
                            </li>
                        ))}
                    </ul>
                </div>
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
                            disabled={isLoading}
                            loading={isLoading}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleExcelItem()
                            }}
                            size={"sm"}
                        >
                            {!isLoading && <Download size={18} />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard
