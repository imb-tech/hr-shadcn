import { Button, ButtonProps } from "./button"
import Private from "./private"

export default function PButton({
    allow,
    ...props
}: ButtonProps & { allow: Action[] }) {
    return (
        <Private allow={allow}>
            <Button {...props} />
        </Private>
    )
}
