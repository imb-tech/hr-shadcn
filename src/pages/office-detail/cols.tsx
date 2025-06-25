import SeeInView from "@/components/ui/see-in-view"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useWorkerInfoCols = () => {
    return useMemo<ColumnDef<WorkerAttendance>[]>(
        () => [
            {
                header: "Rasm",
                accessorKey: "face",
                cell: ({ row }) => {
                    return (
                        <SeeInView
                            url={row.original.face}
                            className={"object-cover h-9 w-9 rounded-md"}
                        />
                    )
                },
            },
            { header: "FIO", accessorKey: "full_name" },
            {
                header: "Ish vaqti",
                accessorKey: "id",
                cell({ row }) {
                    const { work_shift_start, work_shift_end } = row.original
                    return (
                        <p className="text-sm">
                            {work_shift_start?.slice(0, 5)} ~
                            {work_shift_end?.slice(0, 5)}
                        </p>
                    )
                },
            },
            {
                header: "Keldi",
                accessorKey: "id",
                cell({ row }) {
                    const { attendance } = row.original
                    return (
                        <span>
                            {attendance?.attendance_time
                                ? attendance?.attendance_time?.slice(0, 5)
                                : "-"}
                        </span>
                    )
                },
            },
            {
                header: "Ketdi",
                accessorKey: "role_id",
                cell({ row }) {
                    const { attendance } = row.original
                    return (
                        <span>
                            {attendance?.left_time
                                ? attendance?.left_time?.slice(0, 5)
                                : "-"}
                        </span>
                    )
                },
            },
            {
                header: "Kechikish",
                accessorKey: "id",
                cell({ row }) {
                    const { attendance, work_shift_start } = row.original
                    return attendance && attendance.status === 0
                        ? getTimeDifference(
                              work_shift_start,
                              attendance.attendance_time,
                          )
                        : "-"
                },
            },
            {
                header: "Erta ketish vaqti",
                accessorKey: "id",
                cell({ row }) {
                    const { attendance, work_shift_end } = row.original
                    return attendance &&
                        attendance.status === 0 &&
                        attendance?.left_time
                        ? getTimeDifference(
                              attendance.left_time,
                              work_shift_end,
                          )
                        : "-"
                },
            },
            {
                header: "Ishlagan soati",
                accessorKey: "id",
                cell({ row }) {
                    return (
                        <span>{row.original.attendance?.duration || "-"}</span>
                    )
                },
            },
            {
                header: "Status",
                accessorKey: "entry_log_status",
                cell({ row }) {
                    return (
                        <div className="flex items-center gap-4 justify-center">
                            <span
                                className={cn(
                                    row.original.entry_log_status === 1
                                        ? "text-green-400"
                                        : "text-orange-300",
                                )}
                            >
                                {row.original.entry_log_status === 1
                                    ? "Ofisda"
                                    : "Ofisdan tashqarida"}
                            </span>
                        </div>
                    )
                },
            },
        ],
        [],
    )
}

export function getTimeDifference(time1: string, time2: string): string {
    const [h1, m1, s1] = time1.split(":").map(Number)
    const [h2, m2, s2] = time2.split(":").map(Number)

    const date = new Date()
    const t1 = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        h1,
        m1,
        s1 || 0,
    )
    const t2 = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        h2,
        m2,
        s2 || 0,
    )

    const diffMs = t2.getTime() - t1.getTime()
    const isNegative = diffMs < 0
    const absDiffMs = Math.abs(diffMs)

    const diffHours = Math.floor(absDiffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((absDiffMs % (1000 * 60)) / 1000)

    const formattedHours = String(diffHours).padStart(2, "0")
    const formattedMinutes = String(diffMinutes).padStart(2, "0")
    const formattedSeconds = String(diffSeconds).padStart(2, "0")

    return !isNegative
        ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
        : "-"
}
