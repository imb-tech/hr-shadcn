import { Card, CardContent } from "@/components/ui/card";
import { Clock4, SquareCheckBig, SquarePen } from "lucide-react";

export default function TaskCard() {
  return (
    <Card className="group border-2 dark:border-zinc-800 dark:hover:border-blue-300 rounded-xl overflow-hidden transition-all duration-300 dark:hover:shadow-zinc-800/30 ">
      <div className="rounded-t-xl p-2  opacity-65 relative">
        <span className="absolute right-2 top-1 p-1.5 rounded-full  hover:bg-zinc-600">
          <SquarePen size={16} />
        </span>
      </div>
      <CardContent className="p-3 relative space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-red-700 h-2 w-10 rounded-md"></span>
          <span className="bg-orange-700 h-2 w-10 rounded-md"></span>
          <span className="bg-yellow-700 h-2 w-10 rounded-md"></span>
          <span className="bg-green-700 h-2 w-10 rounded-md"></span>
        </div>
        <h1 className="leading-tight text-sm text-zinc-300">
          Foydalanuvchi autentifikatsiyasini sozlash
        </h1>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm">
              <Clock4 size={16} />
              <span>Iyun 5</span>
            </span>
            <span className="flex whitespace-nowrap items-center gap-2 text-sm">
              <SquareCheckBig size={16} />
              <span>2 / 7</span>
            </span>
          </div>
          {/* <Avatar name="AO" size="sm" /> */}
        </div>
      </CardContent>
    </Card>
  );
}
