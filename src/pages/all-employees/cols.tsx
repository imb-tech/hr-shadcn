import PopoverImage from "@/components/elements/popover-image";
import { ColumnDef } from "@/components/ui/table";
import { formatMoney } from "@/lib/format-money";
import formatPassportNumber from "@/lib/formatter-pasport";
import formatPhoneNumber from "@/lib/formatter-phone";
import { cn } from "@heroui/theme";
import { format } from "date-fns";
import { useMemo } from "react";

export const useAllEmployeesListCols = () => {
  return useMemo<ColumnDef<Human>[]>(
    () => [
      {
        header: "Rasm",
        accessorKey: "face",
        cell: (value) => {
          return (
            <div className="max-w-8">
              <PopoverImage image={value} />
            </div>
          );
        },
      },
      {
        header: "FIO",
        accessorKey: "full_name",
      },
      {
        header: "Telefon",
        accessorKey: "phone",
        cell: (value) => {
          return (
            <span className="whitespace-nowrap lg:break-all">
              {formatPhoneNumber(Number(value))}
            </span>
          );
        },
      },
      {
        header: "Lavozim",
        accessorKey: "role_name",
      },
      {
        header: "Kelish va Ketish",
        accessorKey: "id",
        cell: (_, item) => {
          return (
            <span className="whitespace-nowrap lg:break-all">
              {item.attendance_json?.attendance_time
                ? format(item.attendance_json?.attendance_time, "HH:mm")
                : "-"}{" "}
              -
              {item.attendance_json?.left_time
                ? format(item.attendance_json?.left_time, "HH:mm")
                : ""}
            </span>
          );
        },
      },
      {
        header: "Ish vaqti",
        accessorKey: "work_shift_start",
        cell: (_, item) => {
          return (
            <span className="whitespace-nowrap lg:break-all">
              {item?.work_shift_start?.slice(0, 5)} -{" "}
              {item?.work_shift_end?.slice(0, 5)}
            </span>
          );
        },
      },
      { header: "Manzil", accessorKey: "address" },
      {
        header: "Pasport",
        accessorKey: "id_number",
        cell: (value) => {
          return (
            <span className="whitespace-nowrap">
              {value ? formatPassportNumber(value) : "-"}
            </span>
          );
        },
      },
      {
        header: "Maosh",
        accessorKey: "salary",
        cell: (salary) => {
          return formatMoney(Number(salary));
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (_, item) => {
          return (
            <div className="flex justify-center items-center">
              <span
                className={cn(
                  "text-center whitespace-nowrap",
                  item.has_attendance
                    ? item.attendance_status == 1
                      ? "text-green-400"
                      : "text-orange-300"
                    : item.excuses_status == 1
                      ? "text-orange-400"
                      : "text-red-500",
                )}
              >
                {item.has_attendance
                  ? item.attendance_status == 1
                    ? "Vaqtida kelgan"
                    : "Kech qolgan"
                  : item.excuses_status == 1
                    ? "Sababli"
                    : "Sababsiz"}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );
};
