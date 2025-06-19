import Private from "@/components/private";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COMPANIES } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Building2, CirclePlus, MapPin, Pencil } from "lucide-react";
import { useEffect, useRef } from "react";

function OfficeList() {
  const { id } = useParams({ from: "/_main/office/$id" });
  const { data: companies, isSuccess } = useGet<FeatureCollection>(COMPANIES);
  const navigate = useNavigate();

  const scrollbarRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());

  const setCardRef = (id: string | number, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(id, element);
    } else {
      cardRefs.current.delete(id);
    }
  };

  useEffect(() => {
    // if (window.innerWidth > 768) return;
    if (!id || !companies?.features || !scrollbarRef.current) return;

    // ID string sifatida keladi, shuning uchun to'g'ri taqqoslash uchun String() ishlatamiz
    const targetId = String(id);
    const targetCard = cardRefs.current.get(targetId);

    if (targetCard && scrollbarRef.current) {
      // Scrollni chapga taqash uchun offsetLeft ishlatamiz
      scrollbarRef.current.scrollTo({
        left: targetCard.offsetLeft - (window.innerWidth > 768 ? 300 : 50), // 10px margin uchun qo'shimcha
        behavior: "smooth",
      });
    }
  }, [id, companies]); // companies o'zgarsa ham qayta ishlaydi

  function handleNavigate(id: number | string) {
    navigate({
      to: "/office/$id",
      params: { id: String(id) },
    });
  }

  return (
    <div className="w-full">
      <div
        ref={scrollbarRef}
        className="flex flex-nowrap gap-3 overflow-x-auto py-1 my-3 no-scrollbar-x"
      >
        {isSuccess && !!companies
          ? companies?.features?.map((item) => (
              <Link
                key={item.id}
                params={{ id: String(item.id) }}
                to="/office/$id"
              >
                <Card
                  ref={(el) => setCardRef(String(item.id), el)}
                  className={cn(
                    "min-w-[300px] relative max-w-[300px] transition-all cursor-pointer h-[148px] shadow-none",
                    String(item.id) === id
                      ? "border border-primary"
                      : "border dark:border-zinc-800",
                  )}
                >
                  <CardContent
                    className={cn(
                      "font-semibold py-4  h-full flex flex-col justify-between",
                      String(item.id) === id && "text-primary",
                    )}
                  >
                    <Link
                      key={item.id}
                      className="dark:bg-zinc-800 bg-zinc-100 p-[10px] hover:text-primary rounded-full absolute top-2 right-2"
                      params={{ id: String(item.id) }}
                      to="/office-edit/$id"
                    >
                      <Pencil size={14} />
                    </Link>
                    <div className="flex items-center mb-4">
                      <Building2 className="h-10 w-10 text-primary mr-3" />
                      <h2
                        className="text-lg font-bold line-clamp-1 uppercase"
                        title={item.properties.name}
                      >
                        {item.properties.name}
                      </h2>
                    </div>

                    <div className="flex items-start mt-4">
                      <MapPin
                        className={cn(
                          "h-5 w-5 mr-2 mt-0.5 flex-shrink-0",
                          String(item.id) === id
                            ? "text-primary"
                            : "dark:text-gray-400",
                        )}
                      />
                      <div>
                        <p
                          className="text-sm dark:text-gray-300 line-clamp-2"
                          title={item.properties.address}
                        >
                          {item.properties.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          : Array.from({ length: 5 })?.map((_, index) => (
              <Card
                key={index}
                className="max-w-[300px] min-w-[300px] h-[148px] space-y-5 p-4"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="rounded-lg w-12 flex">
                    <div className="h-12 rounded-lg bg-default-300" />
                  </Skeleton>
                  <Skeleton className="rounded-lg w-1/2 flex">
                    <div className="h-4 w-full rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
                <div className="space-y-3">
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              </Card>
            ))}

        <Private allow={["office_control"]}>
          <Link to="/office/create">
            <Card
              className={cn(
                "min-w-[300px] max-w-[300px]  cursor-pointer dark:border-zinc-800 h-[148px] border",
              )}
            >
              <CardContent className={cn("font-semibold py-4 h-full ")}>
                <div className="flex items-center justify-center gap-2 h-full">
                  <p className="dark:text-gray-300 line-clamp-2 text-lg">
                    Ofis qo'shish
                  </p>
                  <CirclePlus />
                </div>
              </CardContent>
            </Card>
          </Link>
        </Private>
      </div>
      <div
        className={`grid gap-1`}
        style={{
          gridTemplateColumns: `repeat(${(companies?.features?.length || 0) + 1}, minmax(0, 1fr))`,
        }}
      >
        {companies?.features?.map((item, index) => (
          <button
            key={index}
            className="w-full py-1"
            onClick={() => handleNavigate(item.id)}
          >
            <div
              className={cn(
                "h-1 w-full transition-all duration-300 rounded-full cursor-pointer",
                String(item.id) === id ? "bg-primary" : "dark:bg-accent bg-zinc-300",
              )}
            />
          </button>
        ))}
        <Private allow={["office_control"]}>
          <Link className="w-full py-1" to="/office/create">
            <div
              className={cn(
                "h-1 w-full transition-all duration-300 rounded-full dark:bg-accent bg-zinc-300",
              )}
            />
          </Link>
        </Private>
      </div>
    </div>
  );
}

export default OfficeList;
