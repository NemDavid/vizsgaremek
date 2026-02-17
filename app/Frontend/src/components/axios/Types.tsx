export interface AuthStatus {
    userID: number;
    username: string;
    email: string;
    role: "admin" | "user";
    iat: number;
    exp: number;
}

export interface ProfileData {
    ID: number
    USER_ID: number
    level: number
    XP: number
    first_name: string
    last_name: string
    birth_date: string
    birth_place: string
    schools: string
    bio: string
    avatar_url: string
    user: {
        ID: number
        email: string
        username: string
        role: "admin" | "user"
        is_active: number
        last_login: string
        created_at: string
        updated_at: string
        posts: Array<{
            ID: number
            USER_ID: number
            like: number
            dislike: number
            visibility: boolean
            content: string
            title: string
            media_url: string
            created_at: string
            updated_at: string
        }>
    }
    friendCount: number
}
