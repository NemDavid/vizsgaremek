import axios from "axios"
import z from "zod"
import type { LoginSchema } from "../login-form"
import type { RegisterSchema } from "../signup-form"
export const ac = axios.create({
  baseURL: "http://localhost:6769",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const RegApi = axios.create({
  baseURL: "http://localhost:6769",
  withCredentials: true,
});


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



export async function loginRequest(data: LoginSchema ) {
  return await ac.post("/api/login",data);
}

export async function RegisterRequest(data: RegisterSchema ) {
  return await ac.post("/api/registerUser",data);
}

export async function RegisterConfirmRequest(data: FormData, token: string) {
  return await RegApi.post(`/api/confirm/${token}`, data);
}

export async function authStatusRequest() {
  return await ac.get("/api/status");
}

export async function logoutRequest() {
  return await ac.delete("/api/logout");
}


export async function getuserByid(id:bigint){
  const user = await ac.get<User>(`/api/user/id/${id}`)
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

export async function makeReaction(data:{POST_ID:bigint; reaction:'like' | 'dislike'}) {
  return await ac.post(`/api/user_makeReaction`, data);
}
export async function getMyreaction(POST_ID: bigint) {
  const response = await ac.get(`/api/users_posts_reaction/${POST_ID}`)
  return response.data
}

import type { PostFormSchema } from "../comment-according"

export async function MakeCommentForPost(comment:PostFormSchema) {
  const response = await ac.post(`/api/users_posts_comment`,comment )
  return response.data
}

export async function TokenStatusRequest(Token: string) {
  return await ac.get(`/api/active_token/${Token}`);
}

export async function SendOTPToPasswordReset(email:string)
{
  return await ac.post(`/api/reset_password/send_verify_code`,{email});
}
//VTCR Verify the code request
export async function SendVTCR({email,verify_code}:{verify_code:string,email:string})
{
  return await ac.post(`/api/reset_password/verify_the_code`,{verify_code,email});
}
export async function ChangePassword({userId,password}:{userId:number,password:string})
{
  return await ac.post(`/api/reset_password/set_new_password`,{userId,password});
}

//


//http://localhost:6769/api/users/1