import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NumberInput } from "@/components/ui/number-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/layouts/theme"
import { WalletMinimal } from "lucide-react"
import { ReactNode, useState } from "react"

function TabC({ children, value }: { children: ReactNode; value: string }) {
    return (
        <TabsContent value={value}>
            <Card className="shadow-none">
                <CardContent>{children}</CardContent>
            </Card>
        </TabsContent>
    )
}

export default function PaymentForm() {
    const { theme } = useTheme()
    const [value, setValue] = useState<string | null>(null)
    const [type, setType] = useState<string | null>(null)


    return (
        <Tabs aria-label="payment types" defaultValue="click" onValueChange={setType}>
            <div className="overflow-x-auto no-scrollbar-x lg:mt-0 mt-4">
                <TabsList className="min-h-20 sm:min-h-24">
                    <TabsTrigger
                        value="click"
                        className="px-3 sm:px-8 data-[state=active]:bg-primary/20 hover:bg-primary/5"
                    >
                        <div className="w-16 sm:w-24 flex justify-center">
                            <img
                                src={`/images/click${
                                    theme === "dark" ? "-dark.svg" : ".png"
                                }`}
                                width={100}
                            />
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="payme"
                        className="px-3 sm:px-8 data-[state=active]:bg-primary/20 hover:bg-primary/5"
                    >
                        <div className="w-16 sm:w-24 flex justify-center">
                            <img
                                src={`/images/payme${
                                    theme === "dark" ? "-dark.svg" : ".png"
                                }`}
                                width={100}
                            />
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
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
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabC value={"click"}>
                <div className="sm:p-5 p-0 flex sm:flex-row flex-col w-full items-end gap-3">
                    <NumberInput
                        label="Summa kiriting"
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        suffix=" so'm"
                        onValueChange={(val) => setValue(val.value)}
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
            <TabC value={"payme"}>
                <div className="sm:p-5 p-0 flex sm:flex-row flex-col items-end gap-3">
                    <NumberInput
                        label="Summa kiriting"
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        suffix=" so'm"
                         onValueChange={(val) => setValue(val.value)}
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
            <TabC value={"bonus"}>
                <div className="sm:p-5 p-0 flex sm:flex-row flex-col items-end gap-3">
                    <NumberInput
                        label="Summa kiriting"
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        defaultValue="500,000"
                        suffix=" so'm"
                         onValueChange={(val) => setValue(val.value)}
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
        </Tabs>
    )
}
