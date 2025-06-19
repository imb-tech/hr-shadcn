import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { InputOtp } from "@heroui/react";
import { CalendarDays, CreditCard } from "lucide-react";

export default function Cardform() {
  return (
    <div className="p-4 flex flex-col items-start gap-3">
      <p>Karta ma'lumotlarini kiritng</p>
      <div className="flex items-center gap-3">
        <Input
          placeholder="1234 5678 8765 4321"
          labelPlacement="outside"
          size="lg"
          className="max-w-[220px]"
          maxLength={19}
          startContent={<CreditCard />}
        />
        <Input
          placeholder="05 / 20"
          labelPlacement="outside"
          size="lg"
          className="max-w-[100px]"
          maxLength={7}
          startContent={<CalendarDays />}
        />
      </div>
      <div className="mt-4">
        <p>Tasdiqlash kodi</p>
        <InputOtp length={5} radius="lg" classNames={{ input: "rounded-xl" }} />
      </div>
      <Button color="primary">Davom etish</Button>
    </div>
  );
}
