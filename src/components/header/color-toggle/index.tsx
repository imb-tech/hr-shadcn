import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Button } from "../../ui/button"
import { Moon, Palette, Sun } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { useTheme } from "@/layouts/theme"

export function ThemeColorToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className="px-2"
                    icon={<Palette width={20} />}
                />
            </PopoverTrigger>
            <PopoverContent className="space-y-4 w-auto">
                <div className="space-y-2">
                    <Label className="text-sm">Rejim</Label>
                    <div className="flex items-center gap-2">
                        <Button
                            icon={<Sun width={16} />}
                            variant="outline"
                            size="sm"
                            className={
                                theme === "light"
                                    ? "!border-2 !border-foreground"
                                    : "m-[1px]"
                            }
                            onClick={() => setTheme("light")}
                        >
                            Yorug'
                        </Button>
                        <Button
                            icon={<Moon width={16} />}
                            variant="outline"
                            size="sm"
                            className={
                                theme === "dark"
                                    ? "!border-2 !border-foreground"
                                    : "m-[1px]"
                            }
                            onClick={() => setTheme("dark")}
                        >
                            Tungi
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
