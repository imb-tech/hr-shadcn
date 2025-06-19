import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { cn } from "@heroui/theme";
import { Users } from "lucide-react";
import { Selected } from "../position/position-accordion";
import PopoverImage from "@/components/elements/popover-image";

export const months: any = [
  { value: 1, label: "Yanvar" },
  { value: 2, label: "Fevral" },
  { value: 3, label: "Mart" },
  { value: 4, label: "Aprel" },
  { value: 5, label: "May" },
  { value: 6, label: "Iyun" },
  { value: 7, label: "Iyul" },
  { value: 8, label: "Avgust" },
  { value: 9, label: "Sentabr" },
  { value: 10, label: "Oktabr" },
  { value: 11, label: "Noyabr" },
  { value: 12, label: "Dekabr" },
];

type Props = {
  toggleMonth: (customerId: number, month: number) => void;
  selected: Selected[];
  data: IncomingEmployee[];
};

const planMap: Record<SubscriptionLevel, string> = {
  1: "🚀",
  2: "⚡",
  3: "💎",
};

export default function FullCalendarEmployees({
  toggleMonth,
  selected,
  data,
}: Props) {
  const currentMonth = new Date().getMonth() + 1;

  const isSelected = (customerId: number, month: number) => {
    return selected.some(
      (item) => item.customer === customerId && item.month.includes(month),
    );
  };

  const convertedData: Employee[] = data.map((user) => {
    const subscriptions: Record<number, SubscriptionLevel> = {};
    user.subscriptions.forEach((sub) => {
      subscriptions[sub.month] = sub.plan;
    });

    return {
      id: user.id,
      first_name: user.full_name,
      subscriptions,
    };
  });

  return (
    <Card>
      <CardBody className="space-y-4 rounded-md">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableColumn>
                <div className="whitespace-nowrap flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Xodimlar / Oy</span>
                </div>
              </TableColumn>
              {months.map((month: any) => (
                <TableColumn
                  key={month.value}
                  className={cn(
                    "text-center min-w-[80px] border-l dark:border-l-zinc-700 last:rounded-tr-md",
                    currentMonth > month.value &&
                      "dark:bg-gray-800 bg-gray-200 opacity-60 dark:border-l-zinc-800",
                    currentMonth === month.value &&
                      "dark:bg-blue-700/50 bg-blue-600/50 text-white dark:border-l-zinc-800",
                  )}
                >
                  {month.label}
                </TableColumn>
              ))}
            </TableHeader>

            <TableBody>
              {convertedData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium border-b dark:border-b-zinc-800">
                    <div className="flex items-center gap-3">
                      <PopoverImage image={employee.face} />
                      <span>{employee.first_name}</span>
                    </div>
                  </TableCell>
                  {months.map((month: any) => {
                    const level = employee.subscriptions[month.value];
                    const icon = planMap[level] || "";
                    const selectedStyle = isSelected(employee.id, month.value)
                      ? "bg-blue-600/25 text-black font-semibold"
                      : "";

                    return (
                      <TableCell
                        key={month.value}
                        className={cn(
                          `text-center cursor-pointer capitalize border border-t-0 dark:border-zinc-950 transition ${selectedStyle}`,
                          currentMonth > month.value &&
                            "dark:bg-gray-800 bg-gray-200 opacity-50 cursor-not-allowed",
                          currentMonth === month.value &&
                            "dark:bg-blue-700/40 bg-blue-600/40 cursor-not-allowed",
                        )}
                        onClick={() => {
                          if (currentMonth < month.value) {
                            toggleMonth(employee.id, month.value);
                          }
                        }}
                      >
                        {icon}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}
