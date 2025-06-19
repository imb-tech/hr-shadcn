import { Button, Card } from "@heroui/react";
import { cn } from "@heroui/theme";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, User } from "lucide-react";

export default function PlanList() {
  const navigate = useNavigate();

  function handleClick(id: number) {
    navigate({ to: "/plans/$id", params: { id: id.toString() } });
  }

  return (
    <div className="grid grid-cols-3 gap-8 my-10">
      {plans?.map((pln) => (
        <Card
          className={cn(
            "w-full p-0 hover:shadow-md cursor-pointer hover:scale-[102%]",
          )}
          key={pln.id}
        >
          <div
            className="flex flex-col gap-4 p-6 h-full [&_button]:hover:bg-primary [&_span]:hover:opacity-100 relative"
            onClick={() => handleClick(pln.id)}
          >
            <h2 className="text-xl">{pln.name}</h2>
            <div className="flex items-center gap-2 text-primary">
              <p className="text-2xl">{pln.price.toLocaleString()} so'm</p>
              <span>/</span>
              <User />
            </div>

            <Button onPress={() => handleClick(pln.id)}>
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

export const plans: Plan[] = [
  {
    id: 1,
    name: "Boshlang'ich (Starter)",
    price: 4000,
  },
  {
    id: 2,
    name: "O‘rta (Standard)",
    price: 6000,
  },
  {
    id: 3,
    name: "Premium (Advanced)",
    price: 12000,
  },
];
