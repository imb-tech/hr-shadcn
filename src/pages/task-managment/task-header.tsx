import ParamDatePicker from "@/components/as-params/date-picker"
import ParamInput from "@/components/as-params/input"

export default function TaskHeader() {
    return (
        <div className="flex items-center gap-3">
            <ParamInput fullWidth />
            <ParamDatePicker />
        </div>
    )
}
