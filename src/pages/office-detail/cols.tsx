import PopoverImage from "@/components/elements/popover-image";
import { ColumnDef } from "@/components/ui/table";
import { cn } from "@heroui/theme";
import { formatDate } from "date-fns";
import { useMemo } from "react";

export const useWorkerInfoCols = () => {
  return useMemo<ColumnDef<WorkerAttendance>[]>(
    () => [
      {
        header: "Rasm",
        accessorKey: "face",
        cell: (_,item) => {
          return (
            <div className="max-w-8">
              <PopoverImage image={item.face} />
            </div>
          );
        },
      },
      { header: "FIO", accessorKey: "full_name" },
      {
        header: "Ish vaqti",
        accessorKey: "id",
        cell(_) {
          return <span>{"09:00 ~ 18:00"}</span>;
        },
      },
      {
        header: "Keldi",
        accessorKey: "id",
        cell(_, item) {
          return (
            <span>
              {item.attendance?.attendance_time ? formatDate(
                item.attendance?.attendance_time,
                "HH:mm",
              ) : "-"}
            </span>
          );
        },
      },
      {
        header: "Ketdi",
        accessorKey: "role_id",
        cell(_, item) {
          const tm = item.attendance?.left_time ?? null;

          return (
            <span>{tm ? (formatDate(tm, "HH:mm") ?? "-") : "-"}</span>
          );
        },
      },
      {
        header: "Kechikish",
        accessorKey: "id",
        cell(_, item) {
          return item.attendance && item.attendance.status === 0
            ? calculateTimeDifference(
                item.work_shift_start,
                item.attendance.attendance_time,
              )
            : "-";
        },
      },
      // { header: "Erta ketish vaqti", accessorKey: "" },
      {
        header: "Ishlagan soati",
        accessorKey: "id",
        cell(_, item) {
          return <span>{item.attendance?.duration || "-"}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "entry_log_status",
        cell(_, item) {
          return (
            <div className="flex items-center gap-4 justify-center">
              <span
                className={cn(
                  item.entry_log_status === 1
                    ? "text-green-400"
                    : "text-orange-300",
                )}
              >
                {item.entry_log_status === 1 ? "Ofisda" : "Ofisdan tashqarida"}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );
};

export function calculateTimeDifference(
  workShiftStart: string,
  attendanceTime: string,
): string {
  const today = new Date();
  const [startHours, startMinutes, startSeconds] = workShiftStart
    .split(":")
    .map(Number);
  const shiftStartDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    startHours,
    startMinutes,
    startSeconds || 0,
  );

  const attendanceDate = new Date(attendanceTime);

  const diffMs = attendanceDate.getTime() - shiftStartDate.getTime();

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formattedHours = String(Math.abs(diffHours)).padStart(2, "0");
  const formattedMinutes = String(Math.abs(diffMinutes)).padStart(2, "0");
  const formattedSeconds = String(Math.abs(diffSeconds)).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
