import type { AxiosResponse } from "axios";

export interface UserProfileResponse {
    ID: number;
    USER_ID: number;
    XP: number;
    level: number;
    avatar_url: string;
    bio: string | null;
    birth_date: string | null;
    birth_place: string | null;
    first_name: string;
    last_name: string;
    schools: string | null;
    friendCount: number;

    user: User;
}

export interface User {
    ID: number;
    username: string;
    email: string;
    role: string;
    is_active: number;
    password_hash: string;
    created_at: string;
    updated_at: string;
    last_login: string;

    post: UserPost[];
}

export interface UserPost {
    ID: number;
    USER_ID: number;
    title: string;
    content: string;
    media_url: string | null;
    like: number;
    dislike: number;
    visibility: boolean;
    created_at: string;
    updated_at: string;
}

export type AuthUser = {
    email: string
    exp: number
    iat: number
    role: "user" | "admin"
    userID: number
    username: string
}

export type AuthResponse = AxiosResponse<AuthUser>


export type AxiosErrorObject = {
    message: string
    name: string
    code: string
    config: object
    request: object
    response: {
        status: number
        statusText: string
        data: {
            message: string
            isOperational: boolean
            [key: string]: any
        }
        headers: object
        config: object
        request: object
    }
    stack?: string
}

export type UserProfil = {
    id: number;
    user_id: number;
    xp: number;
    avatar_url: string;
    bio: string;
    birth_date: string;
    birth_place: string;
    first_name: string;
    last_name: string;
    friendCount: number;
    level: number;
    schools: string;
}
