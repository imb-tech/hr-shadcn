type SubTask= {
    id: number
    title: string
    completed: boolean
}

type QuoteCard = {
    id: number
    title: string
    description: string
    priority: string
    deadline: string
    responsible: string
    subtasks: SubTask[]
    images: string[]
    voiceNote: string[]
}

type Column = {
    id: string
    name: string
    items: QuoteCard[]
}
