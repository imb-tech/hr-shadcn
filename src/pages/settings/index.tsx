import { ParamDatePicker } from "@/components/param/date-picker";
import ParamTabs from "@/components/param/tabs";
import Modal from "@/components/ui/modal";
import DataTable from "@/components/ui/table";
import { EXCUSE, EXCUSE_COUNT } from "@/constants/api-endpoints";
import { useStore } from "@/hooks/use-store";
import { useGet } from "@/hooks/useGet";
import { usePatch } from "@/hooks/usePatch";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { usSettingsCols } from "./cols";

export default function SettingsPage() {
  const search = useSearch({ strict: false });

  const {
    data: data,
    isSuccess,
    isLoading,
  } = useGet<StatusType[]>(EXCUSE, { params: search });
  const { data: dataCount } = useGet<{ [key: string]: string | undefined }>(
    EXCUSE_COUNT,
  );

  const tabOptions = [
    { key: "0", label: `So'rovlar (${dataCount?.["0"] ?? 0})` },
    { key: "1", label: `Ruxsat berilganlar (${dataCount?.["1"] ?? 0})` },
    { key: "2", label: `Rad etilganlar (${dataCount?.["2"] ?? 0})` },
  ];

  const { store } = useStore<StatusType>("status-data");
  const queryClient = useQueryClient();
  const { store: status } = useStore<{ status: number | string }>("status");
  const [comment, setComment] = useState("");

  const { mutate } = usePatch({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXCUSE],
      });
      queryClient.invalidateQueries({
        queryKey: [EXCUSE_COUNT],
      });
      status?.status === 2
        ? addToast({
            title: "Ruxsat berilmadi",
            color: "danger",
          })
        : addToast({
            title: "Muvaffaqiyatli ruxsat berildi",
            color: "success",
          });
    },
  });

  function updatesStatus() {
    if (status?.status === 2) {
      mutate(`${EXCUSE}/${store?.id}`, {
        status: status?.status,
        response_comment: comment,
      });
    } else {
      mutate(`${EXCUSE}/${store?.id}`, status);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ParamTabs clearOther={false} paramName="status" tabs={tabOptions} />
        <ParamDatePicker className="w-auto" />
      </div>

      <DataTable
        indexing
        columns={usSettingsCols()}
        data={(isSuccess && data) || []}
        isLoading={isLoading}
      />
      <Modal>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                {status?.status == 2 ? "Rad etilsinmi?" : "Ruxsat berilsinmi?"}
              </ModalHeader>
              {status?.status === 2 ? (
                <ModalBody>
                  <Textarea
                    className="w-full"
                    label="Sabab"
                    labelPlacement="outside"
                    placeholder="Sabab..."
                    variant="flat"
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ModalBody>
              ) : null}
              <ModalFooter>
                {status?.status === 2 ? (
                  <Button
                    color="danger"
                    disabled={Boolean(!comment)}
                    variant="flat"
                    onPress={() => {
                      updatesStatus(), onClose();
                    }}
                  >
                    Rad etish
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onPress={() => {
                      updatesStatus(), onClose();
                    }}
                  >
                    Ruxsat berish
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
