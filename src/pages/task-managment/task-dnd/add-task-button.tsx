import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const AddTaskButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        size="sm"
        variant="ghost"
        onClick={onClick}
        className="w-full dark:hover:bg-[#131506] dark:hover:text-white flex justify-start 2xl:text-sm text-xs"
    >
        <Plus size={16} />
        Yangi qo'shish
    </Button>
)

export default AddTaskButton
