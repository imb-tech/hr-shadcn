import { HR_API } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import formatPhoneNumber from "@/lib/formatter-phone";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { cn } from "@heroui/theme";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock, Phone, X } from "lucide-react";

const UserPopup = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "__root__" });
  const { data: item, isLoading } = useGet<Human>(`${HR_API}/${search?.id}`, {
    options: { enabled: Boolean(search?.id) },
  });

  // function handleHistory() {
  //   navigate({
  //     to: "/map",
  //     search: {
  //       ...search,
  //       route_id: item?.id,
  //     },
  //   });
  // }

  return (
    <Card className="min-w-[320px]">
      {isLoading || !item ? (
        ""
      ) : (
        <>
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar
              showFallback
              className="h-14 w-14"
              src={
                (item.face as string) ?? "https://images.unsplash.com/broken"
              }
            />
            <div className="pt-2">
              <h3 className="font-semibold">
                {item.first_name} {item.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{item.role_name}</p>
            </div>
            {/* // eslint-disable-next-file */}
            <button
              className="ml-auto text-rose-500 cursor-pointer"
              onClick={() =>
                navigate({ to: "/map", search: { ...search, id: undefined } })
              }
            >
              <X />
            </button>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2 mb-4">
              <div
                className={cn(
                  "text-sm rounded-full px-3 py-[2px]  dark:bg-zinc-800 border dark:border-zinc-700 text-green-500 border-green-500",
                )}
              >
                online
              </div>
              {/* <button
                className="flex gap-1 text-sm rounded-full px-3 py-[2px]  dark:bg-zinc-800 border dark:border-zinc-700 text-green-500 border-green-500 items-center cursor-pointer"
                onClick={handleHistory}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.293 5.207l3.5 3.5a1.001 1.001 0 0 0 1.665-.42l1.5-5a1 1 0 0 0-1.245-1.245l-5 1.5a1.003 1.003 0 0 0-.42 1.665z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M4.96 8.157c-1.708 1.501-1.952 4.168-.548 5.968 1.414 1.812 3.99 2.107 5.756.658l4.88-4.004a2.112 2.112 0 0 1 3.016.346c.749.96.617 2.4-.293 3.2l-1.043.916c-.409.36-.456.99-.106 1.41.35.42.966.468 1.375.108l1.043-.916c1.708-1.502 1.953-4.166.547-5.968-1.412-1.81-3.992-2.106-5.756-.658l-4.88 4.004a2.11 2.11 0 0 1-3.016-.346c-.747-.958-.616-2.4.293-3.2l.542-.415c.409-.36.46-.99.11-1.41a.964.964 0 0 0-1.38-.11l-.54.417z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M10 19a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>Tarix</span>
              </button> */}
            </div>

            <div className="space-y-4  h-full">
              <div className="flex items-center gap-3">
                <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tel</p>
                  <p>{formatPhoneNumber(Number(item.profile?.phone_number))}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Ish vaqti</p>
                  <p>
                    <span className="whitespace-nowrap lg:break-all">
                      {item?.work_shift_start?.slice(0, 5)} -{" "}
                      {item?.work_shift_end?.slice(0, 5)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {item?.attendance_json?.attendance_time ||
            item?.attendance_json?.left_time ? (
              <div className="mt-6 dark:bg-zinc-800 bg-zinc-100 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Kelish</p>
                  <p className="font-medium text-green-400">
                    {item?.attendance_json?.attendance_time
                      ? format(item?.attendance_json?.attendance_time, "HH:mm")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Ketish</p>
                  <p className="font-medium text-red-400">
                    {item?.attendance_json?.left_time
                      ? format(item?.attendance_json?.left_time, "HH:mm")
                      : "-"}
                  </p>
                </div>
              </div>
            ) : null}
          </CardBody>
        </>
      )}
    </Card>
  );
};

export default UserPopup;
