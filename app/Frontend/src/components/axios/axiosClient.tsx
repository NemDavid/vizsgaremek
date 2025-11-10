import axios from "axios"
import z from "zod"
import type { LoginSchema } from "../login-form"
import type { RegisterSchema } from "../signup-form"
import type {ConfirmSchema} from "../profil-setup-form"
export const ac = axios.create({
  baseURL: "http://localhost:6769",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})
import type { PostcreateSchema } from "../Post-Create"

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

export type formSchema = z.infer<typeof formSchema>

export const formSchema = z.object({
  username: z.string().min(2, "Túl rövid").max(50),
  email: z.email("Érvénytelen email"),
  password: z.string().min(6, "Legalább 6 karakter"),
})


export async function loginRequest(data: LoginSchema ) {
  return await ac.post("/api/login",data);
}

export async function RegisterRequest(data: RegisterSchema ) {
  return await ac.post("/api/registerUser",data);
}

export async function RegisterConfirmRequest(data: ConfirmSchema,token: string ) {
  return await ac.post(`/api/confirm/${token}`,data);
}

export async function authStatusRequest() {
  return await ac.get("/api/status");
}

export async function logoutRequest() {
  return await ac.delete("/api/logout");
}


export async function getuserByid(id:bigint){
  const user = await ac.get<User>(`/api/user/${id}`)
  const profil = await ac.get<UserProfile>(`/api/user_profile/${id}`)
  const adat = await {
    user: user.data,
    profil: profil.data,
  }
  return adat;  
}

export async function getPosts() {
  const response = await ac.get<UserPost[]>("/api/user_posts")
  return response.data
}

export async function createPost(data:PostcreateSchema) {
  return await ac.post(`/api/user_post`,data);
}


//http://localhost:6769/api/users/1