import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

const styles = [
    { id: "streets-v12", label: "Steet" },
    { id: "light-v11", label: "Light" },
    { id: "dark-v11", label: "Dark" },
    { id: "satellite-streets-v12", label: "Sputnik" },
]

export function MapStyleSwitcher({
    onChange,
    initial = "streets-v12",
}: {
    onChange: (styleId: string) => void
    initial?: string
}) {
    const [selected, setSelected] = useState(initial)

    const handleChange = (id: string) => {
        setSelected(id)
        onChange(id)
    }

    return (
        <div
            className="bg-background"
            style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                borderRadius: 6,
                padding: "4px 6px",
                fontSize: 11,
                zIndex: 2,
            }}
        >
            <RadioGroup
                orientation="horizontal"
                value={selected}
                onValueChange={(v) => handleChange(v)}
            >
                {styles.map((style) => (
                    <RadioGroupItem key={style.id} value={style.id}>
                        {style.label}
                    </RadioGroupItem>
                ))}
            </RadioGroup>
        </div>
    )
}
