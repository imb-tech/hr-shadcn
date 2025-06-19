import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const usPostionsCols = () => {
  return useMemo<ColumnDef<Position>[]>(
    () => [
      {
        header: "Lavozim",
        accessorKey: "name",
        cell: (_, itm) => (
          <span className="whitespace-nowrap md:break-all">{itm.name}</span>
        ),
      },
      {
        header: "Ish vaqti",
        accessorKey: "work_shift_end",
        cell: (_, itm) => (
          <span className="whitespace-nowrap md:break-all">
            {itm.work_shift_start?.slice(0, 5)} -{" "}
            {itm.work_shift_end?.slice(0, 5)}
          </span>
        ),
      },
      {
        header: "Hodimlar soni",
        accessorKey: "count",
      },
      { header: "Amallar", accessorKey: "actions" },
    ],
    [],
  );
};
