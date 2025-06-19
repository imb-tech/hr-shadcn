import PopoverImage from "@/components/elements/popover-image";
import { formatDateTime } from "@/lib/format-date";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@tanstack/react-router";
import { Clock, LogIn, LogOut } from "lucide-react";
import { calculateTimeDifference } from "../cols";

type Props = {
  data: WorkerAttendance;
};

function PositionHrCard({ data }: Props) {
  return (
    <Link to="/hr-view/$id" params={{ id: `${data.id}` }}>
      <Card className={"transition-all cursor-pointer   h-full"}>
        <CardHeader className="pb-2 border-b dark:border-b-zinc-700 h-16">
          <div className="flex justify-between items-center w-full gap-3">
            <div className="flex items-center gap-2">
              <div>
                <PopoverImage image={data.face} />
              </div>
              <h3 className="font-semibold text-[16px]">{data.full_name}</h3>
            </div>
            <span className="ml-1 text-sm whitespace-nowrap">
              {data.entry_log_status == 1 ? "Ofisda" : "Ofisdan tashqarida"}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="dark:bg-zinc-800 bg-zinc-100 rounded-lg p-3 shadow-sm">
              <div className="flex gap-2 items-center  mb-1">
                <LogIn className="h-4 w-4 text-green-500" />
                <p className="text-sm  text-gray-400">Kelish</p>
              </div>
              <p className="font-semibold">
                {formatDateTime(data?.attendance?.attendance_time) || "-"}
              </p>
            </div>
            <div className="dark:bg-zinc-800 bg-zinc-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center  mb-1 gap-2">
                <LogOut className="h-4 w-4 text-red-500" />
                <p className="text-sm  text-gray-400">Ketish</p>
              </div>
              <p className=" font-semibold">
                {formatDateTime(data?.attendance?.left_time) || "-"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="dark:bg-zinc-800 bg-zinc-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center  mb-1 gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <p className="text-sm  text-gray-400">Kechikish</p>
              </div>
              <p className="font-semibold">
                {data?.attendance && data?.attendance.status === 0
                  ? calculateTimeDifference(
                      data?.work_shift_start,
                      data?.attendance.attendance_time,
                    )
                  : "—"}
              </p>
            </div>
            <div className="dark:bg-zinc-800 bg-zinc-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center  mb-1 gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="text-sm  text-gray-400">Jami</p>
              </div>
              <p className=" font-semibold">
                {data?.attendance?.duration || "-"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default PositionHrCard;
