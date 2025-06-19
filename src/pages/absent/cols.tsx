import { formatMoney } from "@/lib/format-money";
import { formatPhoneNumber } from "@/lib/format-phone-number";
import formatPassportNumber from "@/lib/formatter-pasport";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useAbsentListCols = () => {
  return useMemo<ColumnDef<Human>[]>(
    () => [
      {
        header: "Rasm",
        accessorKey: "face",
        cell: (value) => {
          return (
            <div className="max-w-8">
              {/* <PopoverImage image={value} /> */}
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
              {formatPhoneNumber(String(value))}
            </span>
          );
        },
      },
      {
        header: "Lavozim",
        accessorKey: "role_name",
      },
      {
        header: "Ish vaqti",
        accessorKey: "work_shift_start",
        cell: ({row}) => {
          return (
            <span className="whitespace-nowrap lg:break-all">
              {row.original?.work_shift_start?.slice(0, 5)} -{" "}
              {row.original?.work_shift_end?.slice(0, 5)}
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
              {value ? formatPassportNumber(String(value)) : "-"}
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
        accessorKey: "excuses_status",
        cell: ({row}) => {
          return (
            <div className="flex justify-center items-center">
              <span
                className={cn(
                  "text-center",
                  row.original.excuses_status == 1 ? "text-orange-400 " : "text-red-500 ",
                )}
              >
                {row.original.excuses_status == 1 ? "Sababli" : "Sababsiz"}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );
};
