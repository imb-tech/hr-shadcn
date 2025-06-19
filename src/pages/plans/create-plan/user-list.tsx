import {
  PAYMENTS_ROLES,
  PAYMENTS_ROLES_USERS,
} from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { useUsersStore } from "@/store/user-ids";
import { Accordion, AccordionItem, Checkbox, Skeleton } from "@heroui/react";
import { cn } from "@heroui/theme";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersList() {
  const [opened, setOpened] = useState<number | null>(null);

  const { data: roles } = useGet<PaymentsRoles[]>(`${PAYMENTS_ROLES}`);

  const { data: users, isFetching } = useGet<WorkerAttendance[]>(
    `${PAYMENTS_ROLES_USERS}/${opened}`,
    {
      options: { enabled: !!opened, staleTime: 60000 },
    },
  );
  const { addUserId, removeUserId, setUsersId, usersId } = useUsersStore();
  const [groups, setGroups] = useState<number[]>([]);

  const changeGroup = (checked: boolean, groupId: number) => {
    if (checked) {
      setGroups((prev) => {
        if (!prev.includes(groupId)) return [...prev, groupId];
        return prev;
      });

      setOpened(groupId);
    } else {
      setGroups((prev) => prev.filter((id) => id !== groupId));

      if (users && users.length) {
        const userIdsToRemove = users
          .filter((u) => u.role_id === groupId)
          .map((u) => u.id);

        setUsersId((prev) =>
          prev.filter((id) => !userIdsToRemove.includes(id)),
        );
      }
    }
  };

  const changeUser = (
    checked: boolean,
    userId: number,
    parentGroupId: number,
  ) => {
    if (checked) {
      addUserId(userId);

      if (users) {
        const groupUsers = users.filter((u) => u.role_id === parentGroupId);
        const allSelected = groupUsers.every((u) =>
          u.id === userId ? checked : usersId.includes(u.id),
        );

        if (allSelected && !groups.includes(parentGroupId)) {
          setGroups((prev) => [...prev, parentGroupId]);
        }
      }
    } else {
      removeUserId(userId);

      if (groups.includes(parentGroupId)) {
        setGroups((prev) => prev.filter((id) => id !== parentGroupId));
      }
    }
  };

  const isUserChecked = (userId: number) => {
    return usersId.includes(userId);
  };

  useEffect(() => {
    if (opened && groups.includes(opened) && users && users.length) {
      const newUserIds = users
        .filter((u) => u.role_id === opened)
        .map((u) => u.id);

      setUsersId((prev) => {
        const combined = [...prev];
        newUserIds.forEach((id) => {
          if (!combined.includes(id)) combined.push(id);
        });
        return combined;
      });
    }
  }, [users, opened, groups]);

  return (
    <Accordion
      variant="splitted"
      className="!p-0"
      selectedKeys={opened ? [String(opened)] : []}
      onSelectionChange={(keys) =>
        setOpened(Number(Array.from(keys)[0]) || null)
      }
    >
      {roles?.map((pos) => (
        <AccordionItem
          indicator={({ isOpen }) => (
            <ChevronDown
              className={cn(
                "text-zinc-500",
                isOpen ? "rotate-[270deg]" : "rotate-0",
              )}
            />
          )}
          key={pos.id}
          aria-label={pos.name}
          title={
            <div className="flex items-center">
              <Checkbox
                isSelected={groups.includes(pos.id)}
                onValueChange={(v) => changeGroup(v as boolean, pos.id)}
              />
              <span className="ml-2 block mr-3">{pos.name}</span>
            </div>
          }
        >
          {opened === pos.id &&
            (isFetching ? (
              <div className="flex gap-5 transition-all duration-150 pt-2 pb-4 px-4 ">
                <Skeleton className="h-[60px] w-full rounded-md" />
              </div>
            ) : (
              <ul className="pt-2 pb-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {users?.map((usr) => (
                  <li key={usr.id} className="cursor-pointer flex items-center">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        isSelected={isUserChecked(usr.id)}
                        onValueChange={(v) =>
                          changeUser(v as boolean, usr.id, pos.id)
                        }
                      />
                      <span>{usr.full_name}</span>
                    </label>
                  </li>
                ))}
                {!isFetching && !users?.length && (
                  <div className="text-gray-500 col-span-full text-center">
                    Hodimlar yo'q
                  </div>
                )}
              </ul>
            ))}
        </AccordionItem>
      )) ?? null}
    </Accordion>
  );
}
