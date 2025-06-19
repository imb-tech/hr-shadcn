import ModalFormActions from "@/components/elements/modal-form-actions";
import FormInput from "@/components/form/input";
import { FormNumberInput } from "@/components/form/number-input";
import TimeInput from "@/components/form/time-input";
import WeekdaysFields from "@/components/form/weekdays-fields";
import { POSITION } from "@/constants/api-endpoints";
import { useModal } from "@/hooks/use-modal";
import { usePatch } from "@/hooks/usePatch";
import { usePost } from "@/hooks/usePost";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CreatePositionsFormProps {
  dataItem?: Position;
}

export default function CreatePositionsForm({
  dataItem,
}: CreatePositionsFormProps) {
  const form = useForm<Position>({
    defaultValues: { work_days: [1, 2, 3, 4, 5], salary: 0 },
  });
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const { mutate: postMutate, isPending: isPendingCreate } = usePost({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [POSITION] });
      addToast({
        description: "Muaffaqiyatli qo'shildi",
        color: "success",
      });
      closeModal();
      form.reset();
    },
  });

  const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [POSITION] });
      addToast({
        description: "Muaffaqiyatli yangilandi",
        color: "success",
      });
      closeModal();
      form.reset();
    },
  });

  const onSubmit = (values: Position) => {
    const nd = {
      ...values,
    };

    if (dataItem?.id) {
      updateMutate(`${POSITION}/${dataItem.id}`, nd);
    } else {
      postMutate(POSITION, nd);
    }
  };

  useEffect(() => {
    if (dataItem) {
      console.log(dataItem);

      form.reset(dataItem);
    }
  }, [dataItem, form]);

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          required
          label="Lavozim"
          methods={form}
          name="name"
          size="lg"
        />

        <WeekdaysFields<Position>
          required
          label="Ish kunlari"
          name="work_days"
        />

        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 py-2">
          <TimeInput
            isRequired
            label={"Ish boshlanish vaqti"}
            methods={form}
            name="work_shift_start"
            size="lg"
          />
          <TimeInput
            isRequired
            label={"Ish tugash vaqti"}
            methods={form}
            name="work_shift_end"
            size="lg"
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <FormNumberInput
            control={form.control}
            label="Oylik maosh"
            name="salary"
            placeholder="Ex: 123000"
            size={"lg" as any}
            thousandSeparator=" "
          />
          <FormNumberInput
            control={form.control}
            label="Jarima (1 daqiqa uchun)"
            name="fine_per_minute"
            placeholder="Ex: 250"
            size={"lg" as any}
            thousandSeparator=" "
          />
        </div>

        <ModalFormActions isLoading={isPendingCreate || isPendingUpdate} />
      </form>
    </FormProvider>
  );
}
