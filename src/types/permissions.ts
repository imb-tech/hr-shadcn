type Action =
    "excuse_view"
    | "excuse_confirmed"
    | "office_view"
    | "office_control"
    | "map_view"
    | "roles_view"
    | "roles_control"
    | "employee_view"
    | "employee_upload"
    | "employee_control"
    | "employee_download"
    | "balance_view"
    | "balance_history"
    | "balance_top_up"

type UserPermissions = Record<Action, boolean>
