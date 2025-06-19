import { ColumnDef } from "@/components/ui/table";
import { cn } from "@heroui/theme";
import { useMemo } from "react";
import { UsersType } from ".";

export const usUsersCols = (price: number) => {
  return useMemo<ColumnDef<UsersType>[]>(
    () => [
      {
        header: "Lavozim",
        accessorKey: "position",
      },
      {
        header: "FIO",
        accessorKey: "full_name",
      },
      {
        header: "Ta'rif holati",
        accessorKey: "status",
        cell: (_, itm) => (
          <div
            className={cn(
              "whitespace-nowrap text-center",
              !itm.status ? "text-green-500" : "text-red-500",
            )}
          >
            {itm.status ? "Ta'rif mavjud " : `+ ${price.toLocaleString()}`}
          </div>
        ),
      },
    ],
    [price],
  );
};
