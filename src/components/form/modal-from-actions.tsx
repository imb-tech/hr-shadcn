import { Button } from "../ui/button"

export default function ModalFormActions({
    isLoading = false,
}: {
    modalKey?: string
    isLoading?: boolean
}) {
    return (
        <Button
            color="primary"
            loading={isLoading}
            type="submit"
            className="mt-3"
        >
            Saqlash
        </Button>
    )
}
