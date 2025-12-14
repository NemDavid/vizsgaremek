import axios from "axios"
import z from "zod"
import type { LoginSchema } from "../login-form"
import type { RegisterSchema } from "../signup-form"
import type { PostFormSchema } from "../comment-according"


export const ac = axios.create({
  baseURL: "http://localhost:6769",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const FileApi = axios.create({
  baseURL: "http://localhost:6769",
  withCredentials: true,
});

export type User = {
  ID: bigint;
  email: string;
  password_hash: string;
  username: string;
  role: "user" | "admin" | "moderator" | "owner";
  is_active: number; // TINYINT, 0 vagy 1
  last_login: string | null; // DATEONLY -> string formátumú dátum
  created_at: string; // DATEONLY -> string formátumú dátum
  updated_at: string; // DATEONLY -> string formátumú dátum
}
export type UserProfile = {
  USER_ID: bigint;
  first_name: string;
  last_name: string;
  birth_date: string | null; // DATEONLY → string formátumú dátum
  birth_place: string | null;
  schools: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export type UserPost = {
  ID: bigint
  USER_ID: bigint
  like: number
  dislike: number
  visibility: boolean
  content: string
  title: string
  media_url: string
  created_at: Date
  updated_at: Date
}

export type Post = {
  ID: bigint,
  USER_ID: bigint,
  like: number,
  dislike: number,
  content: string,
  title: string,
  media_url: string,
  created_at: Date,
  updated_at: Date,
  comments?: comment[],

}
export type comment = {
  ID: bigint,
  USER_ID: bigint,
  POST_ID: bigint,
  comment: string,
}



export type formSchema = z.infer<typeof formSchema>

export const formSchema = z.object({
  username: z.string().min(2, "Túl rövid").max(50),
  email: z.email("Érvénytelen email"),
  password: z.string().min(6, "Legalább 6 karakter"),
})

//AUTH ROUTES

export async function loginRequest(data: LoginSchema) {
  return await ac.post("/api/auth/login", data);
}

export async function RegisterRequest(data: RegisterSchema) {
  return await ac.post("/api/auth/register", data);
}

export async function RegisterConfirmRequest(data: FormData, token: string) {
  return await FileApi.post(`/api/auth/register/confirm/${token}`, data);
}

export async function authStatusRequest() {
  return await ac.get("/api/auth/status");
}

export async function logoutRequest() {
  return await ac.delete("/api/auth/logout");
}

// #TODO: 

export async function getuserByid(id: bigint) {
  const user = await ac.get<User>(`/api/users/id/${id}`)
  const profil = await ac.get<UserProfile>(`/api/profiles/${id}`)
  const adat = await {
    user: user.data,
    profil: profil.data,
  }
  return adat;
}

export async function getPostsAll() {
  const response = await ac.get<UserPost[]>(`/api/posts/all`)
  return response.data
}

export async function getPosts({page,perPage}:{page:number,perPage:number}) {
  const response = await ac.get<any>(`/api/posts`,{
    params:{
      page,
      perPage,
    }
  })
  return response.data
}


export async function createPost(data: FormData) {
  return await FileApi.post(`/api/posts`, data);
}

export async function makeReaction(data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) {
  return await ac.post(`/api/reactions`, data);
}

export async function getMyreaction(POST_ID: bigint) {
  const response = await ac.get(`/api/reactions/${POST_ID}`)
  return response.data
}

export async function MakeCommentForPost(comment: PostFormSchema) {
  const response = await ac.post(`/api/comments`, comment)
  return response.data
}

export async function TokenStatusRequest(Token: string) {
  return await ac.get(`/api/auth/token/${Token}`);
}

export async function SendOTPToPasswordReset(email: string) {
  return await ac.post(`/api/auth/reset/send-code`, { email });
}
//VTCR Verify the code request
export async function SendVTCR({ email, verify_code }: { verify_code: string, email: string }) {
  return await ac.post(`/api/auth/reset/verify-code`, { verify_code, email });
}
export async function ChangePassword({ userId, password }: { userId: number, password: string }) {
  return await ac.post(`/api/auth/reset/new_password`, { userId, password });
}

export async function GetFriends() {
  return await ac.get(`/api/connections/me`);
}

export async function GetProfil(id:string) {
  return await ac.get(`/api/profiles/${id}`);
}
//


//http://localhost:6769/api/users/1