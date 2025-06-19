import PopoverImage from "@/components/elements/popover-image";
import Private from "@/components/private";
import { ColumnDef } from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { useStore } from "@/hooks/use-store";
import { formatDateTime } from "@/lib/format-date";
import { Button } from "@heroui/button";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

export const usSettingsCols = () => {
  const { openModal } = useModal();
  const { setStore: setStoreData } = useStore<StatusType>("status-data");
  const { setStore: setStatus } = useStore<{ status: number | string }>(
    "status",
  );

  function handleItem(item: StatusType) {
    if (!item.id) return;
    setStoreData(item);
    openModal();
  }

  return useMemo<ColumnDef<StatusType>[]>(
    () => [
      {
        header: "Rasm",
        accessorKey: "face",
        cell: (_, item) => {
          return (
            <div className="max-w-8">
              <PopoverImage image={item.face} />
            </div>
          );
        },
      },
      {
        header: "FIO",
        accessorKey: "full_name",
        cell(value) {
          return <span className="whitespace-nowrap">{value}</span>;
        },
      },
      {
        header: "So'ralgan kunlar",
        accessorKey: "start",
        cell(_, item) {
          return (
            <span className="whitespace-nowrap">
              {formatDateTime(item.start)} - {formatDateTime(item.end)}
            </span>
          );
        },
      },
      {
        header: "Sababi",
        accessorKey: "comment",
        cell(value) {
          return <span>{value}</span>;
        },
      },
      {
        header: "Rad etish sababi",
        accessorKey: "response_comment",
        cell(value) {
          return <span>{value}</span>;
        },
      },
      {
        header: "Holat",
        accessorKey: "id",
        cell(_, item) {
          return item.status === 0 ? (
            <Private allow={["excuse_confirmed"]}>
              <div className="flex items-center justify-end">
                <Button
                  className="min-w-4 "
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    handleItem(item), setStatus({ status: 2 });
                  }}
                >
                  <X size={20} />
                </Button>
                <Button
                  className="min-w-4 "
                  color="success"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    handleItem(item), setStatus({ status: 1 });
                  }}
                >
                  <Check size={20} />
                </Button>
              </div>
            </Private>
          ) : (
            <div className={"flex w-full justify-end"}>
              <Button
                className={`flex  ${item.status === 2 ? "justify-end" : "justify-start"}`}
                color={item.status === 2 ? "danger" : "success"}
                variant="light"
              >
                {item.status === 2 ? "Rad etilgan" : "Ruxsat berilgan"}
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );
};
