import DeleteModal from "@/components/elements/delete-modal";
import ParamPagination from "@/components/param/pagination";
import ParamSelect from "@/components/param/param-select";
import { ParamInputSearch } from "@/components/param/search-input";
import PButton from "@/components/ui/p-button";
import DataTable from "@/components/ui/table";
import {
  HR_API,
  HR_EXCEL_DOWN,
  HR_EXCEL_TEMP,
  HR_EXCEL_UP,
  POSITION,
} from "@/constants/api-endpoints";
import { useModal } from "@/hooks/use-modal";
import { useStore } from "@/hooks/use-store";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { downloadExcel } from "@/lib/download-excel";
import { addToast } from "@heroui/toast";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Download, FileText, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHrListCols } from "./cols";

export default function HrPage() {
  const { openModal } = useModal("delete");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const params = useSearch({ from: "__root__" });
  const [excelDown, setExcelDow] = useState({ down: false, template: false });

  const { data: dataPosition } = useGet<Position[]>(POSITION);
  const { data: dataDown, isLoading: isLoadingDown } = useGet(HR_EXCEL_DOWN, {
    options: { enabled: excelDown.down },
    config: {
      responseType: "blob",
    },
  });
  const { data: dataTemplate, isLoading: isLoadingTemplate } = useGet(
    HR_EXCEL_TEMP,
    {
      options: { enabled: excelDown.template },
      config: {
        responseType: "blob",
      },
    },
  );
  const { data, isLoading, isSuccess, refetch } = useGet<ListResponse<Human>>(
    HR_API,
    {
      params: { ...params, page_size: 48 },
    },
  );

  const { mutate, isPending } = usePost(
    {
      onSuccess: () => {
        addToast({
          description: "Muaffaqiyatli qo'shildi",
          color: "success",
        });
        refetch();
      },
      onError: async (err) => {
        if (err.response && err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);

            addToast({
              // title: "Xatolik",
              description: (
                <pre className="text-left  bg-background text-sm">
                  {JSON.stringify(json, null, 2)}
                </pre>
              ),
              color: "danger",
              classNames: {
                base: "min-w-[500px] !p-1 !gap-x-0 flex justify-center",
                description: "!text-sm !p-0",
                icon: "hidden",
                content: "!p-0",
              },
            });

            // if (json?.detail) {
            //   addToast({
            //     title: "Xatolik",
            //     description: json?.detail || "Xatolikni o'qib bo'lmadi",
            //     color: "danger",
            //   });
            // } else if (json?.length) {
            //   json.forEach((element: Record<string, string>) => {
            //     for (const [key, value] of Object.entries(element)) {
            //       addToast({
            //         title: "Xatolik",
            //         description: `${key} ${JSON.stringify(value)}`,
            //         color: "danger",
            //       });
            //     }
            //   });
            // }
          } catch (e) {
            console.error("Xatolikni o'qib bo'lmadi:", e);
          }
        } else {
          console.error("Xatolik:", err);
        }
      },
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    },
  );
  const { store, setStore } = useStore<Human>("hr-data");

  function handleDelete(item: Human) {
    if (!item.id) return;
    openModal();
    setStore(item);
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleExcel = (type: "down" | "template") => {
    if (type === "down") {
      setExcelDow((prev) => ({ ...prev, down: true }));
    } else if (type === "template") {
      setExcelDow((prev) => ({ ...prev, template: true }));
    }
  };
  const handleExcelUp = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      mutate(HR_EXCEL_UP, formData);
    }
  };

  useEffect(() => {
    if (excelDown.down && dataDown) {
      downloadExcel({ data: dataDown });
      addToast({
        description: "Muaffaqiyatli yuklab olindi",
        color: "success",
      });
    } else if (excelDown.template && dataTemplate) {
      downloadExcel({ data: dataTemplate });
      addToast({
        description: "Muaffaqiyatli yuklab olindi",
        color: "success",
      });
    }
  }, [excelDown, dataDown, dataTemplate]);

  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-3 w-full mb-3">
        <ParamInputSearch />
        <ParamSelect
          className="max-w-full "
          optionLabelKey="name"
          optionValueKey="id"
          options={dataPosition}
          paramName="role_id"
          placeholder="Lavozimlar"
        />
        <div className="w-full flex items-center gap-3">
          <PButton
            allow={["employee_upload"]}
            isLoading={isLoadingTemplate}
            onPress={() => handleExcel("template")}
            className="w-full px-2"
          >
            Shablon
            <FileText size={18} />
          </PButton>
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelUp}
              className="hidden"
              accept=".xlsx"
            />
            <PButton
              allow={["employee_upload"]}
              isLoading={isPending}
              disabled={isPending}
              onPress={handleButtonClick}
              className="w-full px-2"
            >
              Yuklash <Upload size={18} className="ml-2" />
            </PButton>
          </>
          <PButton
            allow={["employee_download"]}
            isLoading={isLoadingDown}
            onPress={() => handleExcel("down")}
            className="w-full px-2"
          >
            Yuklab olish <Download size={18} />
          </PButton>
        </div>
      </div>
      <DataTable
        indexing
        columns={useHrListCols(params?.search)}
        data={data?.results || []}
        isLoading={isLoading}
        onDelete={(item) => handleDelete(item)}
        actionPermissions={["employee_control"]}
        onEdit={(item) => {
          if (!item.id) return;
          navigate({ to: `/hr-edit/${item.id}` });
        }}
        onRowClick={(item) => navigate({ to: `/hr-view/${item.id}` })}
      />
      {isSuccess && data?.total_pages > 1 ? (
        <ParamPagination total={data?.total_pages ?? 0} />
      ) : null}
      <DeleteModal id={store?.id} path={HR_API} />
    </div>
  );
}
