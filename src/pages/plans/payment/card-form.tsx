import FormInputOTP from "@/components/form/input-otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, CreditCard } from "lucide-react"

export default function Cardform() {
    return (
        <div className="p-4 flex flex-col items-start gap-3">
            <p>Karta ma'lumotlarini kiritng</p>
            <div className="flex items-center gap-3">
                <Input
                    placeholder="1234 5678 8765 4321"
                    className="max-w-[220px]"
                    maxLength={19}
                    prefixIcon={<CreditCard />}
                />
                <Input
                    placeholder="05 / 20"
                    className="max-w-[100px]"
                    maxLength={7}
                    prefixIcon={<CalendarDays />}
                />
            </div>
            <div className="mt-4">
                <p>Tasdiqlash kodi</p>
                <FormInputOTP maxLength={5} value="12345" />
            </div>
            <Button color="primary">Davom etish</Button>
        </div>
    )
}
