interface Members {
    id: string,
    name: string,
    email: string,
    avatar: string
}

export interface Room {
    id: string,
    name: string,
    createdAt: string,
    creatorId: string,
    members: Members[]
}