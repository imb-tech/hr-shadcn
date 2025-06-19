type StatusType = {
    face:string
    id: number,
    full_name: string,
    start: string,
    end: string
    comment: string,
    response_comment: string,
    status: string | number
}

type Profile = {
    phone_number: string;
    username: string;
    first_name: string;
    last_name?: string;
    excuses?: number
    actions: Action[]
    role: string
    balance: number
    employees_count: number
}


type ListResponse<T> = {
    total_pages: number
    results: T[]
}