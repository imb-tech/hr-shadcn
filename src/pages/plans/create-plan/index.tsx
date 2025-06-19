import { useUsersStore } from "@/store/user-ids";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import UsersList from "./user-list";

export default function CreatePlan() {
  const navigate = useNavigate();
  const current = new Date().getMonth() + 1;
  const { id: plan_id } = useParams({ from: "/_main/plans/$id" });
  const { usersId } = useUsersStore();

  return (
    <div>
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-2xl">Hodimlarni tanlang</h1>
        <Button
          disabled={!usersId.length}
          color="primary"
          variant="flat"
          size="lg"
          className={cn(
            "justify-center gap-1",
            !usersId.length && "cursor-not-allowed",
          )}
          onPress={() => {
            navigate({
              to: "/plans/payment",
              search: {
                plan_id,
                month:
                  current.toString() > "10"
                    ? `0${current.toString()}`
                    : `${current.toString()}`,
              },
            });
          }}
        >
          <span>To'lov qilish</span>
          <ArrowRight size={18} />
        </Button>
      </div>
      <UsersList />
    </div>
  );
}
