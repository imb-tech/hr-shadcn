import { Button } from "@/components/ui/button"
import { ORDER_CREATE } from "@/constants/api-endpoints"
import { usePost } from "@/hooks/usePost"
import { useTheme } from "@/layouts/theme"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { FormNumberInput } from "@/components/form/number-input"
import ParamTabs from "@/components/as-params/tabs"
import { useSearch } from "@tanstack/react-router"

type FormValues = { amount: string }

export default function PaymentForm() {
    const queryClient = useQueryClient()
    const search = useSearch({ strict: false })
    const { theme } = useTheme()

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm<FormValues>({ defaultValues: { amount: "" }, mode: "onChange" })

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess: (data) => {
            if (data?.url) {
                queryClient.refetchQueries({ queryKey: ["common/orders"] })
                toast.success("Muvaffaqiyatli to'landi")
                window.location.href = data.url
                reset()
            }
        },
    })

    const handlePayment = (values: FormValues) =>
        postMutate(ORDER_CREATE, {
            provider: search.tab,
            amount: values.amount,
        })

    const tabs = [
        {
            label: (
                <div className="w-16 sm:w-32 h-16 sm:h-24 flex justify-center">
                    <img
                        src={`/images/click${
                            theme === "dark" ? "-dark.svg" : ".png"
                        }`}
                        width={100}
                    />
                </div>
            ),
            value: 2,
        },
        {
            label: (
                <div className="w-16 sm:w-32 h-16 sm:h-24 flex justify-center">
                    <img
                        src={`/images/payme${
                            theme === "dark" ? "-dark.svg" : ".png"
                        }`}
                        width={100}
                    />
                </div>
            ),
            value: 1,
        },
        // {
        //     label: (
        //         <div className="flex items-center gap-3 w-[180px] h-16 sm:h-24">
        //             <span className="flex items-center justify-center bg-green-500/15 p-2 rounded-xl">
        //                 <WalletMinimal className="text-green-500" size={32} />
        //             </span>
        //             <div className="flex flex-col items-start">
        //                 <p className="text-sm sm:text-lg text-green-500">
        //                     Bonus
        //                 </p>
        //                 <p className="text-sm sm:text-lg text-green-500">
        //                     {(500000).toLocaleString()} so'm
        //                 </p>
        //             </div>
        //         </div>
        //     ),
        //     value: 3,
        // },
    ]

    return (
        <div className="space-y-4 mt-4">
            <div className="overflow-x-auto no-scollbar-x w-full">
                <ParamTabs
                    className={"h-full"}
                    paramName="tab"
                    options={tabs}
                />
            </div>
            <form
                onSubmit={handleSubmit(handlePayment)}
                className="sm:p-8 p-4 bg-card rounded-md border shadow-md flex sm:flex-row flex-col items-start gap-3"
            >
                <FormNumberInput
                    required
                    control={control}
                    name="amount"
                    label="Summa kiriting"
                    thousandSeparator=" "
                    placeholder="Ex: 450,000"
                    suffix=" so'm"
                    hideError={false}
                    registerOptions={{
                        min: {
                            value: 1000,
                            message: "Minimal summa 1000 so'm bo'lishi kerak",
                        },
                    }}
                />
                <div className="flex sm:flex-col justify-end sm:w-max w-full">
                    <label
                        htmlFor="button"
                        className="opacity-0 sm:block hidden"
                    >
                        C
                    </label>
                    <Button
                        type="submit"
                        disabled={isPendingCreate || isSubmitting}
                        loading={isPendingCreate}
                        color="primary"
                    >
                        To'lov qilish
                    </Button>
                </div>
            </form>
        </div>
    )
}
