import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Button } from "../../ui/button"
import { Moon, Palette, Sun } from "lucide-react"
import { Label } from "@radix-ui/react-label"
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
            variant="secondary"
            className="px-2"
            icon={theme === "light" ? <Sun width={20} /> : <Moon width={20} />}
        />
    )
}
