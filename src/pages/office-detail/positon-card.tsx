import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";

type Props = {
  item?: CompanyStats | null;
};

function PositonCard({ item }: Props) {
  const { id } = useParams({strict:false });

  return (
    <Link
      params={{ id: String(id) }}
      search={{ position: item?.id }}
      to="/position-hr-view/$id"
    >
      <Card className="sm:min-w-[300px] min-w-[350px] relative  hover:scale-105 transition-all cursor-pointer  shadow-none">
        <CardHeader className="pb-0">
          <h3 className="text-[16px] line-clamp-1 font-bold  ">
            {item?.role || "Ma'lumot topilmadi"}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded col-span-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">Jami ishchilar</p>
              <p className="font-medium">{item?.total || 0}</p>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded">
              <p className="text-sm text-gray-400">Kelganlar</p>
              <p className="font-medium">{item?.in_time || 0}</p>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded">
              <p className="text-sm text-gray-400">Kelmaganlar</p>
              <p className="font-medium">{item?.absent || 0}</p>
            </div>

            {/* <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded">
              <p className="text-sm text-gray-400">Kech qolganlar</p>
              <p className="font-medium">{item.late_users_count || 0}</p>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PositonCard;
