import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NumberInput } from "@/components/ui/number-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/layouts/theme"
import { WalletMinimal } from "lucide-react"
import { ReactNode } from "react"

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

    return (
        <Tabs aria-label="payment types" defaultValue="click">
            <TabsList className="min-h-20 sm:min-h-24">
                <TabsTrigger value="click" className="px-3 sm:px-8 data-[state=active]:bg-primary/10">
                    <div className="w-16 sm:w-24 flex justify-center">
                        <img
                            src={`/images/click${theme === "dark" ? "-dark.svg" : ".png"}`}
                            width={100}
                        />
                    </div>
                </TabsTrigger>
                <TabsTrigger value="payme" className="px-3 sm:px-8 data-[state=active]:bg-primary/10">
                    <div className="w-16 sm:w-24 flex justify-center">
                        <img
                            src={`/images/payme${theme === "dark" ? "-dark.svg" : ".png"}`}
                            width={100}
                        />
                    </div>
                </TabsTrigger>
                <TabsTrigger value="bonus" className="px-3 sm:px-8 data-[state=active]:bg-primary/10">
                    <div className="flex items-center gap-3 w-[180px]">
                        <span className="flex items-center justify-center bg-success-500/15 p-2 rounded-xl">
                            <WalletMinimal
                                className="text-success-500"
                                size={32}
                            />
                        </span>
                        <div className="flex flex-col items-start">
                            <p className="text-sm sm:text-lg text-success-500">
                                Bonus
                            </p>
                            <p className="text-sm sm:text-lg">
                                {(500000).toLocaleString()} so'm
                            </p>
                        </div>
                    </div>
                </TabsTrigger>
            </TabsList>

            <TabC value={"click"}>
                <div className="p-5 flex items-center gap-3">
                    <NumberInput
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        suffix=" so'm"
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
            <TabC value={"payme"}>
                <div className="p-5 flex items-center gap-3">
                    <NumberInput
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        suffix=" so'm"
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
            <TabC value={"bonus"}>
                <div className="p-5 flex items-center gap-3">
                    <NumberInput
                        thousandSeparator=" "
                        placeholder="Ex: 450,000"
                        defaultValue="500,000"
                        suffix=" so'm"
                    />
                    <Button color="primary">To'lov qilish</Button>
                </div>
            </TabC>
        </Tabs>
    )
}
