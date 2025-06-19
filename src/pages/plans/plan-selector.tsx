import { Button, Card } from "@heroui/react";
import { cn } from "@heroui/theme";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, User } from "lucide-react";

export default function PlanSelector() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-8 my-10">
      {plans?.map((pln) => (
        <Card
          className={cn(
            "w-full p-0 hover:shadow-md cursor-pointer hover:scale-[102%]",
            pln?.recomendet
              ? "border-[1px] border-primary/50 scale-[104%] hover:scale-[105%]"
              : "border-none shadow-none",
          )}
          key={pln.id}
        >
          <div
            className="flex flex-col gap-4 p-6 h-full [&_button]:hover:bg-primary [&_span]:hover:opacity-100 relative"
            onClick={() =>
              navigate({ to: "/plans/$id", params: { id: pln.id } })
            }
          >
            {pln.recomendet ? (
              <span className="bg-secondary/30 text-secondary absolute top-2 right-2 rounded-2xl px-4 py-1 text-sm">
                Recommended
              </span>
            ) : null}
            <h2 className="text-xl">{pln.name}</h2>
            <div className="flex items-center gap-2 text-primary">
              <p className="text-2xl">{pln.price.toLocaleString()} so'm</p>
              <span>/</span>
              <User />
            </div>

            <ul className="flex flex-col gap-3 flex-1">
              {pln.features?.map((ft) => (
                <li key={ft} className="flex gap-1">
                  <span className="text-primary mt-1">
                    <Check size={16} />
                  </span>
                  <span>{ft}</span>
                </li>
              ))}
            </ul>
            <Button
              onPress={() =>
                navigate({ to: "/plans/$id", params: { id: pln.id } })
              }
            >
              <p>Tanlash</p>
              <span className="opacity-0 absolute right-4 transition-all duration-200">
                <ChevronRight />
              </span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export const plans: HrTariff[] = [
  {
    id: "1",
    name: "Boshlang'ich (Starter)",
    level: "starter",
    price: 4000, // misol uchun
    features: [
      "Turniket va FaceID orqali kirish-chiqishni nazorat qilish",
      "Xodimlarning ishga kelish va ketish hisobotlarini admin panel orqali nazorat qilish",
    ],
  },
  {
    id: "2",
    name: "O‘rta (Standard)",
    level: "standard",
    price: 6000, // misol uchun
    features: [
      "Turniket va FaceID orqali kirish-chiqishni nazorat qilish",
      "Xodimlarning ishga kelish va ketish hisobotlarini admin panel orqali nazorat qilish",
      "Xodim ishdan ruxsat olish uchun so‘rov yuborish",
      "Barcha xodimlarning joylashuvini real-timeda ko‘rish",
      "Jamoaviy vazifalarni yaratish va boshqarish",
    ],
    recomendet: true,
  },
  {
    id: "3",
    name: "Premium (Advanced)",
    level: "advanced",
    price: 12000, // misol uchun
    features: [
      "Turniket va FaceID orqali kirish-chiqishni nazorat qilish",
      "Xodimlarning ishga kelish va ketish hisobotlarini admin panel orqali nazorat qilish",
      "Xodim ishdan ruxsat olish uchun so‘rov yuborish",
      "Barcha xodimlarning joylashuvini real-timeda ko‘rish",
      "Jamoaviy vazifalarni yaratish va boshqarish",
      "Xodimlarning vazifalarni qay tarzda bajarayotganini tahlil qilish",
      "Xodimlarning joylashuv tarixini batafsil ko‘rish",
    ],
  },
];
