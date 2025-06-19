import { useCallback } from "react";
import usePermissions from "./use-permissions";

export default function useCheckPermission() {
  const { permissions } = usePermissions();
  const checkAllow = useCallback(
    (...allowed: Action[]) => {
      if (!permissions) {
        return false;
      }
      for (const permission of allowed) {
        if (permissions?.[permission]) {
          return true;
        }
      }

      return false;
    },
    [permissions],
  );

  return { checkAllow };
}
