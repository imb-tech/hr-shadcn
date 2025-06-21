import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const educationLevels = [
    { label: "O'rta ta'lim", key: 1 },
    { label: "O'rta maxsus ta'lim", key: 2 },
    { label: "Kasb-hunar ta'limi", key: 3 },
    { label: "Tugallanmagan oliy ta'lim", key: 4 },
    { label: "Oliy ta'lim", key: 5 },
    { label: "Magistratura", key: 6 },
];
