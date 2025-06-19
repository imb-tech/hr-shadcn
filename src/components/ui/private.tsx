import useCheckPermission from "@/hooks/use-check-permission"
import React from "react"

type Props = {
    allow: Action[]
    children: React.ReactNode
}

export default function Private({ allow, children }: Props) {
    const { checkAllow } = useCheckPermission()
    if (!checkAllow(...allow)) {
        return null
    }
    return children
}
