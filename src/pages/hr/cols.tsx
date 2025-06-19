import PopoverImage from "@/components/elements/popover-image";
import { ColumnDef } from "@/components/ui/table";
import findHighlights from "@/lib/find-highlights";
import { formatMoney } from "@/lib/format-money";
import formatPhoneNumber from "@/lib/formatter-phone";
import { useMemo } from "react";

export const useHrListCols = (query?: string) => {
  return useMemo<ColumnDef<Human>[]>(
    () => [
      {
        header: "Rasm",
        accessorKey: "face",
        cell: (value: string) => {
          return (
            <div className="max-w-8">
              <PopoverImage image={value} />
            </div>
          );
        },
      },
      {
        header: "FIO",
        accessorKey: "middle_name",
        cell: (_, item) => {
          return (
            <span className="whitespace-nowrap lg:break-all">
              {findHighlights(
                `${item.first_name} ${item.last_name} ${item.middle_name}`,
                query ?? "",
                "",
              )}
              {/* {item.first_name} {item.last_name} {item.middle_name} */}
            </span>
          );
        },
      },
      {
        header: "Telefon",
        accessorKey: "phone_number",
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
        header: "Maosh",
        accessorKey: "salary",
        cell: (salary) => {
          return formatMoney(Number(salary));
        },
      },
      { header: "Amallar", accessorKey: "actions" },
    ],
    [query],
  );
};
