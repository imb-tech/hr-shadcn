import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const usOfficeCols = () => {
  return useMemo<ColumnDef<Office>[]>(
    () => [
      { header: "ID", accessorKey: "id" },
      {
        header: "Nomi",
        accessorKey: "id",
        cell: ({row}) => (
          <span className="whitespace-nowrap lg:break-all">
            {row.original.properties.name}
          </span>
        ),
      },
      {
        header: "Manzil",
        accessorKey: "id",
        cell: ({row}) => (
          <span className="whitespace-nowrap lg:break-all">
            {row.original.properties.address}
          </span>
        ),
      },
      {
        header: "Hodimlar soni",
        accessorKey: "id",
        cell: ({row}) => <span>{row.original.properties.employee_count}</span>,
      },
      {
        header: "Tushlik vaqti",
        accessorKey: "id",
        cell: ({row}) => (
          <span className="whitespace-nowrap lg:break-all">
            {row.original.properties.lunch_start_time?.slice(0, 5)} -{" "}
            {row.original.properties.lunch_end_time?.slice(0, 5)}
          </span>
        ),
      },
      { header: "Amallar", accessorKey: "actions" },
    ],
    [],
  );
};
