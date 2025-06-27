type SubTask = {
    id: number
    title: string
    finished: boolean
}

type QuoteCard = {
    id: number
    title: string
    desc: string
    priority: 1 | 2 | 3
    deadline: string
    subtasks: SubTask[]
    files: { file: any; type: string,id?:number }[] | []
    voiceNote: string[]
    users: number[]
    users_data: {
        id: number
        face: string,
        last_name: string,
        first_name: string
    }[]
    todo: number
    finished: number
}


type Column = {
    id: string
    name: string
    count: number
    has_delete:boolean
    tasks: QuoteCard[]
}

type FormValues = {
    name: string
    background: string
    author?: string
    id: number
    statuses: {
        name: string
        count: number
    }[]
    created_at: string
    users: {
        id: number
        face: string,
        last_name: string,
        first_name: string
    }[]
}