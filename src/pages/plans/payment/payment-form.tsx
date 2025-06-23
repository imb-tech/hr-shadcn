import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ORDER_CREATE } from "@/constants/api-endpoints"
import { usePost } from "@/hooks/usePost"
import { useTheme } from "@/layouts/theme"
import { useQueryClient } from "@tanstack/react-query"
import { ReactNode } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { FormNumberInput } from "@/components/form/number-input"

type FormValues = { amount: string }

const TabC = ({ children, value }: { children: ReactNode; value: string }) => (
    <TabsContent value={value}>
        <Card className="shadow-none">
            <CardContent>{children}</CardContent>
        </Card>
    </TabsContent>
)

const PaymentFormTab = ({
    onSubmit,
    control,
    isPendingCreate,
    isSubmitting,
}: {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
    control: any
    isPendingCreate: boolean
    isSubmitting: boolean
}) => (
    <form
        onSubmit={onSubmit}
        className="sm:p-5 p-0 flex sm:flex-row flex-col items-start gap-3"
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
        <div>
            <label htmlFor="button" className="opacity-0">
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
)

export default function PaymentForm() {
    const queryClient = useQueryClient()
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

    const handlePayment = (type: string) => (values: FormValues) =>
        postMutate(ORDER_CREATE, { provider: type, amount: values.amount })

    return (
        <Tabs aria-label="payment types" defaultValue="click">
            <div className="overflow-x-auto no-scrollbar-x lg:mt-0 mt-4">
                <TabsList className="min-h-20 sm:min-h-24">
                    {[
                        {
                            value: "click",
                            img: `/images/click${
                                theme === "dark" ? "-dark.svg" : ".png"
                            }`,
                        },
                        {
                            value: "payme",
                            img: `/images/payme${
                                theme === "dark" ? "-dark.svg" : ".png"
                            }`,
                        },
                    ].map(({ value, img }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="px-3 sm:px-8 data-[state=active]:bg-primary/20 hover:bg-primary/5"
                        >
                            <div className="w-16 sm:w-24 flex justify-center">
                                <img src={img} width={100} />
                            </div>
                        </TabsTrigger>
                    ))}
                    {/* <TabsTrigger
                        value="bonus"
                        className="px-3 sm:px-8 data-[state=active]:bg-primary/20 hover:bg-primary/5"
                    >
                        <div className="flex items-center gap-3 w-[180px]">
                            <span className="flex items-center justify-center bg-green-500/15 p-2 rounded-xl">
                                <WalletMinimal
                                    className="text-green-500"
                                    size={32}
                                />
                            </span>
                            <div className="flex flex-col items-start">
                                <p className="text-sm sm:text-lg text-green-500">
                                    Bonus
                                </p>
                                <p className="text-sm sm:text-lg text-green-500">
                                    {(500000).toLocaleString()} so'm
                                </p>
                            </div>
                        </div>
                    </TabsTrigger> */}
                </TabsList>
            </div>

            <TabC value="click">
                <PaymentFormTab
                    onSubmit={handleSubmit(handlePayment("2"))}
                    control={control}
                    isPendingCreate={isPendingCreate}
                    isSubmitting={isSubmitting}
                />
            </TabC>

            <TabC value="payme">
                <PaymentFormTab
                    onSubmit={handleSubmit(handlePayment("1"))}
                    control={control}
                    isPendingCreate={isPendingCreate}
                    isSubmitting={isSubmitting}
                />
            </TabC>

            {/* <TabC value="bonus">
                <PaymentFormTab
                    onSubmit={handleSubmit(handlePayment("3"))}
                    control={control}
                    isPendingCreate={isPendingCreate}
                    isSubmitting={isSubmitting}
                />
            </TabC> */}
        </Tabs>
    )
}
