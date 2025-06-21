import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/layouts/theme"
import { ConfirmProvider } from "@/layouts/confirm"
import { PromptProvider } from "@/layouts/prompt"
import { ModalProvider } from "@/components/provider/modal-provider"

export const Route = createRootRoute({
    component: RootComponent,
    validateSearch: (search: SearchParams): SearchParams => {
        return {
            page: search?.page ?? undefined,
            filter: search.filter ?? undefined,
        }
    },
})

function RootComponent() {
    return (
        <ModalProvider>
            <ThemeProvider defaultTheme="dark" storageKey="theme">
                <ConfirmProvider>
                    <PromptProvider>
                        <Outlet />
                    </PromptProvider>
                </ConfirmProvider>
                <Toaster position="top-right" />
            </ThemeProvider>
        </ModalProvider>
    )
}
