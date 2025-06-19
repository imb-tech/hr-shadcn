import { Card } from "@/components/ui/card"
import PButton from "@/components/ui/p-button"
import { GET_ME } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { useNavigate } from "@tanstack/react-router"
import { DollarSign, Wallet } from "lucide-react"

export default function PlanProfile() {
    const { data } = useGet(GET_ME)
    const navigate = useNavigate({ from: "/plans" })

    return (
        <div className="w-full rounded-xl mb-4">
            <div className="grid grid-cols-2 gap-3">
                <Card className="flex flex-row justify-between items-center gap-5 gap-x-8 gap-y-4 p-5 rounded-md">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <DollarSign
                                className=" text-gray-700 dark:text-gray-300"
                                size={30}
                            />
                        </div>
                        <div>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                Balans
                            </p>
                            <p className="text-xl font-medium text-gray-900 dark:text-white">
                                {formatMoney(data?.balance)} so'm
                            </p>
                        </div>
                    </div>
                    <PButton
                        allow={["balance_top_up"]}
                        onClick={() => navigate({ to: "/plans/checkout" })}
                        color="primary"
                        variant="secondary"
                    >
                        <Wallet size={16} />
                        Balansni toldirish
                    </PButton>
                </Card>
            </div>
        </div>
    )
}
