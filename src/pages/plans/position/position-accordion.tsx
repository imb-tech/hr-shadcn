import Accordion from "@/components/ui/accordion";
import Modal from "@/components/ui/modal";
import { GET_ME, PAYMENTS_CANCELLED, POSITION_USERS } from "@/constants/api-endpoints";
import { useModal } from "@/hooks/use-modal";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { Selection } from "@react-types/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eraser } from "lucide-react";
import { useState } from "react";
import FullCalendarEmployees from "../employees/full-calendar";

type Props = {
  info: { id: number; name: string }[] | undefined;
};

export type Selected = {
  customer: number;
  month: number[];
};

function PositionAccordionTraffic({ info }: Props) {
  const queryClinet = useQueryClient();
  const [selected, setSelected] = useState<Selected[]>([]);
  const search = useSearch({ from: "/_main/plans/" });
  const navigate = useNavigate();
  const { data } = useGet<IncomingEmployee[]>(
    `${POSITION_USERS}/${search.position}`,
    {
      options: { enabled: !!search.position },
    },
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const { openModal, closeModal } = useModal("postion-traffic");
  const { mutate, isPending } = usePost({
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: [POSITION_USERS] });
      queryClinet.invalidateQueries({ queryKey: [GET_ME] });
      addToast({
        description: "Obuna bekor qilindi",
        color: "warning",
      });
      setSelected([]);
      closeModal();
      setSelectedKeys(new Set());
      navigate({ to: "/plans" });
    },
  });

  const toggleMonth = (customerId: number, month: number) => {
    setSelected((prev) => {
      const existing = prev.find((item) => item.customer === customerId);

      if (existing) {
        const alreadySelected = existing.month.includes(month);
        const updatedMonths = alreadySelected
          ? existing.month.filter((m) => m !== month)
          : [...existing.month, month];

        return updatedMonths.length
          ? prev.map((item) =>
              item.customer === customerId
                ? { ...item, month: updatedMonths }
                : item,
            )
          : prev.filter((item) => item.customer !== customerId);
      } else {
        return [...prev, { customer: customerId, month: [month] }];
      }
    });
  };

  function clickAccordion(keys: Selection) {
    const selectedIds = Array.from(keys)
      .map((key) => info?.[Number(key)]?.id)
      .filter(Boolean);

    setSelectedKeys(keys as Set<string>);

    navigate({
      to: "/plans",
      search: {
        position: selectedIds.join(","),
      },
    });
  }

  const onSubmit = () => {
    mutate(PAYMENTS_CANCELLED, { payments: selected });
  };

  return (
    <div>
      {!!info ? (
        <div className="overflow-x-auto ">
          {!!info.length && (
            <div className="min-w-[1024px]">
              <Accordion
                itemProps={{
                  classNames: {
                    content: "hidden",
                    indicator: "opacity-0",
                    trigger: "!pb-0",
                  },
                }}
                items={[
                  {
                    key: "1",
                    title: (
                      <h1 className="text-xl">Lavozimlar bo'yicha obunalar</h1>
                    ),
                    content: null,
                  },
                ]}
                selectionMode="single"
                variant="light"
              />
              <Accordion
                itemProps={{ classNames: { trigger: "!px-0 py-3" } }}
                items={info?.map((c, i) => ({
                  key: i.toString(),
                  title: (
                    <div className="w-full flex justify-between">
                      <span>{c.name}</span>{" "}
                      {selected?.length > 0 && c.id == search.position && (
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            color="danger"
                            onPress={() => setSelected([])}
                          >
                            Tozalash <Eraser size={16} />
                          </Button>
                          <Button size="sm" color="primary" onPress={openModal}>
                            Obunani Bekor qilish
                          </Button>
                        </div>
                      )}
                    </div>
                  ),
                  content: (
                    <FullCalendarEmployees
                      toggleMonth={toggleMonth}
                      selected={selected}
                      data={data || []}
                    />
                  ),
                }))}
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={clickAccordion}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center flex-col gap-3 w-full justify-center bg-gray-500/20 rounded-md my-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      )}

      <Modal title="Obunalarni bekor qilish" modalKey="postion-traffic">
        <div>
          <p>
            Tanlangan oylar bo'yicha hodimlardan obuna bekor qilinadi. Ushbu
            amalni bajarishga rozimisiz?
          </p>
        </div>
        <Button
          onPress={onSubmit}
          disabled={isPending}
          isLoading={isPending}
          color="danger"
        >
          Obunani Bekor qilish
        </Button>
      </Modal>
    </div>
  );
}

export default PositionAccordionTraffic;
