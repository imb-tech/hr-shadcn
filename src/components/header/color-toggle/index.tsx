import { Button } from "../../ui/button"
import { Moon,  Sun } from "lucide-react"
import { useTheme } from "@/layouts/theme"

export function ThemeColorToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            onClick={() => {
                if (theme === "light") {
                    setTheme("dark")
                } else {
                    setTheme("light")
                }
            }}
            className="px-2"
            icon={theme === "light" ? <Sun width={20} /> : <Moon width={20} />}
        />
    )
}
