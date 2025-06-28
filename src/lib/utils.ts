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



export const imagePaths = [
    "/task/fon1.jpg",
    "/task/fon2.jpg",
    "/task/fon3.jpg",
    "/task/fon4.jpg",
    "/task/fon5.jpg",
    "/task/fon6.jpg",
    "/task/fon7.jpg",
    "/task/fon8.jpg",
    "/task/fon9.jpg",
    "/task/fon10.jpg",
    "/task/fon11.jpg",
    "/task/fon12.jpg",
    "/task/fon13.jpg",
    "/task/fon14.jpg",
    "/task/fon15.jpg",
    "/task/fon16.jpg",
    "/task/fon17.jpg",
    "/task/fon18.jpg",
    "/task/fon19.png",
    "/task/fon20.jpg",
    "/task/fon21.jpg",
    "/task/fon22.jpg",
    "/task/fon23.png",
    "/task/fon24.png",
];


export function getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}